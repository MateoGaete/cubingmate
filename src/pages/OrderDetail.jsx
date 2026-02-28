import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOrderById } from '../firebase/orders'
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  FileText
} from 'lucide-react'
import './OrderDetail.css'

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const loadOrder = async () => {
      try {
        setLoading(true)
        const orderData = await getOrderById(id)
        
        // Verificar que la orden pertenece al usuario actual
        if (orderData.userId !== currentUser.uid) {
          setError('No tienes permiso para ver esta orden')
          return
        }
        
        setOrder(orderData)
      } catch (error) {
        console.error('Error cargando orden:', error)
        setError('Error al cargar la orden')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id, currentUser, navigate])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const getStatusInfo = (status) => {
    const statusLower = status?.toLowerCase() || 'pending'
    
    switch (statusLower) {
      case 'completed':
      case 'completado':
        return {
          text: 'Completado',
          class: 'status-completed',
          icon: CheckCircle,
          message: 'Tu pedido ha sido completado y entregado'
        }
      case 'pending':
      case 'pendiente':
        return {
          text: 'En Procedimiento',
          class: 'status-processing',
          icon: Clock,
          message: 'Tu pedido está siendo procesado'
        }
      case 'cancelled':
      case 'cancelado':
        return {
          text: 'Cancelado',
          class: 'status-cancelled',
          icon: XCircle,
          message: 'Esta orden ha sido cancelada'
        }
      case 'shipped':
      case 'enviado':
        return {
          text: 'En Camino',
          class: 'status-shipped',
          icon: Truck,
          message: 'Tu pedido está en camino'
        }
      default:
        return {
          text: 'En Procedimiento',
          class: 'status-processing',
          icon: Clock,
          message: 'Tu pedido está siendo procesado'
        }
    }
  }

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="loading-container">
          <Package size={48} />
          <p>Cargando detalles de tu orden...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="error-container">
          <XCircle size={48} />
          <p>{error || 'Orden no encontrada'}</p>
          <button onClick={() => navigate('/profile')} className="btn-back">
            Volver a Mis Compras
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <button onClick={() => navigate('/profile')} className="back-btn">
          <ArrowLeft size={18} />
          Volver a Mis Compras
        </button>

        <div className="order-detail-header">
          <div className="order-number-section">
            <FileText size={32} />
            <div>
              <h1>Detalles de mi Producto</h1>
              <p className="order-number">Número de Orden: <strong>#{order.id}</strong></p>
            </div>
          </div>
          <div className={`status-badge-large ${statusInfo.class}`}>
            <StatusIcon size={24} />
            <span>{statusInfo.text}</span>
          </div>
        </div>

        <div className="status-message-box">
          <StatusIcon size={20} />
          <p>{statusInfo.message}</p>
        </div>

        <div className="order-detail-grid">
          {/* Información de Estado */}
          <div className="detail-card status-card">
            <h2>
              <Clock size={24} />
              Estado del Pedido
            </h2>
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Estado Actual:</span>
                <span className={`status-value ${statusInfo.class}`}>
                  {statusInfo.text}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Fecha de Creación:</span>
                <span className="status-value">{formatDate(order.createdAt)}</span>
              </div>
              {order.updatedAt && (
                <div className="status-item">
                  <span className="status-label">Última Actualización:</span>
                  <span className="status-value">{formatDate(order.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div className="detail-card products-card">
            <h2>
              <Package size={24} />
              Productos Comprados
            </h2>
            {order.items && order.items.length > 0 ? (
              <div className="products-list">
                {order.items.map((item, index) => (
                  <div key={index} className="product-item">
                    <div className="product-item-info">
                      <h3>{item.name}</h3>
                      <p className="product-quantity">Cantidad: {item.quantity}</p>
                      <p className="product-price">
                        {formatPrice(item.price)} x {item.quantity} = {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No hay productos en esta orden</p>
            )}
          </div>

          {/* Información de Cliente */}
          {order.customer && (
            <div className="detail-card customer-card">
              <h2>
                <User size={24} />
                Información del Cliente
              </h2>
              <div className="customer-info">
                {order.customer.name && (
                  <div className="info-row">
                    <User size={18} />
                    <span><strong>Nombre:</strong> {order.customer.name}</span>
                  </div>
                )}
                {order.customer.email && (
                  <div className="info-row">
                    <Mail size={18} />
                    <span><strong>Email:</strong> {order.customer.email}</span>
                  </div>
                )}
                {order.customer.phone && (
                  <div className="info-row">
                    <Phone size={18} />
                    <span><strong>Teléfono:</strong> {order.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dirección de Envío */}
          {order.shipping && (
            <div className="detail-card shipping-card">
              <h2>
                <MapPin size={24} />
                Dirección de Envío
              </h2>
              <div className="shipping-info">
                {order.shipping.address || order.shipping.fullAddress ? (
                  <p>{order.shipping.address || order.shipping.fullAddress}</p>
                ) : (
                  <>
                    {order.shipping.calle && (
                      <p>
                        <strong>Calle:</strong> {order.shipping.calle}
                        {order.shipping.numero && ` #${order.shipping.numero}`}
                      </p>
                    )}
                    {order.shipping.comuna && (
                      <p><strong>Comuna:</strong> {order.shipping.comuna}</p>
                    )}
                    {order.shipping.region && (
                      <p><strong>Región:</strong> {order.shipping.region}</p>
                    )}
                    {order.shipping.pais && (
                      <p><strong>País:</strong> {order.shipping.pais}</p>
                    )}
                    {order.shipping.codigoPostal && (
                      <p><strong>Código Postal:</strong> {order.shipping.codigoPostal}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Información de Pago */}
          <div className="detail-card payment-card">
            <h2>
              <DollarSign size={24} />
              Información de Pago
            </h2>
            <div className="payment-info">
              <div className="payment-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              {order.shippingCost && order.shippingCost > 0 && (
                <div className="payment-row">
                  <span>Costo de Envío:</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              <div className="payment-row total-row">
                <span><strong>Total:</strong></span>
                <span><strong>{formatPrice(order.total || 0)}</strong></span>
              </div>
              {order.paymentMethod && (
                <div className="payment-method">
                  <span><strong>Método de Pago:</strong> {order.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-detail-footer">
          <button onClick={() => navigate('/profile')} className="btn-secondary">
            Volver a Mis Compras
          </button>
          <Link to="/" className="btn-primary">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
