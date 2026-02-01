# 🔐 Configuración de Firebase Authentication

Esta guía te ayudará a habilitar Firebase Authentication para el sistema de inicio de sesión.

## Paso 1: Habilitar Authentication en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, busca **"Authentication"** (Autenticación)
4. Haz clic en **"Comenzar"** o **"Get started"**

## Paso 2: Configurar Método de Autenticación

1. En la página de Authentication, ve a la pestaña **"Sign-in method"** (Método de inicio de sesión)
2. Haz clic en **"Email/Password"**
3. Habilita el primer toggle: **"Email/Password"**
4. Opcionalmente, habilita el segundo toggle: **"Email link (passwordless sign-in)"** si quieres autenticación sin contraseña
5. Haz clic en **"Guardar"**

## Paso 3: Verificar que Funcione

1. Tu aplicación ya está configurada para usar Firebase Authentication
2. Los usuarios pueden:
   - Registrarse en `/register`
   - Iniciar sesión en `/login`
   - Ver su email en el header cuando están autenticados
   - Cerrar sesión desde el header

## Características Implementadas

✅ **Registro de usuarios** con email y contraseña
✅ **Inicio de sesión** con email y contraseña
✅ **Inicio de sesión con Google** (ver `GOOGLE_SIGNIN_SETUP.md`)
✅ **Cerrar sesión**
✅ **Persistencia de sesión** (el usuario permanece logueado al recargar)
✅ **Protección de rutas** (si ya está logueado, redirige al inicio)
✅ **Prellenado de email** en checkout si el usuario está autenticado
✅ **Foto de perfil** mostrada en el header (si está disponible)

## Seguridad

- Las contraseñas se almacenan de forma segura en Firebase (hash bcrypt)
- Firebase maneja automáticamente la validación de emails
- Las sesiones se mantienen seguras con tokens JWT

## Próximos Pasos

✅ **Google Sign-In ya está implementado** - Ver `GOOGLE_SIGNIN_SETUP.md` para configurarlo

### Otros Métodos (Opcional)

Puedes agregar más métodos de autenticación:
- **Facebook Login**: Para login con Facebook
- **Twitter**: Para login con Twitter
- **GitHub**: Para login con GitHub

Para agregar estos métodos, ve a Authentication > Sign-in method y habilita el que desees.

---

¡Listo! Tu sistema de autenticación está configurado. 🎉
