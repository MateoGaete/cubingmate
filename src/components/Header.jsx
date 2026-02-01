import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/admin'
import './Header.css'

function Header() {
  const [cartCount, setCartCount] = useState(0)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Obtener cantidad de items en el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0))

    // Escuchar cambios en el carrito
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0))
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <>
      <div className="customer-service-bar">
        <p>📞 Atención al cliente: 16:00 - 18:00 | Solo atendemos llamadas en este horario</p>
      </div>
      <header className="header">
        <div className="header-container">
        <Link to="/" className="logo">
          <img 
            src="/logo-cubingmate.png" 
            alt="CubingMate Logo" 
            className="logo-image"
          />
          <h1>CubingMate</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/contact" className="nav-link">Contáctanos</Link>
          {currentUser && isAdmin(currentUser) && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCart size={20} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
          {currentUser ? (
            <div className="user-menu">
              <Link to="/profile" className="user-info-link">
                <div className="user-info">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || currentUser.email}
                      className="user-avatar"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="user-name">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
              </Link>
              <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-link">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
    </>
  )
}

export default Header
