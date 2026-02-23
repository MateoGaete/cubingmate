// Funciones para manejar órdenes en Firestore

import { 
  collection, 
  addDoc, 
  getDoc, 
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
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
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
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
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
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
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
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
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
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
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
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
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
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

// Obtener el número total de clientes únicos que han comprado
export const getTotalCustomers = async () => {
  try {
    if (!db) {
      return 0
    }
    
    const ordersRef = collection(db, 'orders')
    const querySnapshot = await getDocs(ordersRef)
    
    // Contar emails únicos
    const uniqueEmails = new Set()
    querySnapshot.forEach((doc) => {
      const orderData = doc.data()
      if (orderData.customer?.email) {
        uniqueEmails.add(orderData.customer.email.toLowerCase())
      }
    })
    
    return uniqueEmails.size
  } catch (error) {
    console.error('Error obteniendo total de clientes:', error)
    return 0
  }
}

// Eliminar TODAS las órdenes (solo para administración)
// Usa batches de Firestore para mejor rendimiento y callbacks de progreso
export const deleteAllOrders = async (onProgress) => {
  try {
    if (!db) {
      throw new Error('Firebase no está inicializado. Por favor configura las variables de entorno de Firebase en el archivo .env')
    }
    
    const ordersRef = collection(db, 'orders')
    const querySnapshot = await getDocs(ordersRef)
    
    if (querySnapshot.empty) {
      console.log('No hay órdenes para eliminar')
      return 0
    }
    
    const totalOrders = querySnapshot.size
    console.log(`Eliminando ${totalOrders} órdenes...`)
    
    // Firestore permite máximo 500 operaciones por batch
    const batchSize = 500
    const docs = querySnapshot.docs
    let deletedCount = 0
    
    // Procesar en batches para no bloquear la UI
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = writeBatch(db)
      const batchDocs = docs.slice(i, Math.min(i + batchSize, docs.length))
      
      batchDocs.forEach((docSnapshot) => {
        const docRef = doc(db, 'orders', docSnapshot.id)
        batch.delete(docRef)
      })
      
      // Ejecutar el batch
      await batch.commit()
      deletedCount += batchDocs.length
      
      // Notificar progreso si hay callback
      if (onProgress) {
        onProgress(deletedCount, totalOrders)
      }
      
      console.log(`Eliminadas ${deletedCount} de ${totalOrders} órdenes`)
      
      // Pequeño delay para no sobrecargar Firestore
      if (i + batchSize < docs.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    console.log(`✅ Total eliminadas: ${deletedCount} órdenes`)
    return deletedCount
  } catch (error) {
    console.error('Error eliminando todas las órdenes:', error)
    console.error('Detalles del error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    throw error
  }
}
