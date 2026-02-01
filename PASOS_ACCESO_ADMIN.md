# 📖 Guía Paso a Paso: Cómo Acceder al Panel de Administración

## 🎯 ¿Dónde está el Panel de Administración?

**El panel está en tu página web, NO en Firebase Console.**

Es una página dentro de tu aplicación CubingMate, igual que las páginas "Inicio", "Contáctanos", etc.

---

## 📝 Pasos Detallados

### Paso 1: Abre tu Página Web
1. Abre tu navegador (Chrome, Firefox, Edge, etc.)
2. Ve a tu página web:
   - **Si estás en desarrollo:** `http://localhost:5173`
   - **Si está en producción:** tu dominio (ej: `https://cubingmate.cl`)

### Paso 2: Inicia Sesión
1. En la parte superior derecha, verás un botón **"Iniciar Sesión"**
2. Haz clic en él
3. Ingresa tu email y contraseña (o usa "Continuar con Google")
4. Una vez iniciado sesión, verás tu nombre/foto en lugar del botón de login

### Paso 3: Busca el Enlace "Admin"
1. Mira la barra de navegación superior (header)
2. Verás estos enlaces: **Inicio | Contáctanos | Admin | 🛒 | 👤**
3. El enlace **"Admin"** aparece SOLO cuando estás iniciado sesión
4. Está ubicado entre "Contáctanos" y el carrito

### Paso 4: Haz Clic en "Admin"
1. Haz clic en el enlace **"Admin"**
2. Serás redirigido a: `http://localhost:5173/admin`
3. Verás el panel de administración con todas las órdenes

---

## 🖼️ Visualización

```
┌─────────────────────────────────────────────────────┐
│  [Logo] CubingMate                                  │
│                                                      │
│  Inicio  |  Contáctanos  |  Admin  |  🛒(2)  |  👤  │
│                      ↑                              │
│                 (Este enlace)                       │
└─────────────────────────────────────────────────────┘
```

**Nota:** El enlace "Admin" solo aparece cuando estás iniciado sesión.

---

## 🔗 Acceso Directo (URL)

Si prefieres escribir la URL directamente:

1. Asegúrate de estar iniciado sesión
2. En la barra de direcciones del navegador, escribe:
   - `http://localhost:5173/admin` (desarrollo)
   - `https://tudominio.com/admin` (producción)
3. Presiona Enter

---

## ❓ Preguntas Frecuentes

### ¿Por qué no veo "Admin"?
- **Razón:** No estás iniciado sesión
- **Solución:** Haz clic en "Iniciar Sesión" primero

### ¿Es lo mismo que Firebase Console?
- **NO.** Son dos cosas diferentes:
  - **Panel Admin (tu página web):** Interfaz amigable, organizada, fácil de usar
  - **Firebase Console:** Interfaz técnica, datos en formato JSON

### ¿Puedo acceder sin iniciar sesión?
- **NO.** El panel requiere autenticación por seguridad

### ¿Qué pasa si escribo /admin sin estar logueado?
- Te redirigirá automáticamente a la página de login

---

## ✅ Verificación

Para verificar que estás en el lugar correcto:

1. ✅ Debes ver el título "Panel de Administración"
2. ✅ Debes ver filtros: "Todas", "Pendientes", "Completadas", "Canceladas"
3. ✅ Debes ver las órdenes listadas con datos del cliente y envío
4. ✅ La URL debe terminar en `/admin`

---

## 🎉 ¡Listo!

Una vez que veas el panel, podrás:
- Ver todos los pedidos
- Ver datos de identificación y envío
- Cambiar estados de pedidos
- Filtrar por estado
- Copiar datos para pasarlos a tu proveedor
