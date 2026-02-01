import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { updateOrderStatus } from '../firebase/orders'
import './CheckoutFailure.css'

function CheckoutFailure() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const updateOrderIfNeeded = async () => {
      try {
        const externalReference = searchParams.get('external_reference') || searchParams.get('preference_id')
        
        // Si tenemos el orderId, actualizar el estado a "cancelled"
        if (externalReference && externalReference.startsWith('order-')) {
          const orderId = externalReference.replace('order-', '')
          await updateOrderStatus(orderId, 'cancelled')
          console.log('Orden actualizada a cancelada:', orderId)
        }
      } catch (error) {
        console.error('Error actualizando orden:', error)
      }
    }

    updateOrderIfNeeded()
  }, [searchParams])

  return (
    <div className="checkout-failure">
      <div className="failure-content">
        <XCircle size={80} className="failure-icon" />
        <h1>Pago No Procesado</h1>
        <p>No se pudo procesar tu pago.</p>
        <p className="failure-message">
          Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
        </p>
        <div className="failure-actions">
          <Link to="/cart" className="btn-secondary">
            Volver al Carrito
          </Link>
          <Link to="/" className="btn-primary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFailure
