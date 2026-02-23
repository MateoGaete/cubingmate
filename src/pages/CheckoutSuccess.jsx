import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader } from 'lucide-react'
import './CheckoutSuccess.css'

function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const [processing, setProcessing] = useState(true)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    // Obtener orderId de los parámetros de la URL
    const orderIdParam = searchParams.get('orderId')
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
    setProcessing(false)
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
