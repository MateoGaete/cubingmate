# 🔐 Configuración de "Iniciar Sesión con Google"

Esta guía te ayudará a habilitar la autenticación con Google en Firebase.

## Paso 1: Habilitar Google Sign-In en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, busca **"Authentication"** (Autenticación)
4. Ve a la pestaña **"Sign-in method"** (Método de inicio de sesión)
5. Busca **"Google"** en la lista de proveedores
6. Haz clic en **"Google"**

## Paso 2: Configurar Google como Proveedor

1. Activa el toggle **"Enable"** (Habilitar)
2. Selecciona un **"Project support email"** (Email de soporte del proyecto)
   - Este es el email que aparecerá en las pantallas de consentimiento de Google
3. Haz clic en **"Save"** (Guardar)

## Paso 3: (Opcional) Configurar Dominios Autorizados

Si vas a desplegar tu aplicación en un dominio específico:

1. En Firebase Console, ve a **Authentication** > **Settings** (Configuración)
2. Desplázate hasta **"Authorized domains"** (Dominios autorizados)
3. Agrega tu dominio si no está en la lista
   - Los dominios `localhost` y tu dominio de Firebase ya están incluidos por defecto

## Paso 4: Verificar que Funcione

1. Tu aplicación ya está configurada para usar Google Sign-In
2. Los usuarios pueden:
   - Hacer clic en **"Continuar con Google"** en la página de Login
   - Seleccionar su cuenta de Google
   - Ser autenticados automáticamente
   - Ver su foto de perfil y nombre en el header

## Características Implementadas

✅ **Botón "Continuar con Google"** en la página de Login
✅ **Ventana emergente de Google** para seleccionar cuenta
✅ **Guardado automático** de información del usuario en Firestore
✅ **Foto de perfil** mostrada en el header
✅ **Nombre del usuario** mostrado en el header
✅ **Redirección automática** después del login
✅ **Verificación de sesión** (si ya está logueado, redirige al inicio)

## Información que se Guarda

Cuando un usuario inicia sesión con Google, se guarda en Firestore:

- **uid**: ID único del usuario
- **email**: Email de la cuenta de Google
- **displayName**: Nombre completo del usuario
- **photoURL**: URL de la foto de perfil
- **provider**: "google"
- **createdAt**: Fecha de creación (solo la primera vez)
- **updatedAt**: Fecha de última actualización

## Estructura en Firestore

La información se guarda en la colección `users` con el siguiente formato:

```
users/
  {uid}/
    email: "usuario@gmail.com"
    displayName: "Juan Pérez"
    photoURL: "https://lh3.googleusercontent.com/..."
    provider: "google"
    createdAt: Timestamp
    updatedAt: Timestamp
```

## Solución de Problemas

### Error: "popup-blocked"
- **Causa**: El navegador bloqueó la ventana emergente
- **Solución**: Permite ventanas emergentes para tu sitio

### Error: "popup-closed-by-user"
- **Causa**: El usuario cerró la ventana de autenticación
- **Solución**: Es normal, el usuario puede intentar nuevamente

### Error: "auth/unauthorized-domain"
- **Causa**: El dominio no está autorizado en Firebase
- **Solución**: Agrega tu dominio en Authentication > Settings > Authorized domains

### No se muestra la foto de perfil
- **Causa**: El usuario no tiene foto en su cuenta de Google
- **Solución**: Es normal, se mostrará el ícono de usuario por defecto

## Próximos Pasos

Una vez configurado Google Sign-In:
1. Prueba el flujo completo de autenticación
2. Verifica que los usuarios se guarden en Firestore
3. Personaliza la experiencia según tus necesidades

---

¡Listo! Tu sistema de autenticación con Google está configurado. 🎉
