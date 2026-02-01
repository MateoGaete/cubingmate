// Servicio para verificar periódicamente si los pagos pendientes ya tienen el dinero acreditado
import { getPaymentStatus, isPaymentCredited } from './mercadoPago'
import { getAllOrders, updateOrderStatus, updateOrderPayment } from '../firebase/orders'

// Verificar pagos pendientes y actualizar si el dinero ya está acreditado
export const checkPendingPayments = async () => {
  try {
    // Obtener todas las órdenes pendientes
    const allOrders = await getAllOrders()
    const pendingOrders = allOrders.filter(order => 
      order.status === 'pending' && order.paymentId
    )

    // Verificar cada orden pendiente que tenga paymentId
    for (const order of pendingOrders) {
      try {
        if (order.paymentId) {
          const payment = await getPaymentStatus(order.paymentId)
          
          // Actualizar información del pago en la orden
          await updateOrderPayment(order.id, {
            paymentStatus: payment.status,
            paymentStatusDetail: payment.status_detail
          })
          
          // Si el dinero está acreditado, actualizar la orden a "paid"
          if (isPaymentCredited(payment)) {
            await updateOrderStatus(order.id, 'paid')
            console.log('✅ Orden actualizada - Dinero acreditado:', order.id)
          }
        }
      } catch (error) {
        console.error(`Error verificando pago de orden ${order.id}:`, error)
      }
    }
  } catch (error) {
    console.error('Error verificando pagos pendientes:', error)
  }
}
