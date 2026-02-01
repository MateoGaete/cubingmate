# 💳 Guía Práctica: Integrar Mercado Pago en CubingMate

Esta guía te ayudará a configurar Mercado Pago paso a paso para que puedas recibir pagos con tarjeta en tu tienda.

## ✅ Paso 1: Obtener tu Access Token de Mercado Pago

### 1.1 Acceder al Panel de Desarrolladores

**IMPORTANTE**: El panel de desarrolladores es diferente al panel principal de Mercado Pago.

**Opción 1: URL Directa (Más fácil)**
1. Abre una nueva pestaña en tu navegador
2. Ve directamente a: **https://www.mercadopago.cl/developers**
3. Si no estás logueado, te pedirá iniciar sesión
4. Si es tu primera vez, acepta los términos y condiciones del panel de desarrolladores

**Opción 2: Desde el Menú Principal**
1. En el panel principal de Mercado Pago (donde ves "Tu dinero", "Actividad", etc.)
2. Busca en la parte inferior de la página un enlace que diga **"Developers"** o **"Desarrolladores"**
3. O busca en el menú de usuario (tu foto/avatar) la opción **"Developers"**

**Opción 3: Buscar en Google**
1. Busca en Google: "Mercado Pago Developers Chile"
2. Haz clic en el primer resultado que sea de mercadopago.cl/developers

**Si aún no encuentras el panel de desarrolladores:**
- Asegúrate de estar en la versión de Chile: `mercadopago.cl` (no .com, .com.ar, etc.)
- Intenta esta URL exacta: `https://www.mercadopago.cl/developers/panel/app`

### 1.2 Crear una Aplicación (si no tienes una)

Una vez que estés en el panel de desarrolladores (deberías ver un menú diferente al panel principal):

1. Busca y haz clic en **"Tus integraciones"** o **"Aplicaciones"** o **"Mis aplicaciones"**
   - Si es tu primera vez, puede que veas un botón grande que diga **"Crear tu primera aplicación"**
   
2. Si ya tienes aplicaciones, busca el botón **"Crear nueva aplicación"** o **"Nueva aplicación"**

3. Completa el formulario:
   - **Nombre**: `CubingMate`
   - **Descripción**: `Tienda online de cubos de Rubik`
   - **Categoría**: Selecciona "E-commerce" o "Retail" o "Venta online"
   
4. Haz clic en **"Crear aplicación"** o **"Crear"**

**Si no ves estas opciones:**
- Verifica que estés en: `https://www.mercadopago.cl/developers`
- Intenta refrescar la página (F5)
- Asegúrate de estar logueado con tu cuenta de Mercado Pago

### 1.3 Obtener tu Access Token

**Para PRUEBAS (Recomendado empezar aquí):**

1. En la página de tu aplicación, busca la sección **"Credenciales de prueba"**
2. Copia tu **Access Token** (Token de acceso)
   - Debe comenzar con `TEST-`
   - Ejemplo: `TEST-1234567890-abcdef-123456-abcdef123456-123456`
   - ⚠️ Este token solo funciona en modo de prueba, no procesa pagos reales

**Para PRODUCCIÓN (Cuando estés listo para recibir pagos reales):**

1. En la página de tu aplicación, busca la sección **"Credenciales de producción"**
2. Copia tu **Access Token** (Token de acceso)
   - Debe comenzar con `APP_USR-`
   - ⚠️ Este token procesa pagos REALES con dinero real

---

## ✅ Paso 2: Configurar el Access Token en tu Código

1. Abre el archivo: `src/services/mercadoPago.js`

2. Encuentra esta línea (línea 7):
   ```javascript
   const MERCADO_PAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI'
   ```

3. Reemplaza `'TU_ACCESS_TOKEN_AQUI'` con tu Access Token:

   **Para pruebas:**
   ```javascript
   const MERCADO_PAGO_ACCESS_TOKEN = 'TEST-tu-token-de-prueba-aqui'
   ```

   **Para producción:**
   ```javascript
   const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-tu-token-de-produccion-aqui'
   ```

4. Guarda el archivo

---

## ✅ Paso 3: Probar el Sistema de Pagos

### 3.1 Usar Tarjetas de Prueba

Mercado Pago proporciona tarjetas especiales para probar pagos sin usar dinero real:

#### ✅ Tarjeta APROBADA (Pago exitoso)
- **Número**: `5031 7557 3453 0604`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura (ej: `11/25`)
- **Nombre del titular**: `APRO`
- **Resultado**: El pago se aprobará exitosamente

#### ❌ Tarjeta RECHAZADA (Pago fallido)
- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura
- **Nombre del titular**: `OTHE`
- **Resultado**: El pago será rechazado

#### ⏳ Tarjeta PENDIENTE (Pago en proceso)
- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura
- **Nombre del titular**: `CONT`
- **Resultado**: El pago quedará pendiente

### 3.2 Probar el Flujo Completo

1. **Agrega productos al carrito** en tu tienda
2. **Ve al carrito** y haz clic en "Finalizar Compra"
3. **Completa el formulario de checkout**:
   - Datos personales
   - Dirección de envío
   - Método de pago: selecciona "Tarjeta"
4. **Haz clic en "Pagar"**
5. **Serás redirigido a Mercado Pago**
6. **Usa una tarjeta de prueba** (ver arriba)
7. **Completa el pago**
8. **Serás redirigido de vuelta** a tu tienda:
   - ✅ Si usaste la tarjeta APRO → `/checkout/success`
   - ❌ Si usaste la tarjeta OTHE → `/checkout/failure`
   - ⏳ Si usaste la tarjeta CONT → `/checkout/pending`

---

## ✅ Paso 4: Verificar que Todo Funcione

### Checklist de Verificación:

- [ ] Access Token configurado en `src/services/mercadoPago.js`
- [ ] Puedes agregar productos al carrito
- [ ] Puedes completar el formulario de checkout
- [ ] Al hacer clic en "Pagar", te redirige a Mercado Pago
- [ ] Puedes usar una tarjeta de prueba
- [ ] Después del pago, te redirige de vuelta a tu tienda
- [ ] La orden se crea en Firebase (puedes verla en `/admin`)

---

## 🔍 Solución de Problemas

### Error: "Mercado Pago no está configurado"
**Solución**: Verifica que hayas reemplazado `'TU_ACCESS_TOKEN_AQUI'` con tu token real en `src/services/mercadoPago.js`

### Error: "Invalid access token"
**Solución**: 
- Verifica que copiaste el token completo (sin espacios al inicio o final)
- Asegúrate de usar el token correcto (TEST- para pruebas, APP_USR- para producción)
- Verifica que el token no haya expirado en el panel de Mercado Pago

### Error: "Error al crear preferencia de pago"
**Solución**:
- Abre la consola del navegador (F12) y revisa el error completo
- Verifica que los datos del pedido sean correctos (precios, cantidades)
- Asegúrate de tener conexión a internet

### El pago no redirige de vuelta
**Solución**:
- Verifica que las URLs de retorno sean correctas en `src/services/mercadoPago.js`
- Asegúrate de que las rutas `/checkout/success`, `/checkout/failure` y `/checkout/pending` existan en tu aplicación

### No puedo ver las órdenes en el admin
**Solución**:
- Verifica que estés iniciado sesión como administrador
- Ve a `/admin` y verifica que las órdenes aparezcan
- Revisa la consola del navegador por errores

---

## 📋 Estructura del Flujo de Pago

```
1. Cliente agrega productos al carrito
   ↓
2. Cliente va a checkout y completa formulario
   ↓
3. Se crea orden en Firebase (estado: "pending")
   ↓
4. Se crea preferencia de pago en Mercado Pago
   ↓
5. Cliente es redirigido a Mercado Pago
   ↓
6. Cliente completa el pago con tarjeta
   ↓
7. Mercado Pago procesa el pago
   ↓
8. Cliente es redirigido de vuelta:
   - ✅ /checkout/success (pago aprobado)
   - ❌ /checkout/failure (pago rechazado)
   - ⏳ /checkout/pending (pago pendiente)
```

---

## 💰 Comisiones de Mercado Pago

Mercado Pago cobra una comisión por cada transacción:

- **Chile**: Aproximadamente **3.49% + $990 CLP** por transacción
- Las comisiones se deducen automáticamente del monto recibido
- Ejemplo: Si vendes un producto por $10,000 CLP, recibirás aproximadamente $9,641 CLP

---

## 🔒 Seguridad Importante

⚠️ **ADVERTENCIA DE SEGURIDAD**:

- **NUNCA** compartas tu Access Token públicamente
- **NUNCA** subas tu Access Token a repositorios públicos (GitHub, etc.)
- Para producción, considera usar variables de entorno
- **NO** uses el token de producción en desarrollo
- Siempre valida los pagos en el backend antes de confirmar órdenes

---

## 🚀 Cuando Estés Listo para Producción

1. **Cambia a credenciales de producción**:
   - Obtén tu Access Token de producción (comienza con `APP_USR-`)
   - Reemplázalo en `src/services/mercadoPago.js`

2. **Prueba con un pago pequeño primero**:
   - Haz una compra de prueba con un monto pequeño
   - Verifica que recibas el dinero en tu cuenta de Mercado Pago

3. **Configura webhooks** (opcional pero recomendado):
   - Permite recibir notificaciones automáticas cuando cambia el estado de un pago
   - Necesitarás un backend para esto

---

## 📞 Recursos Adicionales

- [Documentación de Mercado Pago](https://www.mercadopago.cl/developers/es/docs)
- [Panel de Desarrolladores](https://www.mercadopago.cl/developers)
- [Soporte de Mercado Pago](https://www.mercadopago.cl/developers/es/support)

---

## ✅ Listo!

Una vez que hayas completado estos pasos, tu tienda estará lista para recibir pagos con tarjeta a través de Mercado Pago.

**Próximos pasos sugeridos:**
1. Prueba el flujo completo con tarjetas de prueba
2. Verifica que las órdenes se creen correctamente en Firebase
3. Cuando estés listo, cambia a credenciales de producción
4. Configura webhooks para recibir notificaciones automáticas
