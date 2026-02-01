import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../firebase/orders'
import { User, Mail, Calendar, Package, DollarSign, MapPin, Phone } from 'lucide-react'
import './Profile.css'

function Profile() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const userOrders = await getUserOrders(currentUser.uid)
        setOrders(userOrders)
      } catch (error) {
        console.error('Error obteniendo órdenes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentUser, navigate])

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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'completado':
        return 'status-completed'
      case 'pending':
      case 'pendiente':
        return 'status-pending'
      case 'cancelled':
      case 'cancelado':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'completado':
        return 'Completado'
      case 'pending':
      case 'pendiente':
        return 'Pendiente'
      case 'cancelled':
      case 'cancelado':
        return 'Cancelado'
      default:
        return 'Pendiente'
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || currentUser.email}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <User size={60} />
              </div>
            )}
          </div>
          <div className="profile-info-header">
            <h1>{currentUser.displayName || 'Usuario'}</h1>
            <p className="profile-email">{currentUser.email}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2 className="section-title">
              <User size={24} />
              Mis Datos
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <Mail className="info-icon" size={20} />
                <div className="info-content">
                  <span className="info-label">Email</span>
                  <span className="info-value">{currentUser.email}</span>
                </div>
              </div>
              {currentUser.displayName && (
                <div className="info-item">
                  <User className="info-icon" size={20} />
                  <div className="info-content">
                    <span className="info-label">Nombre</span>
                    <span className="info-value">{currentUser.displayName}</span>
                  </div>
                </div>
              )}
              <div className="info-item">
                <Calendar className="info-icon" size={20} />
                <div className="info-content">
                  <span className="info-label">Miembro desde</span>
                  <span className="info-value">
                    {currentUser.metadata?.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long'
                        })
                      : 'Fecha no disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">
              <Package size={24} />
              Mis Compras
            </h2>
            {loading ? (
              <div className="loading-orders">
                <p>Cargando tus compras...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <Package size={48} />
                <p>No tienes compras aún</p>
                <button 
                  className="btn-shop-now"
                  onClick={() => navigate('/')}
                >
                  Comenzar a comprar
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <span className="order-id">Orden #{order.id.slice(0, 8)}</span>
                        <span className="order-date">
                          <Calendar size={16} />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="order-items">
                        <h4>Productos:</h4>
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.name} x{item.quantity} - {formatPrice(item.price * item.quantity)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {order.shipping && (
                      <div className="order-shipping">
                        <h4>
                          <MapPin size={16} />
                          Dirección de envío:
                        </h4>
                        <p>
                          {order.shipping.address || order.shipping.fullAddress || 
                           `${order.shipping.calle || ''} ${order.shipping.numero || ''}`.trim()}
                          {order.shipping.comuna && `, ${order.shipping.comuna}`}
                          {order.shipping.pais && `, ${order.shipping.pais}`}
                        </p>
                      </div>
                    )}

                    <div className="order-footer">
                      <div className="order-total">
                        <DollarSign size={20} />
                        <span>Total: {formatPrice(order.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
