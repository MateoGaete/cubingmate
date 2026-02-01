// Funciones para manejar productos en Firestore

import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, orderBy('name'))
    const querySnapshot = await getDocs(q)
    
    const products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return products
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    throw error
  }
}

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const productRef = doc(db, 'products', id)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      }
    } else {
      throw new Error('Producto no encontrado')
    }
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    throw error
  }
}

// Crear un nuevo producto (admin)
export const createProduct = async (productData) => {
  try {
    if (!db) {
      throw new Error('Firestore no está inicializado')
    }

    const productsRef = collection(db, 'products')
    const docRef = await addDoc(productsRef, {
      ...productData,
      // Compatibilidad: agregar campos en inglés también
      name: productData.nombre || productData.name,
      image: productData.imagen || productData.image,
      brand: productData.marca || productData.brand,
      price: productData.precio || productData.price,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creando producto:', error)
    throw error
  }
}

// Actualizar un producto (admin)
export const updateProduct = async (id, productData) => {
  try {
    const productRef = doc(db, 'products', id)
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error actualizando producto:', error)
    throw error
  }
}

// Eliminar un producto (admin)
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, 'products', id)
    await deleteDoc(productRef)
  } catch (error) {
    console.error('Error eliminando producto:', error)
    throw error
  }
}

// Buscar productos por categoría o tipo
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, 'products')
    // Buscar por 'category' o 'tipo'
    const q = query(
      productsRef, 
      where('category', '==', category)
    )
    const querySnapshot = await getDocs(q)
    
    const products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Si no hay resultados con 'category', intentar con 'tipo'
    if (products.length === 0) {
      const q2 = query(productsRef, where('tipo', '==', category))
      const querySnapshot2 = await getDocs(q2)
      querySnapshot2.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        })
      })
    }
    
    return products
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error)
    throw error
  }
}
