// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// ⚠️ CONFIGURA ESTOS VALORES EN EL ARCHIVO .env
// Ve a https://console.firebase.google.com/ y crea un proyecto
// Luego ve a Configuración del proyecto > Tus aplicaciones > Web
// Copia los valores al archivo .env con el prefijo VITE_FIREBASE_
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Inicializar Firebase
let app
let db
let auth
let storage

try {
  // Validar que todas las variables de entorno estén configuradas
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ ERROR: Faltan variables de entorno de Firebase:', missingVars.join(', '))
    console.error('Por favor configura estas variables en el archivo .env')
    throw new Error(`Faltan variables de entorno de Firebase: ${missingVars.join(', ')}`)
  }
  
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
} catch (error) {
  console.error('Error inicializando Firebase:', error)
  // Crear valores por defecto para evitar errores
  app = null
}

// Inicializar servicios
export { db, auth, storage }
export default app
