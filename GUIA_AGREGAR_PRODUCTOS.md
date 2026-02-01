# 📦 Guía para Agregar Productos (Cubos de Rubik)

Esta guía te mostrará cómo agregar nuevos cubos de Rubik a tu tienda.

## 📋 Campos Requeridos del Producto

Cada producto (cubo) debe tener los siguientes campos:

### Campos Obligatorios:
- **nombre** (string): Nombre del cubo (ej: "Cubo Rubik 3x3 Speedcube Pro")
- **precio** (number): Precio en CLP (ej: 25000)
- **imagen** (string): URL de la imagen del producto

### Campos Opcionales pero Recomendados:
- **marca** (string): Marca del cubo (ej: "GAN", "MoYu", "Rubik's")
- **tipo** (string): Tipo de cubo (ej: "3x3", "4x4", "pyraminx", "2x2", "5x5")
- **category** (string): Categoría (puede ser igual a tipo o diferente)
- **description** (string): Descripción del producto
- **stock** (number): Cantidad disponible (ej: 50)
- **createdAt** (timestamp): Fecha de creación
- **updatedAt** (timestamp): Fecha de actualización

## 🎯 Tipos de Cubos Disponibles

Puedes usar estos tipos comunes:
- `3x3` - Cubo clásico 3x3x3
- `2x2` - Cubo 2x2x2
- `4x4` - Cubo 4x4x4
- `5x5` - Cubo 5x5x5
- `pyraminx` - Pyraminx
- `megaminx` - Megaminx
- `skewb` - Skewb
- `speedcubes` - Speedcubes profesionales
- `accesorios` - Accesorios y lubricantes

## 📝 Método 1: Agregar desde Firebase Console

### Paso 1: Acceder a Firestore
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**

### Paso 2: Crear/Editar Colección
1. Si no existe, crea la colección `products`
2. Haz clic en **"Agregar documento"** o **"Start collection"**

### Paso 3: Agregar Campos
Crea un documento con estos campos:

```
nombre: "Cubo Rubik 3x3 Speedcube Pro"
marca: "GAN"
tipo: "3x3"
precio: 25000
imagen: "https://ejemplo.com/imagen.jpg"
description: "Cubo de alta velocidad diseñado para competencias profesionales. Mecanismo suave y estable."
stock: 30
category: "3x3"
createdAt: [Timestamp - usa el botón para agregar]
updatedAt: [Timestamp - usa el botón para agregar]
```

### Paso 4: Guardar
Haz clic en **"Guardar"** y el producto aparecerá en tu tienda.

## 💻 Método 2: Agregar desde Código

### Opción A: Usar el Script de Ejemplo

1. Edita el archivo `scripts/addSampleProducts.js`
2. Agrega tu producto al array `sampleProducts`:

```javascript
{
  nombre: "Cubo Rubik 3x3 Speedcube Pro",
  marca: "GAN",
  tipo: "3x3",
  precio: 25000,
  imagen: "https://ejemplo.com/imagen.jpg",
  description: "Cubo de alta velocidad para competencias",
  stock: 30,
  category: "3x3"
}
```

3. Ejecuta el script (necesitarás configurar las credenciales de Firebase primero)

### Opción B: Usar la Función createProduct

```javascript
import { createProduct } from './src/firebase/products'

const nuevoCubo = {
  nombre: "Cubo Rubik 3x3 Speedcube Pro",
  marca: "GAN",
  tipo: "3x3",
  precio: 25000,
  imagen: "https://ejemplo.com/imagen.jpg",
  description: "Cubo de alta velocidad diseñado para competencias profesionales",
  stock: 30,
  category: "3x3"
}

await createProduct(nuevoCubo)
```

## 🖼️ Obtener URLs de Imágenes

### Opción 1: URLs Externas
- Usa URLs de imágenes públicas (ej: Imgur, Cloudinary)
- Asegúrate de que la imagen sea accesible públicamente

### Opción 2: Firebase Storage (Recomendado)

1. Ve a Firebase Console > **Storage**
2. Haz clic en **"Cargar archivo"**
3. Sube la imagen del cubo
4. Haz clic derecho en el archivo > **"Obtener URL de descarga"**
5. Copia la URL y úsala en el campo `imagen`

## 📐 Estructura Completa de un Producto

```javascript
{
  // Información básica
  nombre: "Cubo Rubik 3x3 Speedcube Pro",
  marca: "GAN",
  tipo: "3x3",
  category: "3x3", // Puede ser igual a tipo
  
  // Precio y disponibilidad
  precio: 25000, // En CLP
  stock: 30,
  
  // Imagen
  imagen: "https://ejemplo.com/cubo-3x3.jpg",
  
  // Descripción
  description: "Cubo de alta velocidad diseñado para competencias profesionales. Mecanismo suave y estable, perfecto para speedcubers avanzados.",
  
  // Metadatos
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## ✅ Ejemplo Completo

```javascript
{
  nombre: "GAN 356 X Speedcube",
  marca: "GAN",
  tipo: "3x3",
  category: "speedcubes",
  precio: 55000,
  imagen: "https://storage.googleapis.com/tu-proyecto.appspot.com/cubos/gan356x.jpg",
  description: "Speedcube profesional de alta gama utilizado por campeones mundiales. Sistema de ajuste GES Pro y núcleo magnético.",
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## 🎨 Consejos de Diseño

1. **Imágenes**: Usa imágenes de alta calidad (mínimo 800x800px)
2. **Descripciones**: Sé descriptivo pero conciso (80-150 caracteres para la vista previa)
3. **Precios**: Usa números enteros en CLP
4. **Stock**: Mantén el stock actualizado

## 🔄 Actualizar un Producto Existente

1. Ve a Firestore Database
2. Busca el documento del producto
3. Haz clic en el documento
4. Edita los campos que necesites
5. Actualiza `updatedAt` con la fecha actual
6. Guarda los cambios

## 🗑️ Eliminar un Producto

1. Ve a Firestore Database
2. Busca el documento del producto
3. Haz clic en los tres puntos (...) > **Eliminar**

## 📱 Verificar en la Aplicación

Después de agregar un producto:
1. Recarga la página principal
2. El producto debería aparecer en la lista
3. Haz clic en "Ver más" para ver los detalles
4. Prueba agregarlo al carrito

---

¡Listo! Ahora puedes agregar todos los cubos que quieras a tu tienda. 🧩✨
