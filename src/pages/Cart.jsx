import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadCart = () => {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
      setCart(cartData)
    }

    loadCart()
    window.addEventListener('cartUpdated', loadCart)

    return () => {
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos para comenzar</p>
        <Link to="/" className="btn-primary">
          Ver Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <h1>Carrito de Compras</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="cart-placeholder">🧩</div>
                )}
              </div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{formatPrice(item.price)}</p>
              </div>

              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="cart-item-total">
                {formatPrice(item.price * item.quantity)}
              </div>

              <button 
                className="cart-item-remove"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="summary-row">
            <span>Envío:</span>
            <span>Calculado al finalizar</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button 
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceder al Pago
          </button>

          <Link to="/" className="continue-shopping">
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
