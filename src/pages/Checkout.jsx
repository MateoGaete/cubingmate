import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../firebase/orders'
import { createPaymentPreference } from '../services/mercadoPago'
import { chileComunas, hasBlueExpress } from '../data/chileComunas'
import { CreditCard, Truck, User } from 'lucide-react'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Paso 1: Identificación
  const [identificationData, setIdentificationData] = useState({
    nombre: '',
    apellido: '',
    correo: currentUser?.email || '',
    ciudad: '',
    telefono: ''
  })

  // Paso 2: Envío
  const [shippingData, setShippingData] = useState({
    pais: 'Chile',
    comuna: '',
    calle: '',
    numero: '',
    tipoVivienda: 'casa', // casa, departamento, oficina
    calleSinNumero: false,
    codigoPostal: '',
    blueExpress: false
  })

  // Paso 3: Cobro
  const [paymentMethod, setPaymentMethod] = useState('tarjeta') // tarjeta, otro

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cartData.length === 0) {
      navigate('/cart')
    }
    setCart(cartData)
    
    // Si el usuario está autenticado, prellenar el email
    if (currentUser?.email) {
      setIdentificationData(prev => ({
        ...prev,
        correo: currentUser.email
      }))
    }
  }, [navigate, currentUser])

  const handleIdentificationChange = (e) => {
    setIdentificationData({
      ...identificationData,
      [e.target.name]: e.target.value
    })
  }

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setShippingData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }
      
      // Si cambia la comuna, verificar si tiene BlueExpress
      if (name === 'comuna') {
        newData.blueExpress = hasBlueExpress(value)
      }
      
      return newData
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const SHIPPING_COST = 4900 // Costo de envío fijo
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + SHIPPING_COST

  // Validar Paso 1
  const validateStep1 = () => {
    if (!identificationData.nombre || !identificationData.apellido || 
        !identificationData.correo || !identificationData.ciudad || 
        !identificationData.telefono) {
      alert('Por favor completa todos los campos de identificación')
      return false
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(identificationData.correo)) {
      alert('Por favor ingresa un email válido')
      return false
    }
    
    // Validar teléfono chileno (9 dígitos)
    const phoneRegex = /^[0-9]{9}$/
    const cleanPhone = identificationData.telefono.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      alert('Por favor ingresa un teléfono válido (9 dígitos)')
      return false
    }
    
    return true
  }

  // Validar Paso 2
  const validateStep2 = () => {
    if (!shippingData.comuna || !shippingData.calle) {
      alert('Por favor completa todos los campos de envío obligatorios')
      return false
    }
    
    if (!shippingData.calleSinNumero && !shippingData.numero) {
      alert('Por favor ingresa el número de la dirección o marca "Calle sin número"')
      return false
    }
    
    if (!shippingData.codigoPostal || shippingData.codigoPostal.length < 7) {
      alert('Por favor ingresa un código postal válido (7 dígitos)')
      return false
    }
    
    return true
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3)
      }
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar que hay productos en el carrito
    if (!cart || cart.length === 0) {
      alert('❌ Error: No hay productos en el carrito.\n\nPor favor agrega productos antes de pagar.')
      navigate('/cart')
      return
    }

    if (paymentMethod !== 'tarjeta') {
      alert('Por el momento solo aceptamos pagos con tarjeta de débito o crédito')
      return
    }

    // Validar que todos los datos estén completos antes de procesar
    if (!validateStep1() || !validateStep2()) {
      alert('❌ Error: Por favor completa todos los campos antes de pagar.')
      return
    }

    setLoading(true)

    try {
      console.log('🚀 Iniciando proceso de pago...')
      console.log('Carrito:', cart)
      console.log('Datos de identificación:', identificationData)
      console.log('Datos de envío:', shippingData)

      // Combinar todos los datos
      const orderData = {
        items: cart,
        customer: {
          nombre: identificationData.nombre,
          apellido: identificationData.apellido,
          name: `${identificationData.nombre} ${identificationData.apellido}`.trim(),
          email: identificationData.correo.trim(),
          phone: identificationData.telefono.trim(),
          city: identificationData.ciudad.trim()
        },
        shipping: {
          ...shippingData,
          address: `${shippingData.calle} ${shippingData.numero || ''}`.trim(),
          fullAddress: `${shippingData.calle} ${shippingData.numero || (shippingData.calleSinNumero ? 'S/N' : '')}, ${shippingData.comuna}, ${shippingData.pais}`
        },
        subtotal: subtotal,
        shippingCost: SHIPPING_COST,
        total: total,
        status: 'pending',
        userId: currentUser?.uid || null
      }

      console.log('📦 Datos de la orden preparados:', orderData)

      // Crear orden en Firebase primero
      console.log('🔥 Creando orden en Firebase...')
      const orderId = await createOrder(orderData)
      console.log('✅ Orden creada en Firebase con ID:', orderId)

      // Crear preferencia de pago en Mercado Pago con el orderId
      console.log('💳 Creando preferencia de pago en Mercado Pago...')
      const paymentUrl = await createPaymentPreference({
        ...orderData,
        orderId
      })

      console.log('✅ Preferencia creada, redirigiendo a:', paymentUrl)

      // Redirigir a Mercado Pago
      if (paymentUrl && paymentUrl.startsWith('http')) {
        window.location.href = paymentUrl
      } else {
        throw new Error('La URL de pago no es válida')
      }

    } catch (error) {
      console.error('❌ Error procesando pedido:', error)
      console.error('Stack trace:', error.stack)
      
      // Mostrar mensaje de error más específico y claro
      let errorMessage = 'Error al procesar el pedido.'
      
      if (error.message) {
        errorMessage = error.message
        
        // Traducir errores comunes a español más claro
        if (error.message.includes('Access Token') || error.message.includes('401')) {
          errorMessage = '❌ Error: Token de Mercado Pago inválido o no configurado.\n\n' +
            'Por favor:\n' +
            '1. Abre el archivo: src/services/mercadoPago.js\n' +
            '2. Verifica que el Access Token esté configurado (línea 9)\n' +
            '3. Debe comenzar con APP_USR- (producción) o TEST- (prueba)\n' +
            '4. Obtén tu token en: https://www.mercadopago.cl/developers/panel/credentials'
        } else if (error.message.includes('No hay productos')) {
          errorMessage = '❌ Error: No hay productos en el carrito.\n\nPor favor agrega productos antes de pagar.'
        } else if (error.message.includes('Faltan datos')) {
          errorMessage = '❌ Error: Faltan datos del formulario.\n\nPor favor completa todos los campos antes de pagar.'
        } else if (error.message.includes('400')) {
          errorMessage = '❌ Error: Datos inválidos enviados a Mercado Pago.\n\n' +
            'Verifica que:\n' +
            '- Todos los campos estén completos\n' +
            '- El email tenga formato válido\n' +
            '- El nombre tenga al menos 2 caracteres\n' +
            '- Los precios sean números válidos'
        } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          errorMessage = '❌ Error: No se pudo conectar con Mercado Pago.\n\n' +
            'Verifica tu conexión a internet e intenta nuevamente.'
        } else if (error.message.includes('Firebase')) {
          errorMessage = '❌ Error: No se pudo crear la orden en Firebase.\n\n' +
            'Verifica que Firebase esté configurado correctamente.'
        }
      }
      
      // Mostrar error detallado en consola
      console.error('📋 Detalles completos del error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      // Mostrar alerta clara
      alert(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="checkout">
      <h1>Finalizar Compra</h1>

      {/* Indicador de pasos */}
      <div className="checkout-steps">
        <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">
            <User size={20} />
            <span>Identificación</span>
          </div>
        </div>
        <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">
            <Truck size={20} />
            <span>Envío</span>
          </div>
        </div>
        <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">
            <CreditCard size={20} />
            <span>Cobro</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-container">
          {/* Paso 1: Identificación */}
          {currentStep === 1 && (
            <div className="checkout-step">
              <h2>Paso 1: Identificación</h2>
              <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={identificationData.nombre}
                      onChange={handleIdentificationChange}
                      required
                      placeholder="Ingresa tu nombre"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="apellido">Apellido *</label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={identificationData.apellido}
                      onChange={handleIdentificationChange}
                      required
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="correo">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={identificationData.correo}
                    onChange={handleIdentificationChange}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ciudad">Ciudad *</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={identificationData.ciudad}
                      onChange={handleIdentificationChange}
                      required
                      placeholder="Ej: Santiago"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono (Chile) *</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={identificationData.telefono}
                      onChange={handleIdentificationChange}
                      required
                      placeholder="912345678"
                      maxLength="9"
                    />
                  </div>
                </div>

                <div className="step-actions">
                  <button type="submit" className="btn-next">
                    Continuar →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Paso 2: Envío */}
          {currentStep === 2 && (
            <div className="checkout-step">
              <h2>Paso 2: Información de Envío</h2>
              <div className="shipping-notice">
                <p>🚚 Solo realizamos repartos en Chile</p>
              </div>
              <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-group">
                  <label htmlFor="pais">País *</label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    value={shippingData.pais}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comuna">Comuna *</label>
                  <select
                    id="comuna"
                    name="comuna"
                    value={shippingData.comuna}
                    onChange={handleShippingChange}
                    required
                  >
                    <option value="">Selecciona una comuna</option>
                    {chileComunas.map((comuna) => (
                      <option key={comuna.value} value={comuna.value}>
                        {comuna.label}
                      </option>
                    ))}
                  </select>
                </div>

                {shippingData.comuna && hasBlueExpress(shippingData.comuna) && (
                  <div className="blueexpress-option">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="blueExpress"
                        checked={shippingData.blueExpress}
                        onChange={handleShippingChange}
                      />
                      <span>Enviar con BlueExpress (disponible en esta comuna)</span>
                    </label>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="calle">Calle *</label>
                  <input
                    type="text"
                    id="calle"
                    name="calle"
                    value={shippingData.calle}
                    onChange={handleShippingChange}
                    required
                    placeholder="Nombre de la calle"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="calleSinNumero"
                      checked={shippingData.calleSinNumero}
                      onChange={handleShippingChange}
                    />
                    <span>Calle sin número</span>
                  </label>
                </div>

                {!shippingData.calleSinNumero && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="numero">Número *</label>
                      <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={shippingData.numero}
                        onChange={handleShippingChange}
                        required
                        placeholder="123"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tipoVivienda">Tipo *</label>
                      <select
                        id="tipoVivienda"
                        name="tipoVivienda"
                        value={shippingData.tipoVivienda}
                        onChange={handleShippingChange}
                        required
                      >
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="oficina">Oficina</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={shippingData.codigoPostal}
                    onChange={handleShippingChange}
                    required
                    placeholder="1234567"
                    maxLength="7"
                  />
                </div>

                <div className="step-actions">
                  <button type="button" onClick={handlePreviousStep} className="btn-back">
                    ← Volver
                  </button>
                  <button type="submit" className="btn-next">
                    Continuar →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Paso 3: Cobro */}
          {currentStep === 3 && (
            <div className="checkout-step">
              <h2>Paso 3: Método de Pago</h2>
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="tarjeta"
                      checked={paymentMethod === 'tarjeta'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <CreditCard size={24} />
                      <div>
                        <strong>Tarjeta de Débito o Crédito</strong>
                        <p>Paga de forma segura con Mercado Pago</p>
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'tarjeta' && (
                  <div className="payment-info">
                    <p>Serás redirigido a Mercado Pago para completar el pago de forma segura.</p>
                    <p className="payment-security">🔒 Tu información está protegida</p>
                  </div>
                )}

                <div className="step-actions">
                  <button type="button" onClick={handlePreviousStep} className="btn-back">
                    ← Volver
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="checkout-summary">
          <h2>Resumen del Pedido</h2>

          <div className="order-items">
            {cart.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-quantity">x{item.quantity}</span>
                </div>
                <span className="order-item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-summary-breakdown">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>{formatPrice(SHIPPING_COST)}</span>
            </div>
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Mostrar información del paso actual */}
          {currentStep === 1 && (
            <div className="step-summary">
              <h3>Información de Contacto</h3>
              <p>Completa tus datos personales</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-summary">
              <h3>Dirección de Envío</h3>
              {shippingData.comuna && (
                <p>Comuna: {chileComunas.find(c => c.value === shippingData.comuna)?.label}</p>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-summary">
              <h3>Método de Pago</h3>
              <p>Tarjeta de Débito o Crédito</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout
