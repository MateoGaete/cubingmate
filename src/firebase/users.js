// Funciones para manejar usuarios en Firestore

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

/**
 * Guarda o actualiza un usuario en Firestore
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.uid - ID único del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.displayName - Nombre del usuario
 * @param {string} userData.photoURL - URL de la foto de perfil
 * @param {string} userData.provider - Proveedor de autenticación (google, email)
 */
export async function saveUserToFirestore(userData) {
  try {
    if (!db) {
      console.warn('Firestore no está inicializado. No se puede guardar el usuario.')
      return
    }

    const userRef = doc(db, 'users', userData.uid)
    const userSnap = await getDoc(userRef)

    const userDoc = {
      email: userData.email,
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      provider: userData.provider || 'email',
      updatedAt: serverTimestamp()
    }

    // Si el usuario no existe, agregar createdAt
    if (!userSnap.exists()) {
      userDoc.createdAt = serverTimestamp()
    }

    await setDoc(userRef, userDoc, { merge: true })
    console.log('Usuario guardado/actualizado en Firestore:', userData.uid)
  } catch (error) {
    console.error('Error guardando usuario en Firestore:', error)
    // No lanzar el error para que no rompa el flujo de autenticación
  }
}

/**
 * Obtiene los datos de un usuario desde Firestore
 * @param {string} uid - ID único del usuario
 * @returns {Promise<Object|null>} Datos del usuario o null si no existe
 */
export async function getUserFromFirestore(uid) {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error obteniendo usuario de Firestore:', error)
    throw error
  }
}
