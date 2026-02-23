import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllOrders, updateOrderStatus, deleteAllOrders } from '../firebase/orders'
import { isAdmin } from '../utils/admin'
import { Package, User, MapPin, Phone, Mail, Calendar, DollarSign, CheckCircle, Clock, XCircle, ShieldOff, X, Trash2 } from 'lucide-react'
import './Admin.css'

function Admin() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, completed, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null) // Para el modal
  const [deletingProgress, setDeletingProgress] = useState(null) // { current: 0, total: 0 }

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

  const handleDeleteAllOrders = async () => {
    // Confirmación doble para evitar eliminaciones accidentales
    const firstConfirm = window.confirm(
      `⚠️ ADVERTENCIA: Estás a punto de eliminar TODAS las órdenes (${orders.length} órdenes).\n\nEsta acción NO se puede deshacer.\n\n¿Estás seguro?`
    )
    
    if (!firstConfirm) return
    
    const secondConfirm = window.confirm(
      `⚠️ ÚLTIMA CONFIRMACIÓN\n\nVas a eliminar ${orders.length} órdenes permanentemente.\n\nEscribe "ELIMINAR" en el siguiente prompt para confirmar.`
    )
    
    if (!secondConfirm) return
    
    const finalConfirm = window.prompt(
      `Para confirmar, escribe exactamente: ELIMINAR\n\nSe eliminarán ${orders.length} órdenes.`
    )
    
    if (finalConfirm !== 'ELIMINAR') {
      alert('Eliminación cancelada. No se escribió "ELIMINAR" correctamente.')
      return
    }
    
    try {
      setLoading(true)
      setDeletingProgress({ current: 0, total: orders.length })
      console.log('Iniciando eliminación de órdenes...')
      
      // Usar setTimeout para no bloquear el hilo principal
      const deletedCount = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const count = await deleteAllOrders((current, total) => {
              setDeletingProgress({ current, total })
            })
            resolve(count)
          } catch (error) {
            reject(error)
          }
        }, 100)
      })
      
      if (deletedCount > 0) {
        // Actualizar la lista de órdenes
        const allOrders = await getAllOrders()
        const sortedOrders = allOrders.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return dateB - dateA
        })
        setOrders(sortedOrders)
        setDeletingProgress(null)
        alert(`✅ Se eliminaron ${deletedCount} órdenes correctamente.`)
      } else {
        setDeletingProgress(null)
        alert('ℹ️ No había órdenes para eliminar.')
      }
    } catch (error) {
      console.error('Error eliminando órdenes:', error)
      console.error('Detalles completos:', error)
      setDeletingProgress(null)
      
      let errorMessage = '❌ Error al eliminar las órdenes.'
      
      if (error.message) {
        if (error.message.includes('permission') || error.message.includes('Permission')) {
          errorMessage = '❌ Error: No tienes permisos para eliminar órdenes.\n\nVerifica las reglas de seguridad de Firestore.'
        } else if (error.message.includes('network') || error.message.includes('Network')) {
          errorMessage = '❌ Error: Problema de conexión.\n\nVerifica tu conexión a internet e intenta nuevamente.'
        } else {
          errorMessage = `❌ Error: ${error.message}`
        }
      }
      
      alert(errorMessage + '\n\nRevisa la consola para más detalles.')
    } finally {
      setLoading(false)
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
          <div className="admin-header-content">
            <div>
              <h1>Panel de Administración</h1>
              <p>Gestión de pedidos y datos de clientes</p>
            </div>
            {orders.length > 0 && (
              <div className="delete-all-container">
                <button 
                  className="btn-delete-all"
                  onClick={handleDeleteAllOrders}
                  disabled={loading || deletingProgress !== null}
                  title="Eliminar todas las órdenes"
                >
                  <Trash2 size={20} />
                  {deletingProgress ? (
                    `Eliminando... ${deletingProgress.current}/${deletingProgress.total}`
                  ) : (
                    `Eliminar Todas (${orders.length})`
                  )}
                </button>
                {deletingProgress && (
                  <div className="delete-progress-bar">
                    <div 
                      className="delete-progress-fill"
                      style={{ width: `${(deletingProgress.current / deletingProgress.total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
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
          <>
            <div className="orders-list-admin">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="order-card-admin compact"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="order-card-compact-header">
                    <div className="order-id-compact">
                      <Package size={18} />
                      <span className="order-id-value-compact">{order.id.substring(0, 8)}...</span>
                    </div>
                    <div className="order-status-compact">
                      {getStatusIcon(order.status)}
                      <span className={`status-badge-compact ${order.status?.toLowerCase()}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="order-card-compact-info">
                    <div className="compact-info-item">
                      <User size={14} />
                      <span>{order.customer?.nombre} {order.customer?.apellido}</span>
                    </div>
                    <div className="compact-info-item">
                      <Mail size={14} />
                      <span>{order.customer?.email}</span>
                    </div>
                    <div className="compact-info-item">
                      <MapPin size={14} />
                      <span>{order.shipping?.comuna}</span>
                    </div>
                    <div className="compact-info-item">
                      <DollarSign size={14} />
                      <span>{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                  <div className="order-card-compact-footer">
                    <Calendar size={12} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de detalles */}
            {selectedOrder && (
              <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="order-modal-header">
                    <div>
                      <h2>
                        <Package size={24} />
                        Orden #{selectedOrder.id}
                      </h2>
                      <div className="order-modal-status">
                        {getStatusIcon(selectedOrder.status)}
                        <span className={`status-badge-admin ${selectedOrder.status?.toLowerCase()}`}>
                          {getStatusText(selectedOrder.status)}
                        </span>
                        <select
                          value={selectedOrder.status || 'pending'}
                          onChange={(e) => {
                            handleStatusChange(selectedOrder.id, e.target.value)
                            setSelectedOrder({ ...selectedOrder, status: e.target.value })
                          }}
                          className="status-select"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="completed">Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>
                    <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                      <X size={24} />
                    </button>
                  </div>

                  <div className="order-modal-body">
                    <div className="order-date-admin">
                      <Calendar size={16} />
                      <span>{formatDate(selectedOrder.createdAt)}</span>
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
                            <span>{selectedOrder.customer?.nombre} {selectedOrder.customer?.apellido}</span>
                          </div>
                          <div className="info-item-admin">
                            <Mail size={16} />
                            <strong>Email:</strong>
                            <span>{selectedOrder.customer?.email}</span>
                          </div>
                          <div className="info-item-admin">
                            <Phone size={16} />
                            <strong>Teléfono:</strong>
                            <span>{selectedOrder.customer?.phone}</span>
                          </div>
                          <div className="info-item-admin">
                            <strong>Ciudad:</strong>
                            <span>{selectedOrder.customer?.city}</span>
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
                            <span>{selectedOrder.shipping?.pais || 'Chile'}</span>
                          </div>
                          <div className="info-item-admin">
                            <strong>Comuna:</strong>
                            <span>{selectedOrder.shipping?.comuna}</span>
                          </div>
                          <div className="info-item-admin full-width">
                            <strong>Dirección:</strong>
                            <span>
                              {selectedOrder.shipping?.calle} {selectedOrder.shipping?.numero || (selectedOrder.shipping?.calleSinNumero ? 'S/N' : '')}
                            </span>
                          </div>
                          <div className="info-item-admin">
                            <strong>Tipo de vivienda:</strong>
                            <span>{selectedOrder.shipping?.tipoVivienda}</span>
                          </div>
                          {selectedOrder.shipping?.codigoPostal && (
                            <div className="info-item-admin">
                              <strong>Código Postal:</strong>
                              <span>{selectedOrder.shipping.codigoPostal}</span>
                            </div>
                          )}
                          {selectedOrder.shipping?.blueExpress && (
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
                          {selectedOrder.items?.map((item, index) => (
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
                      <span>Total: {formatPrice(selectedOrder.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Admin
