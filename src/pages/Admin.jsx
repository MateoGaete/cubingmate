import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllOrders, updateOrderStatus } from '../firebase/orders'
import { isAdmin } from '../utils/admin'
import { Package, User, MapPin, Phone, Mail, Calendar, DollarSign, CheckCircle, Clock, XCircle, ShieldOff } from 'lucide-react'
import './Admin.css'

function Admin() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, completed, cancelled

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!currentUser) {
      navigate('/login')
      return
    }

    // Verificar que el usuario sea administrador
    if (!isAdmin(currentUser)) {
      navigate('/')
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const allOrders = await getAllOrders()
        // Ordenar por fecha más reciente primero
        const sortedOrders = allOrders.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return dateB - dateA
        })
        setOrders(sortedOrders)
      } catch (error) {
        console.error('Error obteniendo órdenes:', error)
        alert('Error al cargar las órdenes')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    
    // Verificar pagos pendientes cada 30 segundos para ver si el dinero ya se acreditó
    const checkPaymentsInterval = setInterval(async () => {
      await checkPendingPayments()
      // Después de verificar, actualizar la lista de órdenes
      const allOrders = await getAllOrders()
      const sortedOrders = allOrders.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
        return dateB - dateA
      })
      setOrders(sortedOrders)
    }, 30000)
    
    // Actualizar la lista de órdenes cada 10 segundos para ver cambios visuales
    const updateOrdersInterval = setInterval(async () => {
      const allOrders = await getAllOrders()
      const sortedOrders = allOrders.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
        return dateB - dateA
      })
      setOrders(sortedOrders)
    }, 10000)
    
    return () => {
      clearInterval(checkPaymentsInterval)
      clearInterval(updateOrdersInterval)
    }
  }, [currentUser, navigate])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      // Actualizar el estado local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      alert('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error actualizando estado:', error)
      alert('Error al actualizar el estado')
    }
  }

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'completado':
      case 'paid':
        return <CheckCircle size={20} className="status-icon completed" />
      case 'pending':
      case 'pendiente':
        return <Clock size={20} className="status-icon pending" />
      case 'cancelled':
      case 'cancelado':
        return <XCircle size={20} className="status-icon cancelled" />
      default:
        return <Clock size={20} className="status-icon pending" />
    }
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'completado':
      case 'paid':
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => {
        const status = order.status?.toLowerCase()
        if (filter === 'pending') return status === 'pending' || status === 'pendiente'
        if (filter === 'completed') return status === 'completed' || status === 'completado' || status === 'paid'
        if (filter === 'cancelled') return status === 'cancelled' || status === 'cancelado'
        return true
      })

  if (!currentUser) {
    return null
  }

  // Verificar permisos de administrador
  if (!isAdmin(currentUser)) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-access-denied">
            <ShieldOff size={64} />
            <h1>Acceso Denegado</h1>
            <p>No tienes permisos para acceder al panel de administración.</p>
            <button onClick={() => navigate('/')} className="btn-back-home">
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Gestión de pedidos y datos de clientes</p>
        </div>

        <div className="admin-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({orders.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({orders.filter(o => o.status === 'pending' || o.status === 'pendiente').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas ({orders.filter(o => o.status === 'completed' || o.status === 'completado' || o.status === 'paid').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Canceladas ({orders.filter(o => o.status === 'cancelled' || o.status === 'cancelado').length})
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <p>Cargando órdenes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-empty">
            <Package size={48} />
            <p>No hay órdenes disponibles</p>
          </div>
        ) : (
          <div className="orders-list-admin">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card-admin">
                <div className="order-header-admin">
                  <div className="order-id-section">
                    <Package size={24} />
                    <div>
                      <span className="order-id-label">Orden ID:</span>
                      <span className="order-id-value">{order.id}</span>
                    </div>
                  </div>
                  <div className="order-status-section">
                    {getStatusIcon(order.status)}
                    <span className={`status-badge-admin ${order.status?.toLowerCase()}`}>
                      {getStatusText(order.status)}
                    </span>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="order-date-admin">
                  <Calendar size={16} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>

                <div className="order-sections">
                  {/* Datos del Cliente */}
                  <div className="order-section">
                    <h3>
                      <User size={20} />
                      Datos del Cliente
                    </h3>
                    <div className="info-grid-admin">
                      <div className="info-item-admin">
                        <strong>Nombre:</strong>
                        <span>{order.customer?.nombre} {order.customer?.apellido}</span>
                      </div>
                      <div className="info-item-admin">
                        <Mail size={16} />
                        <strong>Email:</strong>
                        <span>{order.customer?.email}</span>
                      </div>
                      <div className="info-item-admin">
                        <Phone size={16} />
                        <strong>Teléfono:</strong>
                        <span>{order.customer?.phone}</span>
                      </div>
                      <div className="info-item-admin">
                        <strong>Ciudad:</strong>
                        <span>{order.customer?.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Datos de Envío */}
                  <div className="order-section">
                    <h3>
                      <MapPin size={20} />
                      Datos de Envío
                    </h3>
                    <div className="info-grid-admin">
                      <div className="info-item-admin">
                        <strong>País:</strong>
                        <span>{order.shipping?.pais || 'Chile'}</span>
                      </div>
                      <div className="info-item-admin">
                        <strong>Comuna:</strong>
                        <span>{order.shipping?.comuna}</span>
                      </div>
                      <div className="info-item-admin full-width">
                        <strong>Dirección:</strong>
                        <span>
                          {order.shipping?.calle} {order.shipping?.numero || (order.shipping?.calleSinNumero ? 'S/N' : '')}
                        </span>
                      </div>
                      <div className="info-item-admin">
                        <strong>Tipo de vivienda:</strong>
                        <span>{order.shipping?.tipoVivienda}</span>
                      </div>
                      {order.shipping?.codigoPostal && (
                        <div className="info-item-admin">
                          <strong>Código Postal:</strong>
                          <span>{order.shipping.codigoPostal}</span>
                        </div>
                      )}
                      {order.shipping?.blueExpress && (
                        <div className="info-item-admin">
                          <strong>BlueExpress:</strong>
                          <span>Sí</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="order-section">
                    <h3>Productos</h3>
                    <div className="products-list-admin">
                      {order.items?.map((item, index) => (
                        <div key={index} className="product-item-admin">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="order-total-admin">
                  <DollarSign size={24} />
                  <span>Total: {formatPrice(order.total || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
