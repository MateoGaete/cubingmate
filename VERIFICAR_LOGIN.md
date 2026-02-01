# ✅ Verificar que el Login Funcione Correctamente

## Pasos para Asegurar que el Inicio de Sesión Funcione Sin Errores

### 1. Verificar que Email/Password esté Habilitado en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **cubingmate-7a406**
3. En el menú lateral, haz clic en **"Authentication"** (Autenticación)
4. Ve a la pestaña **"Sign-in method"** (Método de inicio de sesión)
5. Busca **"Email/Password"** en la lista
6. **DEBE estar habilitado** (debe aparecer como "Enabled" o "Habilitado")
7. Si NO está habilitado:
   - Haz clic en **"Email/Password"**
   - Activa el primer toggle (Email/Password)
   - Haz clic en **"Guardar"** o **"Save"**

### 2. Verificar que Tengas una Cuenta Registrada

**IMPORTANTE**: Para iniciar sesión, primero debes tener una cuenta registrada.

1. Ve a tu aplicación: `http://localhost:5173/register`
2. Crea una cuenta nueva con:
   - Email válido (ejemplo: usuario@email.com)
   - Contraseña de al menos 6 caracteres
3. Una vez registrado, podrás iniciar sesión

### 3. Probar el Login

1. Ve a: `http://localhost:5173/login`
2. Ingresa el email y contraseña que usaste para registrarte
3. Haz clic en **"Iniciar Sesión"**
4. Deberías ser redirigido al inicio sin errores

### 4. Si Aparece un Error

#### Error: "El método de autenticación no está habilitado"
- **Solución**: Ve a Firebase Console > Authentication > Sign-in method y habilita Email/Password

#### Error: "No existe una cuenta con este email"
- **Solución**: Primero debes registrarte en `/register`

#### Error: "Contraseña incorrecta"
- **Solución**: Verifica que estés usando la contraseña correcta
- Si olvidaste la contraseña, puedes restablecerla desde Firebase Console > Authentication > Users

#### Error: "El formato del email no es válido"
- **Solución**: Asegúrate de usar un formato válido: usuario@dominio.com

#### Error: "Demasiados intentos fallidos"
- **Solución**: Espera unos minutos antes de intentar nuevamente
- Firebase bloquea temporalmente después de varios intentos fallidos

### 5. Verificar en Firebase Console que el Usuario Existe

1. Ve a Firebase Console > Authentication > Users
2. Deberías ver tu usuario listado con el email que usaste para registrarte
3. Si no aparece, significa que el registro no se completó correctamente

### 6. Verificar la Configuración de Firebase

Abre `src/firebase/config.js` y verifica que tenga estos valores correctos:
- `apiKey`: Debe estar presente
- `authDomain`: Debe ser "cubingmate-7a406.firebaseapp.com"
- `projectId`: Debe ser "cubingmate-7a406"

## ✅ Mejoras Implementadas

El código ahora incluye:

1. **Validación de email antes de enviar**: Verifica el formato del email
2. **Normalización de email**: Convierte a minúsculas y elimina espacios
3. **Validación de contraseña**: Verifica que tenga al menos 6 caracteres
4. **Mensajes de error claros**: Cada error tiene un mensaje específico y útil
5. **Manejo robusto de errores**: Captura todos los tipos de errores de Firebase

## 🔍 Verificar en la Consola del Navegador

Si aún hay problemas:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Console**
3. Intenta iniciar sesión
4. Revisa si hay errores en la consola
5. Los errores te dirán exactamente qué está fallando

## 📝 Notas Importantes

- El email se normaliza automáticamente (se convierte a minúsculas)
- Los espacios en blanco se eliminan automáticamente
- La contraseña debe tener al menos 6 caracteres (requisito de Firebase)
- Si cambias la configuración de Firebase, recarga la página completamente
