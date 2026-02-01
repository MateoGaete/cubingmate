import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { saveUserToFirestore } from '../firebase/users'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Registrar nuevo usuario
  async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  // Iniciar sesión
  async function login(email, password) {
    if (!auth) {
      throw new Error('Firebase Auth no está inicializado. Verifica tu configuración de Firebase.')
    }
    
    // Normalizar email (trim y lowercase)
    const normalizedEmail = email ? email.trim().toLowerCase() : ''
    const normalizedPassword = password ? password.trim() : ''
    
    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email y contraseña son requeridos')
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error('El formato del email no es válido')
      error.code = 'auth/invalid-email'
      throw error
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword)
      return result
    } catch (error) {
      console.error('Error en login:', error)
      // Asegurar que el error tenga el código correcto
      if (!error.code && error.message) {
        // Si Firebase no devuelve un código, intentar inferirlo del mensaje
        if (error.message.includes('user-not-found') || error.message.includes('no user')) {
          error.code = 'auth/user-not-found'
        } else if (error.message.includes('wrong-password') || error.message.includes('password')) {
          error.code = 'auth/wrong-password'
        } else if (error.message.includes('invalid-email')) {
          error.code = 'auth/invalid-email'
        }
      }
      throw error
    }
  }

  // Iniciar sesión con Google
  async function signInWithGoogle() {
    if (!auth) {
      throw new Error('Firebase Auth no está inicializado. Verifica tu configuración.')
    }
    
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Guardar o actualizar usuario en Firestore (no crítico si falla)
      try {
        await saveUserToFirestore({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google'
        })
      } catch (saveError) {
        console.warn('No se pudo guardar el usuario en Firestore:', saveError)
        // No lanzar el error, el login fue exitoso
      }
      
      return result
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error)
      throw error
    }
  }

  // Cerrar sesión
  async function logout() {
    return await signOut(auth)
  }

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
        setLoading(false)
      }, (error) => {
        console.error('Error en onAuthStateChanged:', error)
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error('Error inicializando AuthContext:', error)
      setLoading(false)
    }
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle
  }

  // Mostrar children incluso si está cargando, pero con un pequeño delay para evitar flash
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
