// Servicio para integración con Mercado Pago
// IMPORTANTE: Necesitas crear una cuenta de desarrollador en Mercado Pago
// https://www.mercadopago.cl/developers

// ⚠️ CREDENCIALES DE MERCADO PAGO
// Obtén tus credenciales en: https://www.mercadopago.cl/developers/panel/credentials
// 
// 📌 IMPORTANTE SOBRE EL TOKEN:
// - Solo necesitas configurar el Access Token UNA VEZ en la línea 9
// - Este mismo token se usa automáticamente en todas las funciones
// - NO necesitas poner tokens en otros lugares del código
// - Si tienes problemas para pagar, verifica:
//   1. Que el token sea válido (no expirado)
//   2. Que tu cuenta de Mercado Pago esté completamente verificada
//   3. Que estés usando el token correcto (TEST- para pruebas, APP_USR- para producción)

// Credenciales de Mercado Pago
// ⚠️ IMPORTANTE: Configura estas credenciales en el archivo .env
// - VITE_MERCADO_PAGO_PUBLIC_KEY: Se usa para operaciones del frontend (opcional)
// - VITE_MERCADO_PAGO_ACCESS_TOKEN: Se usa para crear preferencias de pago (requerido)
const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || ''
const MERCADO_PAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || ''

// Verificar que el token sea válido haciendo una petición de prueba
export const verifyAccessToken = async () => {
  try {
    const response = await fetch('https://api.mercadopago.com/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Token inválido:', errorData)
      
      if (response.status === 401) {
        throw new Error('Token inválido o expirado. Por favor obtén un nuevo token en https://www.mercadopago.cl/developers/panel/credentials')
      }
      throw new Error(`Error verificando token: ${response.status}`)
    }

    const userData = await response.json()
    console.log('✅ Token válido. Cuenta:', userData.email || userData.id)
    return { valid: true, user: userData }
  } catch (error) {
    console.error('Error verificando token:', error)
    throw error
  }
}

// Crear preferencia de pago en Mercado Pago
export const createPaymentPreference = async (orderData) => {
  console.log('🚀 INICIANDO createPaymentPreference')
  console.log('📦 orderData recibido:', orderData)
  
  // Validar que el token esté configurado
  if (!MERCADO_PAGO_ACCESS_TOKEN || 
      MERCADO_PAGO_ACCESS_TOKEN === 'TU_ACCESS_TOKEN_AQUI' || 
      MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
    console.error('❌ ERROR: Access Token de Mercado Pago no configurado')
    console.error('Por favor configura VITE_MERCADO_PAGO_ACCESS_TOKEN en el archivo .env')
    throw new Error('Access Token de Mercado Pago no configurado. Por favor configura VITE_MERCADO_PAGO_ACCESS_TOKEN en el archivo .env')
  }
  
  console.log('✅ Access Token configurado correctamente')

  // Validar formato del token
  if (!MERCADO_PAGO_ACCESS_TOKEN.startsWith('APP_USR-') && 
      !MERCADO_PAGO_ACCESS_TOKEN.startsWith('TEST-')) {
    console.error('❌ ERROR: Access Token con formato inválido')
    console.error('El token debe comenzar con APP_USR- (producción) o TEST- (prueba)')
    throw new Error('Access Token con formato inválido. Debe comenzar con APP_USR- o TEST-')
  }

  try {
    // Validar que haya items
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('No hay productos en el carrito')
    }

    // Validar datos del cliente
    if (!orderData.customer || !orderData.customer.name || !orderData.customer.email) {
      throw new Error('Faltan datos del cliente (nombre o email)')
    }

    // Calcular el total (productos + envío) y crear UN SOLO item
    let totalAmount = 0
    
    // Sumar todos los productos
    orderData.items.forEach(item => {
      if (!item.name || !item.quantity || !item.price) {
        throw new Error('Faltan datos de algún producto (nombre, cantidad o precio)')
      }
      const price = Math.round(Number(item.price))
      const quantity = Math.round(Number(item.quantity))
      
      if (price <= 0 || quantity <= 0) {
        throw new Error(`El producto "${item.name}" tiene precio o cantidad inválida`)
      }
      
      totalAmount += price * quantity
    })
    
    // Agregar costo de envío si existe
    if (orderData.shippingCost && orderData.shippingCost > 0) {
      const shippingPrice = Math.round(Number(orderData.shippingCost))
      if (shippingPrice > 0) {
        totalAmount += shippingPrice
      }
    }
    
    // Validar que el total sea mayor a 0
    if (totalAmount <= 0) {
      throw new Error('El total del pedido debe ser mayor a 0')
    }
    
    // Crear UN SOLO item con el total
    const items = [{
      title: 'Pedido CubingMate',
      quantity: 1,
      unit_price: totalAmount,
      currency_id: 'CLP'
    }]

    // Preparar teléfono (simplificado para evitar problemas con Mercado Pago)
    // Nota: phoneNumber se declara más abajo
    
    // Obtener la URL base de forma segura
    let baseUrl = 'http://localhost:5173' // Valor por defecto
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      baseUrl = window.location.origin
    }
    
    // Asegurar que las URLs sean absolutas y válidas (sin espacios ni caracteres especiales)
    const successUrl = `${baseUrl}/checkout/success`.trim()
    const failureUrl = `${baseUrl}/checkout/failure`.trim()
    const pendingUrl = `${baseUrl}/checkout/pending`.trim()
    
    // Validar que las URLs sean válidas y no estén vacías
    if (!successUrl || !failureUrl || !pendingUrl || 
        successUrl === 'undefined/checkout/success' || 
        failureUrl === 'undefined/checkout/failure' || 
        pendingUrl === 'undefined/checkout/pending') {
      console.error('Error generando URLs:', { baseUrl, successUrl, failureUrl, pendingUrl })
      throw new Error('No se pudieron generar las URLs de retorno. Verifica que window.location.origin esté disponible.')
    }
    
    // Validar formato de URLs (deben empezar con http:// o https://)
    if (!successUrl.startsWith('http://') && !successUrl.startsWith('https://')) {
      throw new Error(`URL de éxito inválida: ${successUrl}`)
    }
    if (!failureUrl.startsWith('http://') && !failureUrl.startsWith('https://')) {
      throw new Error(`URL de fallo inválida: ${failureUrl}`)
    }
    if (!pendingUrl.startsWith('http://') && !pendingUrl.startsWith('https://')) {
      throw new Error(`URL de pendiente inválida: ${pendingUrl}`)
    }
    
    console.log('URLs de retorno configuradas:', { successUrl, failureUrl, pendingUrl, baseUrl })
    
    // Validar email
    const email = orderData.customer.email.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido')
    }
    
    // Validar nombre
    const name = orderData.customer.name.trim()
    if (!name || name.length < 2) {
      throw new Error('Nombre inválido (debe tener al menos 2 caracteres)')
    }
    
    // Preparar nombre y apellido correctamente
    let firstName = orderData.customer.nombre || name.split(' ')[0] || name
    let lastName = orderData.customer.apellido || ''
    
    // Si no hay apellido separado, intentar extraerlo del nombre completo
    if (!lastName && name.includes(' ')) {
      const nameParts = name.split(' ').filter(part => part.trim().length > 0)
      if (nameParts.length >= 2) {
        firstName = nameParts[0]
        lastName = nameParts.slice(1).join(' ')
      }
    }
    
    // Si aún no hay apellido, usar el nombre como apellido (requerido por MP)
    if (!lastName || lastName.trim() === '') {
      lastName = firstName
    }
    
    // Preparar datos del payer - Información completa
    const payer = {
      name: firstName.substring(0, 50),
      surname: lastName.substring(0, 50),
      email: email
    }
    
    // Agregar teléfono SIEMPRE (OBLIGATORIO para habilitar botón)
    let phoneToUse = ''
    if (orderData.customer.phone && orderData.customer.phone.trim()) {
      const phone = orderData.customer.phone.replace(/\D/g, '') // Solo números
      phoneToUse = phone
      
      // Quitar código de país si está
      if (phoneToUse.startsWith('56')) {
        phoneToUse = phoneToUse.substring(2)
      }
    }
    
    // Validar que haya teléfono - NO usar datos por defecto
    if (!phoneToUse || phoneToUse.length < 8) {
      throw new Error('El teléfono es obligatorio y debe tener al menos 8 dígitos. Por favor ingresa tu teléfono completo.')
    }
    
    // Validar que tenga entre 8 y 9 dígitos (formato chileno)
    if (phoneToUse.length >= 8 && phoneToUse.length <= 9) {
      payer.phone = {
        area_code: '56',
        number: phoneToUse
      }
    }
    
    // Agregar dirección SIEMPRE (OBLIGATORIO para habilitar botón)
    // NO usar datos por defecto - solo usar datos reales del usuario
    if (orderData.shipping && orderData.shipping.calle && orderData.shipping.calle.trim()) {
      payer.address = {
        street_name: orderData.shipping.calle.substring(0, 100),
        zip_code: orderData.shipping.codigoPostal || '0000000'
      }
      
      // Agregar número de calle si existe
      if (orderData.shipping.numero && orderData.shipping.numero.trim()) {
        const streetNumber = parseInt(orderData.shipping.numero)
        if (!isNaN(streetNumber) && streetNumber > 0) {
          payer.address.street_number = streetNumber
        }
      } else if (orderData.shipping.calleSinNumero) {
        // Si la calle no tiene número, usar 0
        payer.address.street_number = 0
      }
      
      // Agregar ciudad (OBLIGATORIO para habilitar botón)
      if (orderData.customer.city && orderData.customer.city.trim()) {
        payer.address.city_name = orderData.customer.city.substring(0, 50)
      } else if (orderData.shipping.comuna && orderData.shipping.comuna.trim()) {
        payer.address.city_name = orderData.shipping.comuna.substring(0, 50)
      } else {
        payer.address.city_name = 'Santiago' // Valor por defecto si no hay ciudad
      }
      
      // Agregar estado/región (OBLIGATORIO para Chile)
      payer.address.state_name = 'Región Metropolitana'
      
      // Agregar país (OBLIGATORIO)
      payer.address.country_name = 'Chile'
    } else {
      // Si no hay dirección, lanzar error - NO usar datos falsos
      throw new Error('La dirección de envío es obligatoria. Por favor completa todos los campos de dirección.')
    }
    
    // Configuración completa para habilitar el botón de pago
    const preferenceData = {
      items: items,
      payer: payer,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl
      },
      external_reference: `order-${orderData.orderId}`,
      // Habilitar métodos de pago específicos
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12 // Permitir hasta 12 cuotas
      }
    }
    
    // Asegurar que back_urls tenga todas las URLs requeridas
    if (!preferenceData.back_urls.success || !preferenceData.back_urls.failure || !preferenceData.back_urls.pending) {
      console.error('Error: back_urls incompleto:', preferenceData.back_urls)
      throw new Error('Las URLs de retorno no están completas')
    }
    
    // Validar que los items tengan datos válidos
    if (!preferenceData.items || preferenceData.items.length === 0) {
      throw new Error('No hay productos en el pedido')
    }
    
    // Validar que todos los items tengan precio válido
    for (const item of preferenceData.items) {
      if (!item.unit_price || item.unit_price <= 0) {
        throw new Error(`El producto "${item.title}" no tiene un precio válido`)
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`El producto "${item.title}" no tiene una cantidad válida`)
      }
    }
    
    // Validar que el payer tenga todos los campos requeridos
    if (!payer.name || !payer.surname || !payer.email) {
      throw new Error('Faltan datos del payer (nombre, apellido o email)')
    }
    
    if (!payer.phone || !payer.phone.number) {
      throw new Error('Falta teléfono del payer')
    }
    
    if (!payer.address || !payer.address.street_name) {
      throw new Error('Falta dirección del payer')
    }
    
    console.log('=== DATOS ENVIADOS A MERCADO PAGO ===')
    console.log('Total:', totalAmount)
    console.log('Payer completo:', JSON.stringify(payer, null, 2))
    console.log('Items:', JSON.stringify(preferenceData.items, null, 2))
    console.log('URLs:', preferenceData.back_urls)
    console.log('Payment Methods:', preferenceData.payment_methods)
    console.log('Datos completos de la preferencia:', JSON.stringify(preferenceData, null, 2))
    console.log('=====================================')
    
    // Verificar que todos los campos requeridos estén presentes
    console.log('✅ Verificación de datos:')
    console.log('- Nombre:', payer.name ? '✓' : '✗')
    console.log('- Apellido:', payer.surname ? '✓' : '✗')
    console.log('- Email:', payer.email ? '✓' : '✗')
    console.log('- Teléfono:', payer.phone ? '✓' : '✗')
    console.log('- Dirección:', payer.address ? '✓' : '✗')
    if (payer.address) {
      console.log('  - Calle:', payer.address.street_name ? '✓' : '✗')
      console.log('  - Número:', payer.address.street_number !== undefined ? '✓' : '✗')
      console.log('  - Ciudad:', payer.address.city_name ? '✓' : '✗')
      console.log('  - Estado:', payer.address.state_name ? '✓' : '✗')
      console.log('  - País:', payer.address.country_name ? '✓' : '✗')
      console.log('  - Código Postal:', payer.address.zip_code ? '✓' : '✗')
    }
    console.log('- Items:', preferenceData.items.length > 0 ? '✓' : '✗')

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Error de Mercado Pago - Status:', response.status)
      console.error('❌ Respuesta completa:', JSON.stringify(responseData, null, 2))
      
      // Mensajes de error más específicos
      let errorMessage = 'Error al crear preferencia de pago'
      
      if (responseData.message) {
        errorMessage = responseData.message
      } else if (responseData.error) {
        errorMessage = responseData.error
      } else if (responseData.cause && responseData.cause.length > 0) {
        const causes = responseData.cause.map(c => c.description || c.message || c.code).filter(Boolean)
        errorMessage = causes.join(', ')
      }
      
      // Agregar información adicional según el código de error
      if (response.status === 401) {
        errorMessage = '❌ Access Token inválido o expirado.\n\n' +
          'SOLUCIÓN:\n' +
          '1. Ve a: https://www.mercadopago.cl/developers/panel/credentials\n' +
          '2. Copia tu Access Token (debe comenzar con APP_USR- para producción o TEST- para pruebas)\n' +
          '3. Abre el archivo: .env\n' +
          '4. Reemplaza el valor de VITE_MERCADO_PAGO_ACCESS_TOKEN con tu token\n' +
          '5. ⚠️ IMPORTANTE: Reinicia el servidor de desarrollo después de cambiar el .env'
      } else if (response.status === 400) {
        // Mostrar detalles específicos del error
        const causes = responseData.cause || []
        const causeMessages = causes.map(c => c.description || c.message || c.code).filter(Boolean)
        
        errorMessage = `❌ Datos inválidos enviados a Mercado Pago\n\n` +
          `Error: ${errorMessage}\n\n` +
          (causeMessages.length > 0 ? `Detalles:\n${causeMessages.join('\n')}\n\n` : '') +
          'Verifica que:\n' +
          '- Todos los campos estén completos (nombre, apellido, email, teléfono, dirección)\n' +
          '- El email tenga formato válido\n' +
          '- El teléfono tenga al menos 8 dígitos\n' +
          '- La dirección esté completa (calle y número)\n' +
          '- Los precios sean números válidos mayores a 0'
      } else if (response.status === 403) {
        errorMessage = '❌ Acceso denegado.\n\n' +
          'Posibles causas:\n' +
          '1. Tu cuenta de Mercado Pago no está completamente verificada\n' +
          '2. Tu Access Token no tiene los permisos necesarios\n' +
          '3. Tu cuenta tiene restricciones\n\n' +
          'SOLUCIÓN:\n' +
          '1. Ve a: https://www.mercadopago.cl\n' +
          '2. Verifica que tu cuenta esté completa (email, teléfono, datos personales)\n' +
          '3. Si usas token de producción (APP_USR-), asegúrate de haber completado el proceso de verificación\n' +
          '4. Obtén un nuevo token en: https://www.mercadopago.cl/developers/panel/credentials'
      } else if (response.status >= 500) {
        errorMessage = '❌ Error del servidor de Mercado Pago.\n\n' +
          'Intenta nuevamente en unos momentos. Si el problema persiste, contacta al soporte de Mercado Pago.'
      }
      
      throw new Error(`${errorMessage}\n\nCódigo de error: ${response.status}`)
    }

    if (!responseData.init_point) {
      console.error('❌ ERROR: No se recibió init_point de Mercado Pago')
      console.error('Respuesta completa:', responseData)
      throw new Error('No se recibió la URL de pago de Mercado Pago')
    }

    console.log('✅ Preferencia creada exitosamente')
    console.log('URL de pago:', responseData.init_point)
    console.log('ID de preferencia:', responseData.id)

    return responseData.init_point // URL de pago
  } catch (error) {
    console.error('Error creando preferencia de pago:', error)
    if (error.message) {
      throw error
    }
    throw new Error('Error al conectar con Mercado Pago. Verifica tu conexión a internet.')
  }
}

// Verificar estado de un pago
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener estado del pago')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo estado del pago:', error)
    throw error
  }
}

// Verificar si el dinero está realmente acreditado (disponible en la cuenta)
export const isPaymentCredited = (payment) => {
  // El pago debe estar aprobado
  if (payment.status !== 'approved') {
    return false
  }

  // Verificar que el dinero esté acreditado (disponible)
  // status_detail puede ser: "accredited" (acreditado), "pending_contingency" (pendiente), etc.
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

  // Por defecto, si está approved pero no sabemos si está acreditado, retornar false
  // para ser más conservador y solo notificar cuando estemos seguros
  return false
}

// Exportar credenciales por si se necesitan en otros componentes
export { MERCADO_PAGO_PUBLIC_KEY, MERCADO_PAGO_ACCESS_TOKEN }
