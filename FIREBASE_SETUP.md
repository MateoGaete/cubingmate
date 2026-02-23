# 🔥 Guía Detallada de Configuración de Firebase

Esta guía te ayudará a configurar Firebase paso a paso para tu tienda de cubos de Rubik.

## Paso 1: Crear Proyecto en Firebase

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Crear un proyecto"**
3. Ingresa un nombre para tu proyecto (ejemplo: `cubingmate`)
4. Opcionalmente, desactiva Google Analytics si no lo necesitas
5. Haz clic en **"Crear proyecto"**
6. Espera a que se complete la creación (puede tardar unos minutos)

## Paso 2: Configurar Firestore Database

### 2.1 Crear la Base de Datos

1. En el panel principal de Firebase, busca **"Firestore Database"** en el menú lateral
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
4. Elige una ubicación para tu base de datos:
   - Para Chile: `southamerica-east1` (São Paulo) o `us-central1`
   - Haz clic en **"Habilitar"**

### 2.2 Configurar Reglas de Seguridad

1. Ve a la pestaña **"Reglas"** en Firestore
2. Reemplaza el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: lectura pública, escritura solo para administradores
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Cambiar a true solo si tienes autenticación de admin
    }
    
    // Órdenes: solo lectura/escritura para usuarios autenticados
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
      // Para desarrollo, puedes usar: allow read, write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

### 2.3 Crear la Colección de Productos

1. Ve a la pestaña **"Datos"** en Firestore
2. Haz clic en **"Iniciar colección"**
3. ID de colección: `products`
4. Haz clic en **"Siguiente"**
5. Agrega tu primer documento:

**ID del documento**: (déjalo en automático o usa un ID personalizado)

**Campos del documento**:
```
name (string): "Cubo Rubik 3x3 Speedcube"
description (string): "Cubo de alta velocidad para competencias profesionales"
price (number): 15000
category (string): "3x3"
stock (number): 50
image (string): "https://ejemplo.com/imagen.jpg"
brand (string): "Marca del Cubo"
createdAt (timestamp): [Usa el botón para agregar timestamp]
```

6. Haz clic en **"Guardar"**
7. Repite para agregar más productos

## Paso 3: Obtener Credenciales de la Aplicación Web

1. En Firebase Console, haz clic en el ícono de **⚙️ Configuración** (arriba a la izquierda)
2. Selecciona **"Configuración del proyecto"**
3. Desplázate hasta la sección **"Tus aplicaciones"**
4. Haz clic en el ícono **`</>`** (Web)
5. Registra tu app:
   - **Apodo de la app**: `CubingMate Web`
   - Opcionalmente marca la casilla de Firebase Hosting
   - Haz clic en **"Registrar app"**
6. **Copia las credenciales** que aparecen (las necesitarás en el siguiente paso)

## Paso 4: Configurar en tu Proyecto

1. Abre el archivo `src/firebase/config.js` en tu editor
2. Reemplaza los valores con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Tu API Key
  authDomain: "cubingmate.firebaseapp.com", // Tu Auth Domain
  projectId: "cubingmate", // Tu Project ID
  storageBucket: "cubingmate.appspot.com", // Tu Storage Bucket
  messagingSenderId: "123456789", // Tu Messaging Sender ID
  appId: "1:123456789:web:abc123..." // Tu App ID
}
```

## Paso 5: (Opcional) Configurar Firebase Storage para Imágenes

Si quieres subir imágenes de productos:

1. En Firebase Console, ve a **"Storage"**
2. Haz clic en **"Empezar"**
3. Acepta las reglas de seguridad por defecto
4. Elige una ubicación (la misma que Firestore)
5. Para subir imágenes:
   - Haz clic en **"Cargar archivo"**
   - Sube una imagen
   - Haz clic derecho en el archivo > **"Obtener URL de descarga"**
   - Usa esa URL en el campo `image` de tus productos

## Paso 6: Verificar la Configuración y Consejos Profesionales

### Verificar que Todo Funcione

1. Inicia tu aplicación:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12)
3. Si ves errores de Firebase, verifica:
   - Que las credenciales estén correctas
   - Que Firestore esté habilitado
   - Que las reglas de seguridad permitan lectura

### 💡 Consejos y Recomendaciones Profesionales

#### 🔒 Seguridad
- **Nunca subas tus credenciales de Firebase a GitHub**: Usa variables de entorno en producción
- **Reglas de Firestore**: Empieza con reglas permisivas para desarrollo, pero refuerza la seguridad antes de producción
- **Validación de datos**: Siempre valida los datos del lado del servidor (usando Cloud Functions si es necesario)

#### 📊 Optimización de Firestore
- **Índices**: Si haces búsquedas complejas, crea índices compuestos en Firestore
- **Límites de lectura**: Implementa paginación para listas grandes de productos
- **Caché local**: Considera usar el caché de Firestore para mejorar el rendimiento

#### 🖼️ Imágenes y Storage
- **Tamaño de imágenes**: Optimiza las imágenes antes de subirlas (recomendado: máximo 800x800px)
- **Formatos**: Usa WebP o JPEG comprimido para mejor rendimiento
- **CDN**: Firebase Storage ya incluye CDN, aprovecha esto para carga rápida

#### 💰 Costos
- **Plan gratuito**: Firebase tiene un plan gratuito generoso, pero monitorea tu uso
- **Límites diarios**: 
  - Lecturas: 50,000/día
  - Escrituras: 20,000/día
  - Storage: 5GB
- **Alertas**: Configura alertas de facturación en Firebase Console

#### 🚀 Mejores Prácticas
- **Estructura de datos**: Mantén los documentos pequeños y organizados
- **Nombres de colecciones**: Usa nombres en minúsculas y plurales (products, orders)
- **Timestamps**: Siempre incluye `createdAt` y `updatedAt` para auditoría
- **Backups**: Configura backups automáticos de Firestore (disponible en planes de pago)

#### 🧪 Desarrollo vs Producción
- **Ambientes separados**: Crea proyectos Firebase separados para desarrollo y producción
- **Variables de entorno**: Usa diferentes credenciales según el ambiente
- **Testing**: Prueba todas las funcionalidades antes de pasar a producción

#### 📱 Experiencia de Usuario
- **Loading states**: Muestra estados de carga mientras se obtienen los productos
- **Error handling**: Maneja errores de red graciosamente
- **Offline support**: Firestore tiene soporte offline, considéralo para mejor UX

#### 🔍 Monitoreo
- **Firebase Console**: Revisa regularmente el uso y rendimiento
- **Analytics**: Considera agregar Firebase Analytics para entender a tus usuarios
- **Performance**: Usa Firebase Performance Monitoring para detectar problemas

#### ⚡ Optimizaciones Adicionales
- **Lazy loading**: Carga imágenes solo cuando son visibles
- **Code splitting**: Divide tu código para cargar solo lo necesario
- **Service Workers**: Considera PWA para mejor experiencia móvil

## Estructura de Datos Recomendada

### Colección: `products`

Cada documento debe tener:
- `name` (string): Nombre del producto
- `description` (string): Descripción detallada
- `price` (number): Precio en CLP
- `category` (string): Categoría (3x3, 2x2, 4x4, 5x5, speedcubes, accesorios)
- `stock` (number): Cantidad disponible
- `image` (string): URL de la imagen
- `brand` (string, opcional): Marca del cubo
- `createdAt` (timestamp): Fecha de creación
- `updatedAt` (timestamp): Fecha de actualización

### Colección: `orders`

Cada documento debe tener:
- `items` (array): Array de productos en la orden
- `customer` (object): Información del cliente
- `total` (number): Total de la orden
- `status` (string): Estado (pending, paid, shipped, delivered)
- `createdAt` (timestamp): Fecha de creación
- `updatedAt` (timestamp): Fecha de actualización

## Solución de Problemas Comunes

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de que permitan lectura para productos

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que `src/firebase/config.js` tenga todas las credenciales correctas

### Los productos no se cargan
- Verifica que la colección se llame exactamente `products`
- Verifica que los documentos tengan los campos correctos
- Revisa la consola del navegador para ver errores específicos

## Próximos Pasos

Una vez configurado Firebase:
1. Agrega algunos productos de prueba
2. Prueba la aplicación localmente
3. Configura sistema de pagos (pendiente de implementar)

---

¿Necesitas ayuda? Revisa la [documentación oficial de Firebase](https://firebase.google.com/docs)
