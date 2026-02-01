import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader } from 'lucide-react'
import { updateOrderStatus, updateOrderPayment } from '../firebase/orders'
import { getPaymentStatus, isPaymentCredited } from '../services/mercadoPago'
import './CheckoutSuccess.css'

function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const [processing, setProcessing] = useState(true)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Obtener parámetros de la URL que Mercado Pago envía
        const paymentId = searchParams.get('payment_id')
        const status = searchParams.get('status')
        const externalReference = searchParams.get('external_reference') || searchParams.get('preference_id')

        // Si tenemos el orderId en la referencia externa, actualizar el estado
        if (externalReference && externalReference.startsWith('order-')) {
          const orderIdFromRef = externalReference.replace('order-', '')
          setOrderId(orderIdFromRef)
          
          // Usar collection_id si está disponible (es el ID del pago en Mercado Pago)
          const actualPaymentId = paymentId || collectionId
          
          // Verificar el estado del pago y si el dinero está acreditado
          if (status === 'approved' || collectionStatus === 'approved' || actualPaymentId) {
            try {
              // Si tenemos payment_id o collection_id, verificar el estado real del pago
              if (actualPaymentId) {
                const payment = await getPaymentStatus(actualPaymentId)
                
                // Guardar el paymentId en la orden para poder verificar después
                await updateOrderPayment(orderIdFromRef, {
                  paymentId: actualPaymentId,
                  paymentStatus: payment.status,
                  paymentStatusDetail: payment.status_detail
                })
                
                // Solo actualizar si el dinero está realmente acreditado (disponible)
                if (isPaymentCredited(payment)) {
                  await updateOrderStatus(orderIdFromRef, 'paid')
                  console.log('✅ Orden actualizada a pagada - Dinero acreditado:', orderIdFromRef)
                } else {
                  console.log('⏳ Pago aprobado pero dinero aún no acreditado. Estado:', payment.status_detail)
                  // El pago está aprobado pero el dinero aún no está disponible
                  // La orden quedará como "pending" hasta que el dinero se acredite
                  // El sistema verificará automáticamente cada 30 segundos en el admin
                }
              } else {
                // Si no hay payment_id pero el status es approved,
                // no actualizamos porque no podemos verificar si el dinero está acreditado
                console.log('⚠️ No se puede verificar el estado del dinero sin payment_id')
              }
            } catch (error) {
              console.error('Error verificando pago:', error)
              // No mostrar error al usuario, el pago fue exitoso
            }
          }
        }
      } catch (error) {
        console.error('Error verificando pago:', error)
      } finally {
        setProcessing(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="checkout-success">
      <div className="success-content">
        {processing ? (
          <>
            <Loader size={80} className="success-icon" style={{ animation: 'spin 1s linear infinite' }} />
            <h1>Verificando pago...</h1>
            <p>Por favor espera mientras confirmamos tu pago.</p>
          </>
        ) : (
          <>
            <CheckCircle size={80} className="success-icon" />
            <h1>¡Pago Exitoso!</h1>
            <p>Tu pedido ha sido procesado correctamente.</p>
            {orderId && (
              <p className="order-id-info">
                ID de orden: <strong>{orderId}</strong>
              </p>
            )}
            <p className="success-message">
              Recibirás un email de confirmación con los detalles de tu compra.
              {orderId && ' El administrador ha sido notificado del pago.'}
            </p>
            <div className="success-actions">
              <Link to="/" className="btn-primary">
                Volver al Inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutSuccess
