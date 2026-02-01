// Funciones para manejar órdenes en Firestore

import { 
  collection, 
  addDoc, 
  getDoc, 
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

// Crear una nueva orden
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, 'orders')
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creando orden:', error)
    throw error
  }
}

// Obtener una orden por ID
export const getOrderById = async (id) => {
  try {
    const orderRef = doc(db, 'orders', id)
    const orderSnap = await getDoc(orderRef)
    
    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data()
      }
    } else {
      throw new Error('Orden no encontrada')
    }
  } catch (error) {
    console.error('Error obteniendo orden:', error)
    throw error
  }
}

// Actualizar estado de una orden
export const updateOrderStatus = async (id, status) => {
  try {
    const orderRef = doc(db, 'orders', id)
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error actualizando orden:', error)
    throw error
  }
}

// Actualizar orden con información de pago
export const updateOrderPayment = async (id, paymentData) => {
  try {
    const orderRef = doc(db, 'orders', id)
    await updateDoc(orderRef, {
      ...paymentData,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error actualizando información de pago:', error)
    throw error
  }
}

// Obtener órdenes de un usuario
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(
      ordersRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return orders
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    throw error
  }
}

// Obtener TODAS las órdenes (para administración)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return orders
  } catch (error) {
    console.error('Error obteniendo todas las órdenes:', error)
    throw error
  }
}
