# 🧩 CubingMate - Tienda Online de Cubos de Rubik

Tienda web moderna para la venta de cubos de Rubik y productos relacionados, desarrollada con React y Firebase.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración de Firebase](#configuración-de-firebase)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Agregar Productos](#agregar-productos)
- [Despliegue](#despliegue)

## ✨ Características

- 🛍️ Catálogo de productos con categorías
- 🛒 Carrito de compras funcional
- 💳 Sistema de pagos (pendiente de implementar)
- 🔥 Base de datos en tiempo real con Firebase Firestore
- 📱 Diseño responsive (móvil y desktop)
- 🎨 Interfaz moderna y atractiva

## 🛠️ Tecnologías

- **React 18** - Biblioteca de JavaScript para interfaces
- **Vite** - Herramienta de construcción rápida
- **Firebase** - Backend como servicio (Firestore, Auth, Storage)
- **React Router** - Navegación entre páginas
- **Lucide React** - Iconos modernos

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Firebase

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase** (ver sección siguiente)


5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔥 Configuración de Firebase

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa un nombre para tu proyecto (ej: "cubingmate")
4. Sigue los pasos del asistente

### Paso 2: Configurar Firestore Database

1. En el panel de Firebase, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Comenzar en modo de prueba** (para desarrollo)
4. Elige una ubicación (recomendado: `southamerica-east1` para Chile)
5. Haz clic en **Habilitar**

### Paso 3: Obtener Credenciales

1. En Firebase Console, ve a **Configuración del proyecto** (⚙️)
2. Desplázate hasta **Tus aplicaciones**
3. Haz clic en el ícono **</>** (Web)
4. Registra tu app con un nombre (ej: "CubingMate Web")
5. Copia las credenciales que aparecen

### Paso 4: Configurar en el Proyecto

1. Abre el archivo `src/firebase/config.js`
2. Reemplaza los valores con tus credenciales de Firebase:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
}
```

### Paso 5: Configurar Reglas de Firestore

1. En Firebase Console, ve a **Firestore Database** > **Reglas**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de productos
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Cambiar a true solo para administradores
    }
    
    // Permitir lectura/escritura de órdenes solo al usuario autenticado
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Haz clic en **Publicar**

## 💳 Configuración de Pagos

### Transferencia Bancaria

El sistema utiliza transferencias bancarias como método de pago. Los clientes recibirán las instrucciones de transferencia después de completar el checkout.

**Para configurar tus datos bancarios:**

1. Edita el archivo `src/pages/TransferInstructions.jsx`
2. Actualiza los siguientes datos con tu información bancaria:
   - `bankName`: Nombre de tu banco
   - `accountType`: Tipo de cuenta (Cuenta Corriente, Cuenta Vista, etc.)
   - `accountNumber`: Número de cuenta
   - `accountHolder`: Nombre del titular
   - `rut`: RUT del titular
   - `email`: Email para confirmaciones de pago

## 🚀 Uso

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Construir para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

### Previsualizar Build de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
CubingMate.Web/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductList.jsx
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   └── Checkout.jsx
│   ├── firebase/         # Configuración y funciones de Firebase
│   │   ├── config.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── services/         # Servicios externos
│   ├── App.jsx           # Componente principal
│   ├── App.css
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 📦 Agregar Productos

### Opción 1: Desde Firebase Console

1. Ve a Firebase Console > Firestore Database
2. Haz clic en **Iniciar colección**
3. Nombre de colección: `products`
4. Agrega documentos con estos campos:

```javascript
{
  name: "Cubo Rubik 3x3 Speedcube",
  description: "Cubo de alta velocidad para competencias",
  price: 15000,
  category: "3x3",
  stock: 50,
  image: "https://url-de-tu-imagen.com/imagen.jpg",
  brand: "Marca del cubo"
}
```

### Opción 2: Desde el Código (Script)

Puedes crear un script para agregar productos. Ejemplo:

```javascript
import { createProduct } from './src/firebase/products'

const nuevoProducto = {
  name: "Cubo Rubik 3x3 Speedcube",
  description: "Cubo de alta velocidad para competencias",
  price: 15000,
  category: "3x3",
  stock: 50,
  image: "https://url-de-tu-imagen.com/imagen.jpg",
  brand: "Marca del cubo"
}

createProduct(nuevoProducto)
```

### Categorías Disponibles

- `3x3` - Cubos 3x3x3
- `2x2` - Cubos 2x2x2
- `4x4` - Cubos 4x4x4
- `5x5` - Cubos 5x5x5
- `speedcubes` - Speedcubes profesionales
- `accesorios` - Accesorios y lubricantes

## 🌐 Despliegue

### Opción 1: Firebase Hosting (Recomendado)

1. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Inicia sesión:
   ```bash
   firebase login
   ```

3. Inicializa Firebase:
   ```bash
   firebase init hosting
   ```

4. Construye el proyecto:
   ```bash
   npm run build
   ```

5. Despliega:
   ```bash
   firebase deploy --only hosting
   ```

### Opción 2: Vercel

1. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Despliega:
   ```bash
   vercel
   ```

### Opción 3: Netlify

1. Construye el proyecto:
   ```bash
   npm run build
   ```

2. Arrastra la carpeta `dist/` a [Netlify Drop](https://app.netlify.com/drop)

## 🔒 Seguridad

- ⚠️ **NUNCA** subas tus credenciales de Firebase a GitHub
- Usa variables de entorno para producción
- Configura correctamente las reglas de Firestore
- Valida todos los datos del lado del servidor

## 📝 Notas Importantes

1. **Reglas de Firestore**: Ajusta las reglas según tus necesidades de seguridad
2. **Imágenes**: Puedes usar Firebase Storage para almacenar imágenes de productos

## 🐛 Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que hayas configurado correctamente `src/firebase/config.js`


### Los productos no se muestran
- Verifica que hayas creado la colección `products` en Firestore
- Revisa las reglas de Firestore para permitir lectura

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de [Firebase](https://firebase.google.com/docs)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

¡Disfruta construyendo tu tienda de cubos de Rubik! 🧩✨
