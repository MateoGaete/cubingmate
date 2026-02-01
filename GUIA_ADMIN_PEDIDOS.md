# Guía: Cómo Ver los Datos de Identificación y Envío de tus Clientes

## 📋 Resumen

Cuando un cliente completa el formulario de checkout (identificación y envío), todos sus datos se guardan automáticamente en Firebase. Puedes ver todos estos datos en el **Panel de Administración** que está **dentro de tu página web**, no en Firebase Console.

## 🚀 Cómo Acceder al Panel de Administración

### ⚠️ IMPORTANTE: El panel está en tu página web, NO en Firebase

El panel de administración es parte de tu aplicación web (CubingMate.Web), no es algo que veas en Firebase Console.

### Pasos para Acceder:

1. **Abre tu página web en el navegador**
   - Si estás en desarrollo: `http://localhost:5173`
   - Si está en producción: tu dominio (ej: `https://tudominio.com`)

2. **Inicia sesión con tu cuenta**
   - Haz clic en "Iniciar Sesión" en el header
   - Usa tu email y contraseña, o inicia sesión con Google

3. **Busca el enlace "Admin" en el header**
   - Una vez que estés iniciado sesión, verás un nuevo enlace llamado **"Admin"** en la barra de navegación superior
   - Está entre "Contáctanos" y el carrito

4. **Haz clic en "Admin"**
   - Esto te llevará a la página: `http://localhost:5173/admin`

### 📍 Ubicación Visual:

```
┌─────────────────────────────────────────┐
│ [Logo] CubingMate                       │
│                                         │
│ Inicio | Contáctanos | Admin | 🛒 | 👤 │
│              ↑                          │
│         (Este enlace)                   │
└─────────────────────────────────────────┘
```

### 🔗 URL Directa:

Si prefieres ir directo, puedes escribir en la barra de direcciones:
- **Desarrollo:** `http://localhost:5173/admin`
- **Producción:** `https://tudominio.com/admin`

**Nota:** Debes estar iniciado sesión para ver el panel, de lo contrario te redirigirá al login.

## 📊 Qué Verás en el Panel

El panel muestra **todas las órdenes** con la siguiente información:

### Datos del Cliente (Identificación)
- ✅ Nombre completo
- ✅ Email
- ✅ Teléfono
- ✅ Ciudad

### Datos de Envío
- ✅ País
- ✅ Comuna
- ✅ Dirección completa (calle y número)
- ✅ Tipo de vivienda (casa, departamento, oficina)
- ✅ Código postal
- ✅ Si eligió BlueExpress

### Información del Pedido
- ✅ ID de la orden
- ✅ Fecha y hora del pedido
- ✅ Productos comprados
- ✅ Cantidades
- ✅ Precios
- ✅ Total del pedido
- ✅ Estado (Pendiente, Completado, Cancelado)

## 🔍 Filtrar Pedidos

Puedes filtrar los pedidos por estado:
- **Todas**: Muestra todos los pedidos
- **Pendientes**: Solo pedidos pendientes
- **Completadas**: Pedidos completados/pagados
- **Canceladas**: Pedidos cancelados

## ✏️ Cambiar Estado de un Pedido

Puedes cambiar el estado de cualquier pedido usando el menú desplegable en cada orden:
- Pendiente
- Completado
- Cancelado

## 📤 Cómo Pasar los Datos a tu Proveedor

### Opción 1: Copiar Manualmente desde el Panel (RECOMENDADO)
1. Abre tu página web e inicia sesión
2. Haz clic en **"Admin"** en el header
3. Busca la orden que necesitas (puedes usar los filtros)
4. Verás todos los datos organizados:
   - **Datos del Cliente:** Nombre, email, teléfono, ciudad
   - **Datos de Envío:** Dirección completa, comuna, tipo de vivienda, etc.
5. Copia los datos manualmente
6. Pásalos a tu proveedor (por email, WhatsApp, Excel, etc.)

### Opción 2: Ver desde Firebase Console (Alternativa)
Si prefieres ver los datos directamente en Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **CubingMate**
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Verás una lista de colecciones, busca **"orders"**
5. Haz clic en **"orders"** para ver todas las órdenes
6. Cada documento es una orden con todos los datos
7. Puedes copiar los datos desde ahí

**Ventaja del Panel Web vs Firebase Console:**
- ✅ El panel web está más organizado y fácil de leer
- ✅ Puedes cambiar el estado de los pedidos
- ✅ Tienes filtros para buscar más fácil
- ✅ Firebase Console muestra los datos en formato técnico (JSON)

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- El panel de administración solo es visible para usuarios autenticados
- En producción, considera agregar una verificación adicional para que solo usuarios administradores puedan acceder
- Los datos están protegidos por las reglas de seguridad de Firestore

## 📝 Estructura de Datos en Firebase

Cada orden se guarda así en Firestore:

```javascript
{
  customer: {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    phone: "+56912345678",
    city: "Santiago"
  },
  shipping: {
    pais: "Chile",
    comuna: "Las Condes",
    calle: "Av. Providencia",
    numero: "123",
    tipoVivienda: "departamento",
    codigoPostal: "7500000",
    blueExpress: true
  },
  items: [...], // Productos
  total: 50000,
  status: "pending",
  createdAt: Timestamp,
  userId: "user-id"
}
```

## 💡 Consejos

1. **Revisa regularmente** el panel para ver nuevos pedidos
2. **Marca como "Completado"** cuando hayas enviado el pedido a tu proveedor
3. **Usa los filtros** para organizar mejor los pedidos
4. **Guarda los IDs de orden** para referencia con tu proveedor

## 🆘 Problemas Comunes y Soluciones

### ❌ No veo el enlace "Admin"
**Solución:**
- ✅ Asegúrate de estar **iniciado sesión** (debes ver tu nombre/foto en el header)
- ✅ Si no estás iniciado sesión, haz clic en "Iniciar Sesión"
- ✅ Recarga la página después de iniciar sesión
- ✅ El enlace "Admin" solo aparece cuando estás autenticado

### ❌ No aparecen pedidos en el panel
**Solución:**
- ✅ Verifica que los clientes hayan completado el checkout (pasos 1, 2 y 3)
- ✅ Revisa la consola del navegador (F12) por errores
- ✅ Verifica las reglas de seguridad de Firestore (deben permitir lectura)
- ✅ Prueba crear un pedido de prueba para verificar

### ❌ No puedo cambiar el estado de un pedido
**Solución:**
- ✅ Verifica que estés autenticado correctamente
- ✅ Revisa las reglas de Firestore para permitir actualizaciones
- ✅ Recarga la página e intenta de nuevo

### ❌ Me redirige al login cuando intento entrar a /admin
**Solución:**
- ✅ Esto es normal si no estás iniciado sesión
- ✅ Inicia sesión primero y luego intenta acceder al panel

### ❌ Los datos no se ven completos
**Solución:**
- ✅ Verifica que el cliente haya completado todos los campos del checkout
- ✅ Algunos campos son opcionales (como código postal)
- ✅ Revisa en Firebase Console si los datos están guardados correctamente
