import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import './CheckoutPending.css'

function CheckoutPending() {
  return (
    <div className="checkout-pending">
      <div className="pending-content">
        <Clock size={80} className="pending-icon" />
        <h1>Pago Pendiente</h1>
        <p>Tu pago está siendo procesado.</p>
        <p className="pending-message">
          Recibirás un email de confirmación una vez que el pago sea aprobado.
          Esto puede tardar unos minutos.
        </p>
        <div className="pending-actions">
          <Link to="/" className="btn-primary">
            Volver al Inicio
          </Link>
          <Link to="/profile" className="btn-secondary">
            Ver Mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPending
