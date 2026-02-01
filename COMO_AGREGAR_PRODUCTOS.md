# 📦 Cómo Agregar Productos al Catálogo

Guía simple para agregar cubos de Rubik a tu catálogo.

## 🎯 Campos Necesarios

Para cada cubo necesitas:
- **nombre** - Nombre del cubo (ej: "RS3M 2020")
- **precio** - Precio en CLP (ej: 12000)
- **imagen** - URL de la imagen
- **category** - Categoría (ej: "3x3", "2x2", "4x4", "pyraminx", "speedcubes", "accesorios")

**Opcionales pero recomendados:**
- **marca** - Marca del cubo (ej: "MoYu", "GAN", "QiYi")
- **tipo** - Tipo de cubo (puede ser igual a category)
- **description** - Descripción del producto
- **stock** - Cantidad disponible (ej: 50)

## 📝 Pasos para Agregar un Producto

### Paso 1: Ir a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **cubingmate-7a406**
3. Haz clic en **Firestore Database**

### Paso 2: Crear o Seleccionar Colección

1. Si no existe, crea la colección `products`
2. Si ya existe, haz clic en ella

### Paso 3: Agregar Documento Nuevo

1. Haz clic en **"Agregar documento"** o **"Add document"**
2. Deja el ID en automático (Firebase lo genera)
3. Agrega los campos uno por uno:

#### Campos Obligatorios:

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `nombre` | string | `RS3M 2020` |
| `precio` | number | `12000` |
| `imagen` | string | `https://ejemplo.com/imagen.jpg` |
| `category` | string | `3x3` |

#### Campos Opcionales:

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `marca` | string | `MoYu` |
| `tipo` | string | `3x3` |
| `description` | string | `Speedcube económico perfecto...` |
| `stock` | number | `50` |

### Paso 4: Guardar

1. Haz clic en **"Guardar"**
2. ¡Listo! El producto aparecerá automáticamente en tu catálogo web

## 🎨 Categorías Disponibles

Puedes usar estas categorías:
- `3x3` - Cubos 3x3x3
- `2x2` - Cubos 2x2x2
- `4x4` - Cubos 4x4x4
- `5x5` - Cubos 5x5x5
- `pyraminx` - Pyraminx
- `speedcubes` - Speedcubes profesionales
- `accesorios` - Accesorios y lubricantes

## 🖼️ Obtener URL de Imagen

### Opción 1: URL Externa
- Usa cualquier URL pública de imagen
- Ejemplo: `https://ejemplo.com/cubo.jpg`

### Opción 2: Firebase Storage (Recomendado)

1. Ve a Firebase Console > **Storage**
2. Haz clic en **"Cargar archivo"**
3. Sube la imagen del cubo
4. Haz clic derecho en el archivo > **"Obtener URL de descarga"**
5. Copia la URL y úsala en el campo `imagen`

## ✅ Ejemplo Completo

Aquí tienes un ejemplo de cómo se ve un producto completo:

```
nombre: "GAN 12 Maglev"
marca: "GAN"
tipo: "3x3"
category: "speedcubes"
precio: 65000
description: "Speedcube profesional de alta gama con tecnología Maglev"
imagen: "https://storage.googleapis.com/tu-proyecto.appspot.com/cubos/gan12.jpg"
stock: 15
```

## 🔄 Verificar en la Web

Después de agregar un producto:

1. Recarga tu página: `http://localhost:3000`
2. El producto debería aparecer en la sección "Productos"
3. Haz clic en "Ver más" para ver los detalles
4. Prueba agregarlo al carrito

## 💡 Consejos

- **Nombres claros**: Usa nombres descriptivos (ej: "RS3M 2020" en lugar de solo "RS3M")
- **Precios enteros**: Usa números enteros en CLP (sin decimales)
- **Imágenes de calidad**: Usa imágenes de al menos 400x400px
- **Descripciones útiles**: Describe las características principales del cubo

---

¡Listo! Ahora puedes agregar todos los cubos que quieras. 🧩✨
