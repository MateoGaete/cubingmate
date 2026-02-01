import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, signInWithGoogle, currentUser } = useAuth()
  const navigate = useNavigate()

  // Si el usuario ya está logueado, redirigir al inicio
  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      
      // Limpiar y normalizar email
      const cleanEmail = email.trim().toLowerCase()
      const cleanPassword = password.trim()
      
      // Validaciones básicas
      if (!cleanEmail || !cleanPassword) {
        setError('Por favor completa todos los campos')
        setLoading(false)
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        setError('Por favor ingresa un email válido (ejemplo: usuario@email.com)')
        setLoading(false)
        return
      }

      // Validar que la contraseña tenga al menos 6 caracteres
      if (cleanPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        setLoading(false)
        return
      }

      // Intentar iniciar sesión
      await login(cleanEmail, cleanPassword)
      
      // Si llegamos aquí, el login fue exitoso
      navigate('/')
    } catch (err) {
      console.error('Error completo:', err)
      
      // Mensajes de error específicos según el código de error de Firebase
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.'
      
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'No existe una cuenta con este email. ¿Quieres registrarte?'
            break
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta. Intenta nuevamente.'
            break
          case 'auth/invalid-email':
            errorMessage = 'El formato del email no es válido.'
            break
          case 'auth/user-disabled':
            errorMessage = 'Esta cuenta ha sido deshabilitada. Contacta al soporte.'
            break
          case 'auth/too-many-requests':
            errorMessage = 'Demasiados intentos fallidos. Espera unos minutos e intenta nuevamente.'
            break
          case 'auth/network-request-failed':
            errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.'
            break
          case 'auth/invalid-credential':
            errorMessage = 'Email o contraseña incorrectos. Verifica tus credenciales.'
            break
          case 'auth/operation-not-allowed':
            errorMessage = 'El método de autenticación no está habilitado. Ve a Firebase Console > Authentication > Sign-in method y habilita Email/Password.'
            break
          default:
            errorMessage = `Error: ${err.message || 'Error desconocido'}`
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setGoogleLoading(true)
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Ventana de autenticación cerrada. Intenta nuevamente.')
      } else if (err.code === 'auth/popup-blocked') {
        setError('La ventana emergente fue bloqueada. Permite ventanas emergentes e intenta nuevamente.')
      } else {
        setError('Error al iniciar sesión con Google. Intenta nuevamente.')
      }
      console.error(err)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        <p className="auth-subtitle">Bienvenido de vuelta a CubingMate</p>

        {error && (
          <div className="auth-error">
            {error}
            {error.includes('No existe una cuenta') && (
              <div style={{ marginTop: '0.5rem' }}>
                <Link to="/register" className="auth-link" style={{ fontWeight: 'bold' }}>
                  Crear cuenta nueva
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || googleLoading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-divider">
          <span>o</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="google-button"
          disabled={loading || googleLoading}
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Conectando...' : 'Continuar con Google'}
        </button>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
