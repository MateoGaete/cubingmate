// Servidor webhook para recibir notificaciones de Mercado Pago
// Basado en: https://www.mercadopago.cl/developers/es/docs/checkout-pro/payment-notifications

import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.WEBHOOK_PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuración de Firebase para el servidor
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

// Secret key del webhook (obtenido del panel de Mercado Pago)
const WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET || ''

// Función para validar la firma HMAC de Mercado Pago
function validateHMAC(xSignature, xRequestId, dataId, ts, hash) {
  if (!WEBHOOK_SECRET) {
    console.warn('⚠️ WEBHOOK_SECRET no configurado. La validación HMAC será omitida.')
    return true // En desarrollo, permitir sin validación si no hay secret
  }

  // Generar el manifest string según la documentación
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

  // Crear HMAC SHA256
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  hmac.update(manifest)
  const calculatedHash = hmac.digest('hex')

  // Comparar hashes
  return calculatedHash === hash
}

// Función para obtener el estado del pago desde Mercado Pago
async function getPaymentStatus(paymentId) {
  const accessToken = process.env.VITE_MERCADO_PAGO_ACCESS_TOKEN
  
  if (!accessToken) {
    throw new Error('Access Token de Mercado Pago no configurado')
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error obteniendo pago: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error obteniendo estado del pago:', error)
    throw error
  }
}

// Función para verificar si el dinero está acreditado
function isPaymentCredited(payment) {
  // El pago debe estar aprobado
  if (payment.status !== 'approved') {
    return false
  }

  // Verificar que el dinero esté acreditado (disponible)
  const statusDetail = payment.status_detail?.toLowerCase() || ''
  
  // Si el status_detail es "accredited", el dinero está disponible
  if (statusDetail === 'accredited') {
    return true
  }

  // Si no hay status_detail pero el pago está approved y tiene transaction_details,
  // generalmente significa que está acreditado
  if (payment.transaction_details && payment.transaction_details.financial_institution) {
    return true
  }

  return false
}

// Función para actualizar la orden en Firebase
async function updateOrderFromPayment(payment) {
  try {
    // Obtener el external_reference que contiene el orderId
    const externalReference = payment.external_reference
    
    if (!externalReference || !externalReference.startsWith('order-')) {
      console.warn('⚠️ External reference no válido o no contiene orderId:', externalReference)
      return null
    }

    const orderId = externalReference.replace('order-', '')
    
    // Verificar que la orden existe
    const orderRef = doc(db, 'orders', orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (!orderSnap.exists()) {
      console.warn('⚠️ Orden no encontrada:', orderId)
      return null
    }

    // Actualizar información del pago
    await updateDoc(orderRef, {
      paymentId: payment.id.toString(),
      paymentStatus: payment.status,
      paymentStatusDetail: payment.status_detail,
      paymentMethod: payment.payment_method_id,
      paymentType: payment.payment_type_id,
      updatedAt: serverTimestamp()
    })

    // Si el dinero está acreditado, actualizar el estado a "paid"
    if (isPaymentCredited(payment)) {
      await updateDoc(orderRef, {
        status: 'paid',
        updatedAt: serverTimestamp()
      })
      console.log('✅ Orden actualizada a pagada - Dinero acreditado:', orderId)
    } else if (payment.status === 'approved') {
      // Pago aprobado pero dinero aún no acreditado
      console.log('⏳ Pago aprobado pero dinero aún no acreditado. Estado:', payment.status_detail)
    } else if (payment.status === 'rejected') {
      // Pago rechazado
      await updateDoc(orderRef, {
        status: 'rejected',
        updatedAt: serverTimestamp()
      })
      console.log('❌ Orden rechazada:', orderId)
    } else if (payment.status === 'cancelled') {
      // Pago cancelado
      await updateDoc(orderRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      })
      console.log('🚫 Orden cancelada:', orderId)
    }

    return orderId
  } catch (error) {
    console.error('Error actualizando orden desde pago:', error)
    throw error
  }
}

// Endpoint del webhook
app.post('/api/webhook/mercadopago', async (req, res) => {
  try {
    console.log('📨 Notificación recibida de Mercado Pago')
    console.log('Headers:', JSON.stringify(req.headers, null, 2))
    console.log('Body:', JSON.stringify(req.body, null, 2))
    console.log('Query params:', JSON.stringify(req.query, null, 2))

    // Obtener headers necesarios (case-insensitive)
    const xSignature = req.headers['x-signature'] || req.headers['X-Signature']
    const xRequestId = req.headers['x-request-id'] || req.headers['X-Request-Id']

    // Obtener data.id de los query params o del body
    // Mercado Pago puede enviarlo en diferentes formatos
    const dataId = req.query['data.id'] || 
                   req.query['data_id'] || 
                   req.body?.data?.id || 
                   req.body?.data_id

    if (!xSignature || !xRequestId || !dataId) {
      console.error('❌ Faltan parámetros requeridos en la notificación')
      return res.status(400).json({ error: 'Faltan parámetros requeridos' })
    }

    // Extraer ts y v1 del x-signature
    // Formato: ts=1234567890,v1=abc123...
    const parts = xSignature.split(',')
    let ts = ''
    let hash = ''

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key.trim() === 'ts') {
        ts = value.trim()
      } else if (key.trim() === 'v1') {
        hash = value.trim()
      }
    }

    if (!ts || !hash) {
      console.error('❌ No se pudo extraer ts o hash del x-signature')
      return res.status(400).json({ error: 'Formato de x-signature inválido' })
    }

    // Validar HMAC
    const isValid = validateHMAC(xSignature, xRequestId, dataId, ts, hash)
    
    if (!isValid) {
      console.error('❌ Validación HMAC fallida')
      return res.status(401).json({ error: 'Firma inválida' })
    }

    console.log('✅ Validación HMAC exitosa')

    // Obtener el tipo de notificación
    const notificationType = req.body?.type || req.query?.type || 'payment'

    // Procesar según el tipo de notificación
    if (notificationType === 'payment' || !notificationType) {
      const paymentId = dataId
      
      if (!paymentId) {
        console.error('❌ No se pudo obtener el ID del pago')
        return res.status(400).json({ error: 'ID de pago no encontrado' })
      }
      
      // Obtener información completa del pago desde Mercado Pago
      const payment = await getPaymentStatus(paymentId)
      
      console.log('💳 Información del pago:', JSON.stringify(payment, null, 2))
      
      // Actualizar la orden en Firebase
      const orderId = await updateOrderFromPayment(payment)
      
      if (orderId) {
        console.log('✅ Orden actualizada exitosamente:', orderId)
      }
    } else {
      console.log('ℹ️ Tipo de notificación no procesado:', notificationType)
    }

    // Responder con HTTP 200 para confirmar recepción
    // Mercado Pago espera esta respuesta dentro de 22 segundos
    res.status(200).json({ 
      received: true,
      message: 'Notificación procesada correctamente'
    })

  } catch (error) {
    console.error('❌ Error procesando notificación:', error)
    
    // Aún así responder 200 para evitar reintentos innecesarios
    // pero registrar el error para debugging
    res.status(200).json({ 
      received: true,
      error: error.message 
    })
  }
})

// Endpoint de salud para verificar que el servidor está funcionando
app.get('/api/webhook/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Webhook server is running',
    timestamp: new Date().toISOString()
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor webhook iniciado en http://localhost:${PORT}`)
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/webhook/mercadopago`)
  console.log(`💚 Health check: http://localhost:${PORT}/api/webhook/health`)
  
  if (!WEBHOOK_SECRET) {
    console.warn('⚠️ ADVERTENCIA: MERCADO_PAGO_WEBHOOK_SECRET no está configurado')
    console.warn('⚠️ La validación HMAC será omitida. Configura el secret en producción.')
  }
})
