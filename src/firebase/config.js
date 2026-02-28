// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// ⚠️ CONFIGURA ESTOS VALORES EN EL ARCHIVO .env
// Ve a https://console.firebase.google.com/ y crea un proyecto
// Luego ve a Configuración del proyecto > Tus aplicaciones > Web
// Copia los valores al archivo .env con el prefijo VITE_FIREBASE_ (desarrollo) o VITE_PUBLIC_FIREBASE_ (producción)
// 
// Nota: En producción (Vercel, Netlify, etc.) usa VITE_PUBLIC_FIREBASE_ para que las variables sean públicas
// En desarrollo local puedes usar VITE_FIREBASE_

// Función helper para obtener variables de entorno con fallback
const getEnvVar = (publicName, privateName) => {
  return import.meta.env[publicName] || import.meta.env[privateName]
}

const firebaseConfig = {
  apiKey: getEnvVar('VITE_PUBLIC_FIREBASE_API_KEY', 'VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_PUBLIC_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_PUBLIC_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_PUBLIC_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_PUBLIC_FIREBASE_APP_ID', 'VITE_FIREBASE_APP_ID'),
}

// Inicializar Firebase
let app
let db
let auth
let storage

try {
  // Validar que todas las variables de entorno estén configuradas
  // Verificar tanto VITE_PUBLIC_FIREBASE_ (producción) como VITE_FIREBASE_ (desarrollo)
  const requiredVars = [
    { public: 'VITE_PUBLIC_FIREBASE_API_KEY', private: 'VITE_FIREBASE_API_KEY', name: 'API_KEY' },
    { public: 'VITE_PUBLIC_FIREBASE_AUTH_DOMAIN', private: 'VITE_FIREBASE_AUTH_DOMAIN', name: 'AUTH_DOMAIN' },
    { public: 'VITE_PUBLIC_FIREBASE_PROJECT_ID', private: 'VITE_FIREBASE_PROJECT_ID', name: 'PROJECT_ID' },
    { public: 'VITE_PUBLIC_FIREBASE_STORAGE_BUCKET', private: 'VITE_FIREBASE_STORAGE_BUCKET', name: 'STORAGE_BUCKET' },
    { public: 'VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', private: 'VITE_FIREBASE_MESSAGING_SENDER_ID', name: 'MESSAGING_SENDER_ID' },
    { public: 'VITE_PUBLIC_FIREBASE_APP_ID', private: 'VITE_FIREBASE_APP_ID', name: 'APP_ID' }
  ]
  
  const missingVars = requiredVars.filter(
    ({ public: publicName, private: privateName }) => 
      !import.meta.env[publicName] && !import.meta.env[privateName]
  )
  
  if (missingVars.length > 0) {
    const missingNames = missingVars.map(({ name }) => name).join(', ')
    console.error('❌ ERROR: Faltan variables de entorno de Firebase:', missingNames)
    console.error('Por favor configura estas variables en tu plataforma de despliegue:')
    console.error('  - En producción: VITE_PUBLIC_FIREBASE_*')
    console.error('  - En desarrollo local: VITE_FIREBASE_*')
    throw new Error(`Faltan variables de entorno de Firebase: ${missingNames}`)
  }
  
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
  
  console.log('✅ Firebase inicializado correctamente')
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error)
  // Crear valores por defecto para evitar errores
  app = null
  db = null
  auth = null
  storage = null
}

// Inicializar servicios
export { db, auth, storage }
export default app
