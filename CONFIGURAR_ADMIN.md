# 🔐 Configurar Acceso de Administrador

## ⚠️ IMPORTANTE: Configuración Requerida

Por defecto, **NINGÚN usuario puede acceder al panel de administración**. Debes configurar tu email como administrador.

## 📝 Pasos para Configurar tu Acceso de Administrador

### Paso 1: Encuentra el Archivo de Configuración

Abre el archivo: `src/utils/admin.js`

### Paso 2: Agrega tu Email

En el archivo verás una sección como esta:

```javascript
const ADMIN_EMAILS = [
  'tu-email@ejemplo.com', // Reemplaza con tu email real
]
```

**Reemplaza `'tu-email@ejemplo.com'` con tu email real.**

Por ejemplo, si tu email es `mateo@gmail.com`:

```javascript
const ADMIN_EMAILS = [
  'mateo@gmail.com', // Tu email real
]
```

### Paso 3: Guarda el Archivo

Guarda los cambios en el archivo.

### Paso 4: Reinicia el Servidor

Si el servidor está corriendo, detenlo (Ctrl+C) y vuelve a iniciarlo:

```bash
npm run dev
```

### Paso 5: Verifica el Acceso

1. Inicia sesión con el email que configuraste
2. Deberías ver el enlace "Admin" en el header
3. Haz clic en "Admin" para acceder al panel

---

## 🔒 Método Alternativo: Usar UID (Más Seguro)

Si prefieres usar el UID de Firebase en lugar del email (más seguro):

### Paso 1: Obtén tu UID

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Users**
4. Encuentra tu usuario
5. Copia el **UID** (es un string largo como: `abc123xyz456...`)

### Paso 2: Configura el UID

En `src/utils/admin.js`, descomenta y agrega tu UID:

```javascript
const ADMIN_UIDS = [
  'tu-uid-aqui', // Pega tu UID aquí
]
```

### Paso 3: Guarda y Reinicia

Guarda el archivo y reinicia el servidor.

---

## 👥 Agregar Múltiples Administradores

Puedes agregar varios administradores:

```javascript
const ADMIN_EMAILS = [
  'mateo@gmail.com',
  'socio@ejemplo.com',
  'otro-admin@ejemplo.com',
]
```

O usando UIDs:

```javascript
const ADMIN_UIDS = [
  'uid-admin-1',
  'uid-admin-2',
  'uid-admin-3',
]
```

---

## ✅ Verificación

Para verificar que funciona:

1. ✅ Inicia sesión con tu email de administrador
2. ✅ Debes ver el enlace "Admin" en el header
3. ✅ Puedes acceder a `/admin` sin problemas
4. ✅ Otros usuarios NO verán el enlace "Admin"
5. ✅ Si otro usuario intenta acceder a `/admin`, será redirigido

---

## 🚨 Seguridad

**IMPORTANTE:**

- ⚠️ **NO** subas este archivo a repositorios públicos con tu email real
- ⚠️ En producción, considera usar variables de entorno
- ⚠️ El archivo `admin.js` está en el código del cliente, pero solo los emails/UIDs listados pueden acceder
- ⚠️ Para máxima seguridad, usa UIDs en lugar de emails

---

## 🔧 Solución de Problemas

### No veo el enlace "Admin" después de configurar
- ✅ Verifica que el email sea exactamente el mismo (mayúsculas/minúsculas no importan)
- ✅ Asegúrate de haber guardado el archivo
- ✅ Reinicia el servidor (`npm run dev`)
- ✅ Cierra sesión y vuelve a iniciar sesión

### Me dice "Acceso Denegado"
- ✅ Verifica que tu email esté en la lista `ADMIN_EMAILS`
- ✅ Verifica que hayas iniciado sesión con ese email
- ✅ Revisa la consola del navegador por errores

### Otros usuarios pueden ver "Admin"
- ✅ Verifica que solo tu email esté en la lista
- ✅ Asegúrate de haber guardado los cambios
- ✅ Reinicia el servidor

---

## 📋 Resumen

1. Abre `src/utils/admin.js`
2. Agrega tu email en `ADMIN_EMAILS`
3. Guarda el archivo
4. Reinicia el servidor
5. Inicia sesión con tu email
6. ¡Listo! Ya eres administrador
