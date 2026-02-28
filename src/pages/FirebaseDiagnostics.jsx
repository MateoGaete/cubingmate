import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { GoogleAuthProvider } from 'firebase/auth'

function FirebaseDiagnostics() {
  const [diagnostics, setDiagnostics] = useState({
    firebaseInitialized: false,
    authAvailable: false,
    config: {},
    emailPasswordEnabled: null,
    googleEnabled: null,
    errors: []
  })

  useEffect(() => {
    checkFirebaseConfig()
  }, [])

  const checkFirebaseConfig = async () => {
    const results = {
      firebaseInitialized: false,
      authAvailable: false,
      config: {},
      emailPasswordEnabled: null,
      googleEnabled: null,
      errors: []
    }

    try {
      // Verificar que Firebase esté inicializado
      if (auth) {
        results.firebaseInitialized = true
        results.authAvailable = true
        
        // Obtener configuración del proyecto
        results.config = {
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'No configurado',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'No configurado',
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 
            `${import.meta.env.VITE_FIREBASE_API_KEY.substring(0, 20)}...` : 'No configurado'
        }

        // Intentar verificar métodos de autenticación
        // Nota: No hay API directa para verificar esto, pero podemos intentar
        // detectar errores específicos al intentar usar los métodos
        
        // Verificar Google Auth Provider
        try {
          const googleProvider = new GoogleAuthProvider()
          if (googleProvider) {
            results.googleEnabled = 'Configurado (verificar en Firebase Console)'
          }
        } catch (error) {
          results.googleEnabled = 'Error: ' + error.message
        }

        results.emailPasswordEnabled = 'Configurado (verificar en Firebase Console)'
        
      } else {
        results.errors.push('Firebase Auth no está inicializado')
      }
    } catch (error) {
      results.errors.push(`Error verificando configuración: ${error.message}`)
    }

    setDiagnostics(results)
  }

  const testEmailPassword = async () => {
    if (!auth) {
      alert('Firebase Auth no está inicializado')
      return
    }

    // Intentar crear un usuario de prueba (esto fallará si no está habilitado)
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth')
      // No creamos realmente, solo verificamos que la función esté disponible
      alert('✅ Email/Password está disponible en el código.\n\n⚠️ Verifica en Firebase Console que esté HABILITADO en:\nAuthentication > Sign-in method > Email/Password')
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  const testGoogleAuth = async () => {
    if (!auth) {
      alert('Firebase Auth no está inicializado')
      return
    }

    try {
      const { signInWithPopup } = await import('firebase/auth')
      const provider = new GoogleAuthProvider()
      
      // Intentar abrir el popup (el usuario puede cancelarlo)
      try {
        await signInWithPopup(auth, provider)
        alert('✅ Google Sign-In funcionó correctamente!')
      } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
          alert('⚠️ Ventana cerrada por el usuario.\n\nSi el popup se abrió, Google Auth está configurado correctamente.')
        } else if (error.code === 'auth/unauthorized-domain') {
          alert(`❌ ERROR: Dominio no autorizado\n\nCódigo: ${error.code}\n\nSolución:\n1. Ve a Firebase Console\n2. Authentication > Settings > Authorized domains\n3. Agrega tu dominio de producción`)
        } else if (error.code === 'auth/operation-not-allowed') {
          alert(`❌ ERROR: Google Sign-In no está habilitado\n\nCódigo: ${error.code}\n\nSolución:\n1. Ve a Firebase Console\n2. Authentication > Sign-in method\n3. Habilita Google y guarda`)
        } else {
          alert(`Error: ${error.code || error.message}\n\nRevisa la consola para más detalles.`)
        }
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>🔍 Diagnóstico de Firebase</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Esta página verifica la configuración de Firebase para tu proyecto.
      </p>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>📋 Estado de la Configuración</h2>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Firebase Inicializado:</strong>{' '}
            {diagnostics.firebaseInitialized ? (
              <span style={{ color: 'green' }}>✅ Sí</span>
            ) : (
              <span style={{ color: 'red' }}>❌ No</span>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Auth Disponible:</strong>{' '}
            {diagnostics.authAvailable ? (
              <span style={{ color: 'green' }}>✅ Sí</span>
            ) : (
              <span style={{ color: 'red' }}>❌ No</span>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Project ID:</strong> {diagnostics.config.projectId}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Auth Domain:</strong> {diagnostics.config.authDomain}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Email/Password:</strong>{' '}
            {diagnostics.emailPasswordEnabled ? (
              <span style={{ color: 'orange' }}>⚠️ {diagnostics.emailPasswordEnabled}</span>
            ) : (
              <span style={{ color: 'red' }}>❌ No verificado</span>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Google Sign-In:</strong>{' '}
            {diagnostics.googleEnabled ? (
              <span style={{ color: 'orange' }}>⚠️ {diagnostics.googleEnabled}</span>
            ) : (
              <span style={{ color: 'red' }}>❌ No verificado</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>🧪 Pruebas de Autenticación</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Haz clic en los botones para probar cada método de autenticación:
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={testEmailPassword}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Probar Email/Password
          </button>

          <button
            onClick={testGoogleAuth}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Probar Google Sign-In
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>📝 Instrucciones de Verificación</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Verificar Email/Password:</strong>
            <ul>
              <li>Ve a <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Selecciona el proyecto: <strong>{diagnostics.config.projectId}</strong></li>
              <li>Ve a <strong>Authentication</strong> → <strong>Sign-in method</strong></li>
              <li>Verifica que <strong>Email/Password</strong> esté <strong>Enabled</strong></li>
            </ul>
          </li>
          <li>
            <strong>Verificar Google Sign-In:</strong>
            <ul>
              <li>En la misma página, verifica que <strong>Google</strong> esté <strong>Enabled</strong></li>
              <li>Si no está habilitado, haz clic en Google, activa el toggle y guarda</li>
            </ul>
          </li>
          <li>
            <strong>Verificar Dominios Autorizados:</strong>
            <ul>
              <li>Ve a <strong>Authentication</strong> → <strong>Settings</strong></li>
              <li>En <strong>Authorized domains</strong>, verifica que tu dominio de producción esté listado</li>
              <li>Si no está, agrégalo haciendo clic en <strong>Add domain</strong></li>
            </ul>
          </li>
        </ol>
      </div>

      {diagnostics.errors.length > 0 && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '1px solid #f44336'
        }}>
          <h2 style={{ color: '#c62828' }}>❌ Errores Encontrados</h2>
          <ul>
            {diagnostics.errors.map((error, index) => (
              <li key={index} style={{ color: '#c62828' }}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <strong>Nota:</strong> Esta página solo verifica la configuración local. 
        Los métodos de autenticación deben estar habilitados en Firebase Console para funcionar en producción.
      </div>
    </div>
  )
}

export default FirebaseDiagnostics
