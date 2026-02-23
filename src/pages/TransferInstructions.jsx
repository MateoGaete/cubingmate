import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Building2, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import { getOrderById } from '../firebase/orders'
import './TransferInstructions.css'

function TransferInstructions() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  // Datos bancarios
  const bankData = {
    bankName: 'Bci / Banco Crédito e Inversiones',
    accountType: 'Cuenta Corriente',
    accountNumber: '777922056738',
    accountHolder: 'CubingMate',
    rut: '22.056.738-9',
    email: 'contacto@cubingmate.com' // Actualizar con el email real cuando lo proporciones
  }

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error('Error obteniendo orden:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  if (loading) {
    return (
      <div className="transfer-instructions">
        <div className="transfer-content">
          <div className="loading-spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="transfer-instructions">
        <div className="transfer-content">
          <AlertCircle size={48} className="error-icon" />
          <h1>Orden no encontrada</h1>
          <p>No se pudo encontrar la información de tu pedido.</p>
          <Link to="/cart" className="btn-primary">
            Volver al Carrito
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="transfer-instructions">
      <div className="transfer-content">
        <div className="transfer-header">
          <Building2 size={48} className="bank-icon" />
          <h1>Instrucciones de Transferencia</h1>
          <p className="order-number">Orden #{orderId}</p>
        </div>

        <div className="transfer-info-card critical-warning">
          <AlertCircle size={24} />
          <div>
            <h3>⚠️ ADVERTENCIA IMPORTANTE</h3>
            <p>
              <strong>DEBES COPIAR EXACTAMENTE los datos bancarios que aparecen abajo.</strong>
              Si los datos están incorrectos o el dinero no llega a nuestra cuenta, 
              <strong> NO se enviará el producto.</strong> Verifica cada dato antes de realizar la transferencia.
            </p>
          </div>
        </div>

        <div className="transfer-info-card">
          <h2>Datos Bancarios</h2>
          <p className="data-warning">
            ⚠️ Copia estos datos EXACTAMENTE como aparecen. Un error en los datos puede resultar en la pérdida de tu dinero.
          </p>
          <div className="bank-details">
            <div className="bank-detail-row">
              <span className="label">Banco:</span>
              <span className="value">{bankData.bankName}</span>
            </div>
            <div className="bank-detail-row">
              <span className="label">Tipo de Cuenta:</span>
              <span className="value">{bankData.accountType}</span>
            </div>
            <div className="bank-detail-row">
              <span className="label">Número de Cuenta:</span>
              <div className="value-with-copy">
                <span className="value">{bankData.accountNumber}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(bankData.accountNumber, 'account')}
                  title="Copiar número de cuenta"
                >
                  {copied === 'account' ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="bank-detail-row">
              <span className="label">Titular:</span>
              <span className="value">{bankData.accountHolder}</span>
            </div>
            <div className="bank-detail-row">
              <span className="label">RUT:</span>
              <div className="value-with-copy">
                <span className="value">{bankData.rut}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(bankData.rut, 'rut')}
                  title="Copiar RUT"
                >
                  {copied === 'rut' ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="bank-detail-row">
              <span className="label">Email:</span>
              <div className="value-with-copy">
                <span className="value">{bankData.email}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(bankData.email, 'email')}
                  title="Copiar email"
                >
                  {copied === 'email' ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="transfer-info-card">
          <h2>Monto a Transferir</h2>
          <div className="amount-details">
            <div className="amount-row">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            {order.shippingCost > 0 && (
              <div className="amount-row">
                <span>Envío:</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
            )}
            <div className="amount-row total">
              <span>Total a Transferir:</span>
              <span>{formatPrice(order.total || order.subtotal + (order.shippingCost || 0))}</span>
            </div>
          </div>
        </div>

        <div className="transfer-info-card instructions">
          <h2>Instrucciones Paso a Paso</h2>
          <ol className="instructions-list">
            <li><strong>Verifica los datos bancarios:</strong> Asegúrate de copiar EXACTAMENTE el número de cuenta, RUT y nombre del titular que aparecen arriba.</li>
            <li><strong>Realiza la transferencia:</strong> Transfiere el monto exacto indicado arriba (<strong>{formatPrice(order.total || order.subtotal + (order.shippingCost || 0))}</strong>).</li>
            <li><strong>Usa el número de orden como referencia:</strong> En el campo "mensaje" o "referencia" de la transferencia, escribe: <strong>Orden #{orderId}</strong></li>
            <li><strong>Envía el comprobante:</strong> Una vez realizada la transferencia, envía el comprobante a <strong>{bankData.email}</strong> con el número de orden <strong>#{orderId}</strong>.</li>
            <li><strong>Espera la confirmación:</strong> Revisaremos tu pago y te notificaremos cuando tu pedido sea procesado (1 a 3 días hábiles después de recibir el pago).</li>
          </ol>
        </div>

        <div className="transfer-info-card warning critical">
          <AlertCircle size={24} />
          <div>
            <h3>⚠️ CONDICIONES IMPORTANTES</h3>
            <ul className="warning-list">
              <li><strong>Si los datos bancarios están incorrectos:</strong> El dinero puede no llegar a nuestra cuenta. En ese caso, <strong>NO se enviará el producto</strong> hasta que se resuelva el problema.</li>
              <li><strong>Si el dinero no llega:</strong> Tu pedido permanecerá en estado "Pendiente" y <strong>NO se procesará ni se enviará</strong> hasta que recibamos confirmación del pago.</li>
              <li><strong>Si el monto es incorrecto:</strong> Si transfieres un monto diferente al indicado, tu pedido puede ser cancelado o requerir ajustes.</li>
              <li><strong>Verificación obligatoria:</strong> Solo procesaremos y enviaremos tu pedido después de verificar que el pago haya llegado correctamente a nuestra cuenta.</li>
            </ul>
          </div>
        </div>

        <div className="transfer-actions">
          <Link to="/" className="btn-secondary">
            Volver al Inicio
          </Link>
          <Link to={`/orders/${orderId}`} className="btn-primary">
            Ver Detalles del Pedido
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TransferInstructions
