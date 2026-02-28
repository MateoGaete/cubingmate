import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserOrders, getUserOrdersByEmail } from '../firebase/orders'
import { User, Mail, Calendar, Package, DollarSign, MapPin, Phone, Eye } from 'lucide-react'
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
        console.log('🔍 Buscando órdenes para usuario:', currentUser.uid, currentUser.email)
        const userOrders = await getUserOrders(currentUser.uid)
        console.log('✅ Órdenes encontradas:', userOrders.length, userOrders)
        setOrders(userOrders)
        
        // Si no hay órdenes, también buscar por email como respaldo
        if (userOrders.length === 0 && currentUser.email) {
          console.log('⚠️ No se encontraron órdenes por userId, buscando por email...')
          const ordersByEmail = await getUserOrdersByEmail(currentUser.email)
          console.log('📧 Órdenes encontradas por email:', ordersByEmail.length)
          if (ordersByEmail.length > 0) {
            setOrders(ordersByEmail)
          }
        }
      } catch (error) {
        console.error('❌ Error obteniendo órdenes:', error)
        console.error('Detalles del error:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        })
        // Mostrar mensaje al usuario
        alert('Error al cargar tus compras. Por favor recarga la página.')
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
                    <div className="order-card-content">
                      {/* Imágenes de productos */}
                      {order.items && order.items.length > 0 && (
                        <div className="order-products-images">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="product-image-wrapper">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="product-image"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-product.jpg'
                                    e.target.onerror = null
                                  }}
                                />
                              ) : (
                                <div className="product-image-placeholder">🧩</div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="product-image-more">+{order.items.length - 3}</div>
                          )}
                        </div>
                      )}

                      {/* Información de la orden */}
                      <div className="order-info-compact">
                        <div className="order-header-compact">
                          <div className="order-id-compact">Orden #{order.id.slice(0, 8)}</div>
                          <span className={`status-badge-compact ${getStatusBadgeClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        <div className="order-date-compact">
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="order-items-compact">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item-compact">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">x{item.quantity}</span>
                                <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="order-footer-compact">
                          <div className="order-total-compact">
                            <DollarSign size={18} />
                            <span>Total: {formatPrice(order.total || 0)}</span>
                          </div>
                          <Link 
                            to={`/order/${order.id}`}
                            className="btn-view-details-compact"
                          >
                            <Eye size={16} />
                            Ver Detalles
                          </Link>
                        </div>
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
