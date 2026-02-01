# 🔧 Solución de Error al Iniciar Sesión

Si ves el error "Error al iniciar sesión. Verifica tus credenciales", sigue estos pasos:

## ✅ Verificaciones Básicas

### 1. ¿Ya tienes una cuenta registrada?

**Si NO tienes cuenta:**
- Ve a `/register` y crea una cuenta primero
- Luego intenta iniciar sesión

**Si SÍ tienes cuenta:**
- Verifica que el email esté escrito correctamente
- Verifica que la contraseña sea la correcta

### 2. Verifica que Email/Password esté habilitado en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. Verifica que **Email/Password** esté **Enabled** (Habilitado)
5. Si no está habilitado, actívalo y guarda

### 3. Verifica la Configuración de Firebase

Abre `src/firebase/config.js` y verifica que las credenciales sean correctas:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

## 🔍 Mensajes de Error Específicos

Ahora la aplicación muestra mensajes más específicos:

### "No existe una cuenta con este email"
- **Solución**: Ve a `/register` y crea una cuenta nueva
- O verifica que escribiste el email correctamente

### "Contraseña incorrecta"
- **Solución**: Verifica que la contraseña sea la correcta
- Si olvidaste la contraseña, puedes restablecerla desde Firebase Console

### "El formato del email no es válido"
- **Solución**: Verifica que el email tenga el formato correcto (ejemplo@email.com)

### "Demasiados intentos fallidos"
- **Solución**: Espera unos minutos antes de intentar nuevamente
- Firebase bloquea temporalmente después de varios intentos fallidos

### "El método de autenticación no está habilitado"
- **Solución**: Ve a Firebase Console > Authentication > Sign-in method
- Habilita Email/Password y guarda

### "Error de conexión"
- **Solución**: Verifica tu conexión a internet
- Recarga la página e intenta nuevamente

## 📝 Pasos para Probar

1. **Primero, crea una cuenta:**
   - Ve a `http://localhost:3000/register`
   - Completa el formulario con:
     - Email válido (ej: test@example.com)
     - Contraseña (mínimo 6 caracteres)
   - Haz clic en "Crear Cuenta"

2. **Luego, inicia sesión:**
   - Ve a `http://localhost:3000/login`
   - Ingresa el mismo email y contraseña
   - Haz clic en "Iniciar Sesión"

## 🐛 Ver Errores en la Consola

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Intenta iniciar sesión
4. Revisa los errores que aparecen en rojo
5. Comparte el error específico si necesitas ayuda

## ✅ Checklist de Verificación

- [ ] Email/Password está habilitado en Firebase
- [ ] Las credenciales de Firebase son correctas
- [ ] Ya creaste una cuenta en `/register`
- [ ] El email está escrito correctamente
- [ ] La contraseña es correcta (mínimo 6 caracteres)
- [ ] No hay errores en la consola del navegador

## 💡 Consejos

- **Usa un email real**: Aunque sea de prueba, usa un formato válido
- **Contraseña segura**: Mínimo 6 caracteres, pero recomendado más
- **Revisa la consola**: Los errores específicos aparecen en la consola del navegador
- **Prueba en modo incógnito**: A veces los problemas son por caché del navegador

## 🆘 Si Nada Funciona

1. Abre la consola del navegador (F12)
2. Copia el error completo que aparece
3. Verifica en Firebase Console que:
   - Authentication esté habilitado
   - Email/Password esté habilitado
   - Tu proyecto esté activo

---

¿Necesitas más ayuda? Revisa los errores en la consola del navegador y compártelos.
