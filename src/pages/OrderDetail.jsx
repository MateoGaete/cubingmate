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
          message: '✅ Pago recibido - Tu pedido está siendo enviado'
        }
      case 'pending':
      case 'pendiente':
        return {
          text: 'En Procedimiento',
          class: 'status-processing',
          icon: Clock,
          message: 'Tu pedido está siendo procesado. Esperando confirmación de pago.'
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
          message: 'Tu pedido está en camino a tu dirección'
        }
      default:
        return {
          text: 'En Procedimiento',
          class: 'status-processing',
          icon: Clock,
          message: 'Tu pedido está siendo procesado. Esperando confirmación de pago.'
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
          <div>
            <p><strong>{statusInfo.message}</strong></p>
            {statusInfo.text === 'Completado' && (
              <p className="status-submessage">
                Cuando el estado dice "Completado" significa que recibimos tu pago y el producto está siendo enviado a tu dirección.
              </p>
            )}
          </div>
        </div>

        <div className="order-detail-content">
          {/* Productos - Sección Principal */}
          <div className="detail-card products-card main-section">
            <h2>
              <Package size={24} />
              Productos Comprados
            </h2>
            {order.items && order.items.length > 0 ? (
              <div className="products-list">
                {order.items.map((item, index) => (
                  <div key={index} className="product-item">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    )}
                    {!item.image && (
                      <div className="product-image-placeholder" style={{display: item.image ? 'none' : 'flex'}}>🧩</div>
                    )}
                    <div className="product-item-info">
                      <h3>{item.name}</h3>
                      <div className="product-details-row">
                        <span className="product-quantity">Cantidad: {item.quantity}</span>
                        <span className="product-price">
                          {formatPrice(item.price)} x {item.quantity} = {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No hay productos en esta orden</p>
            )}
          </div>

          {/* Información Agrupada - Cliente, Dirección y Pago */}
          <div className="order-info-group">
            {/* Cliente y Dirección Juntos */}
            <div className="detail-card info-card">
              <h2>
                <User size={20} />
                Información de Contacto y Envío
              </h2>
              <div className="info-group-content">
                {order.customer && (
                  <div className="info-section">
                    <h3 className="info-section-title">Datos del Cliente</h3>
                    <div className="info-compact">
                      {order.customer.name && (
                        <div className="info-item-compact">
                          <User size={16} />
                          <span>{order.customer.name}</span>
                        </div>
                      )}
                      {order.customer.email && (
                        <div className="info-item-compact">
                          <Mail size={16} />
                          <span>{order.customer.email}</span>
                        </div>
                      )}
                      {order.customer.phone && (
                        <div className="info-item-compact">
                          <Phone size={16} />
                          <span>{order.customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {order.shipping && (
                  <div className="info-section">
                    <h3 className="info-section-title">Dirección de Envío</h3>
                    <div className="info-compact">
                      <div className="info-item-compact">
                        <MapPin size={16} />
                        <span>
                          {order.shipping.address || order.shipping.fullAddress || 
                           `${order.shipping.calle || ''} ${order.shipping.numero || ''}`.trim()}
                          {order.shipping.comuna && `, ${order.shipping.comuna}`}
                          {order.shipping.pais && `, ${order.shipping.pais}`}
                        </span>
                      </div>
                      {order.shipping.codigoPostal && (
                        <div className="info-item-compact">
                          <span className="info-label-small">Código Postal:</span>
                          <span>{order.shipping.codigoPostal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Estado y Pago Juntos */}
            <div className="detail-card info-card">
              <h2>
                <Clock size={20} />
                Estado y Pago
              </h2>
              <div className="info-group-content">
                <div className="info-section">
                  <h3 className="info-section-title">Estado del Pedido</h3>
                  <div className="info-compact">
                    <div className="info-item-compact">
                      <span className="info-label-small">Estado:</span>
                      <span className={`status-value-inline ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    {statusInfo.text === 'Completado' && (
                      <div className="status-explanation">
                        <CheckCircle size={16} />
                        <span>Pago recibido - Producto siendo enviado</span>
                      </div>
                    )}
                    <div className="info-item-compact">
                      <Calendar size={16} />
                      <span>Fecha: {formatDate(order.createdAt)}</span>
                    </div>
                    {order.updatedAt && (
                      <div className="info-item-compact">
                        <span className="info-label-small">Actualizado:</span>
                        <span>{formatDate(order.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="info-section-title">Resumen de Pago</h3>
                  <div className="payment-info-compact">
                    <div className="payment-row-compact">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    {order.shippingCost && order.shippingCost > 0 && (
                      <div className="payment-row-compact">
                        <span>Envío:</span>
                        <span>{formatPrice(order.shippingCost)}</span>
                      </div>
                    )}
                    <div className="payment-row-compact total-row-compact">
                      <span><strong>Total:</strong></span>
                      <span><strong>{formatPrice(order.total || 0)}</strong></span>
                    </div>
                    {order.paymentMethod && (
                      <div className="payment-method-compact">
                        <DollarSign size={16} />
                        <span>{order.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
