# 🌐 Solución: Error auth/unauthorized-domain

## Problema

Estás recibiendo el error `auth/unauthorized-domain` al intentar iniciar sesión con Google, aunque el dominio aparece en la lista de dominios autorizados.

## Soluciones

### 1. Verificar Dominio Exacto

El dominio debe coincidir exactamente con la URL desde la que se accede:

- ✅ Si accedes desde `https://www.cubingmate.com` → el dominio debe ser `www.cubingmate.com`
- ✅ Si accedes desde `https://cubingmate.com` → el dominio debe ser `cubingmate.com`
- ❌ No funcionará si accedes desde `http://` pero el dominio está configurado para `https://`

### 2. Agregar Ambos Dominios (con y sin www)

Asegúrate de tener ambos dominios agregados:

1. Ve a Firebase Console > Authentication > Settings > Authorized domains
2. Verifica que tengas:
   - `cubingmate.com`
   - `www.cubingmate.com`
3. Si falta alguno, haz clic en "Agregar un dominio" y agrégalo

### 3. Verificar Protocolo (HTTP vs HTTPS)

- En producción, siempre usa `https://`
- El dominio debe estar configurado para HTTPS
- Si estás en desarrollo local, usa `localhost` (ya está incluido por defecto)

### 4. Limpiar Caché y Esperar

A veces los cambios en Firebase pueden tardar unos minutos en propagarse:

1. Espera 2-5 minutos después de agregar el dominio
2. Limpia la caché del navegador (Ctrl+Shift+Delete)
3. Intenta nuevamente

### 5. Verificar en Google Cloud Console

También necesitas verificar en Google Cloud Console:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el proyecto `cubingmate-7a406`
3. Ve a **APIs & Services** > **Credentials**
4. Busca tu **OAuth 2.0 Client ID**
5. En **Authorized JavaScript origins**, agrega:
   - `https://cubingmate.com`
   - `https://www.cubingmate.com`
6. En **Authorized redirect URIs**, agrega:
   - `https://cubingmate.com`
   - `https://www.cubingmate.com`

### 6. Verificar Configuración de Firebase Auth Domain

En Firebase Console > Authentication > Settings, verifica que:

- **Authorized domains** incluye tu dominio de producción
- El dominio está marcado como "Custom" (no "Default")
- No hay errores de validación

## Checklist de Verificación

- [ ] Dominio agregado en Firebase Console > Authentication > Settings > Authorized domains
- [ ] Tanto `cubingmate.com` como `www.cubingmate.com` están agregados
- [ ] Dominios agregados en Google Cloud Console > APIs & Services > Credentials
- [ ] Estás usando HTTPS en producción
- [ ] Esperaste 2-5 minutos después de agregar el dominio
- [ ] Limpiaste la caché del navegador

## Si el Problema Persiste

1. Verifica que el dominio esté correctamente configurado en tu proveedor de hosting
2. Asegúrate de que el certificado SSL esté activo
3. Contacta al soporte de Firebase si el problema continúa después de seguir todos los pasos
