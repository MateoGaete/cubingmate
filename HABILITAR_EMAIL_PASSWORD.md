# 📧 Habilitar Email/Password en Firebase Authentication

Esta guía te mostrará cómo habilitar el método de autenticación con Email y Contraseña en Firebase.

## Paso 1: Acceder a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Selecciona tu proyecto **"cubingmate-7a406"** (o el nombre de tu proyecto)

## Paso 2: Ir a Authentication

1. En el menú lateral izquierdo, busca y haz clic en **"Authentication"** (Autenticación)
2. Si es la primera vez, haz clic en **"Comenzar"** o **"Get started"**

## Paso 3: Habilitar Email/Password

1. En la página de Authentication, ve a la pestaña **"Sign-in method"** (Método de inicio de sesión)
2. En la lista de proveedores, busca **"Email/Password"**
3. Haz clic en **"Email/Password"**

## Paso 4: Activar Email/Password

1. Verás dos opciones:
   - **Email/Password**: Método tradicional con email y contraseña
   - **Email link (passwordless sign-in)**: Login sin contraseña (opcional)

2. **Activa el primer toggle** (Email/Password) moviendo el interruptor a la derecha
   - Este es el método que necesitas para login con email y contraseña

3. (Opcional) Si quieres, también puedes activar el segundo toggle para login sin contraseña

4. Haz clic en **"Guardar"** o **"Save"** (botón en la parte inferior)

## Paso 5: Verificar que Está Habilitado

1. Deberías ver que **"Email/Password"** ahora aparece como **"Enabled"** (Habilitado) en la lista
2. El estado debería cambiar de gris a verde/azul

## ✅ Listo!

Ahora tu aplicación puede:
- ✅ Registrar nuevos usuarios con email y contraseña
- ✅ Iniciar sesión con email y contraseña
- ✅ Usar el formulario de registro en `/register`
- ✅ Usar el formulario de login en `/login`

## Probar la Funcionalidad

1. Ve a tu aplicación: `http://localhost:3000/register`
2. Crea una cuenta nueva con email y contraseña
3. Luego ve a `/login` e inicia sesión

## Notas Importantes

- **Seguridad**: Firebase almacena las contraseñas de forma segura (hash bcrypt)
- **Validación**: Firebase valida automáticamente el formato del email
- **Requisitos de contraseña**: Mínimo 6 caracteres (configurable en Firebase)
- **Verificación de email**: Opcional, puedes habilitarla más adelante

## Solución de Problemas

### No veo "Email/Password" en la lista
- Asegúrate de estar en la pestaña **"Sign-in method"**
- Si no aparece, recarga la página

### El toggle no se activa
- Verifica que tengas permisos de administrador en el proyecto
- Intenta recargar la página

### Error al registrar usuario
- Verifica que Email/Password esté habilitado
- Revisa la consola del navegador para ver el error específico

---

¡Listo! Tu método de autenticación Email/Password está habilitado. 🎉
