# 💳 Guía de Configuración de Mercado Pago

Esta guía te ayudará a integrar Mercado Pago en tu tienda de cubos de Rubik.

## Paso 1: Crear Cuenta en Mercado Pago

1. Ve a [https://www.mercadopago.cl](https://www.mercadopago.cl)
2. Haz clic en **"Crear cuenta"** o **"Registrarse"**
3. Completa el formulario con tus datos
4. Verifica tu email y teléfono

## Paso 2: Acceder al Panel de Desarrolladores

1. Ve a [https://www.mercadopago.cl/developers](https://www.mercadopago.cl/developers)
2. Inicia sesión con tu cuenta de Mercado Pago
3. Si es tu primera vez, acepta los términos y condiciones

## Paso 3: Crear una Aplicación

1. En el panel de desarrolladores, haz clic en **"Tus integraciones"** o **"Aplicaciones"**
2. Haz clic en **"Crear nueva aplicación"** o **"Nueva aplicación"**
3. **Selecciona la plataforma**:
   - Busca y selecciona **"Web"** o **"Website"** o **"Aplicación web"**
   - Si no ves "Web", busca opciones como:
     - **"Otro"** o **"Other"**
     - **"API"** o **"REST API"**
     - **"Checkout Pro"**
   - ⚠️ **IMPORTANTE**: NO selecciones "Android" ni "iOS" (esas son para apps móviles)
4. Completa el formulario:
   - **Nombre**: `CubingMate`
   - **Descripción**: `Tienda online de cubos de Rubik`
   - **Categoría**: Selecciona la más apropiada (ej: "E-commerce" o "Retail")
5. Haz clic en **"Crear aplicación"** o **"Crear"**

## Paso 4: Obtener Credenciales

### Para Desarrollo (Modo de Prueba)

1. En la página de tu aplicación, ve a **"Credenciales de prueba"**
2. Verás dos credenciales:
   - **Public Key** (comienza con `TEST-`) ← **NO COPIES ESTE**
   - **Access Token** (también comienza con `TEST-`) ← **COPIA ESTE**
3. **COPIA el Access Token** (Token de acceso):
   - Busca donde dice **"Access Token"** o **"Token de acceso"**
   - Haz clic en el botón **"Copiar"** o **"Revelar"** junto al Access Token
   - ⚠️ **IMPORTANTE**: 
     - El Access Token es una cadena larga que comienza con `TEST-`
     - NO copies el Public Key (aunque también empiece con TEST-)
     - El Access Token es el que necesitas para la integración
     - Este token solo funciona en modo de prueba

### Para Producción

1. En la página de tu aplicación, ve a **"Credenciales de producción"**
2. Copia tu **Access Token** (Token de acceso)
   - Este token comienza con `APP_USR-`
   - ⚠️ **IMPORTANTE**: Este token procesa pagos reales

## Paso 5: Configurar en tu Proyecto

1. Abre el archivo `src/services/mercadoPago.js`
2. Reemplaza `TU_ACCESS_TOKEN_AQUI` con tu Access Token:

```javascript
// Para desarrollo (modo de prueba)
const MERCADO_PAGO_ACCESS_TOKEN = 'TEST-tu-token-de-prueba-aqui'

// Para producción
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-tu-token-de-produccion-aqui'
```

## Paso 6: Probar Pagos en Modo de Prueba

Mercado Pago proporciona tarjetas de prueba para simular pagos:

### Tarjeta Aprobada
- **Número**: `5031 7557 3453 0604`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura (ej: 11/25)
- **Nombre del titular**: `APRO`

### Tarjeta Rechazada
- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura
- **Nombre del titular**: `OTHE`

### Tarjeta Pendiente
- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura
- **Nombre del titular**: `CONT`

## Paso 7: Configurar URLs de Retorno

### ✅ **NO NECESITAS HACER NADA - YA ESTÁ CONFIGURADO**

Las URLs de retorno **ya están configuradas** en tu código. Esto significa que cuando un cliente termine de pagar en Mercado Pago, será redirigido automáticamente a tu tienda.

**¿Qué son las URLs de retorno?**
- Son las páginas a las que Mercado Pago envía al cliente después de pagar
- Ya están configuradas en `src/services/mercadoPago.js`:
  - ✅ **Pago exitoso** → `/checkout/success` (ya existe)
  - ❌ **Pago fallido** → `/checkout/failure` (ya existe)
  - ⏳ **Pago pendiente** → `/checkout/pending` (ya existe)

**¿Qué debes hacer?**
- **NADA** - Las páginas ya están creadas y funcionando
- Solo asegúrate de que tu aplicación esté corriendo cuando pruebes los pagos

**Ejemplo de cómo funciona:**
1. Cliente paga en Mercado Pago
2. Mercado Pago procesa el pago
3. Cliente es redirigido automáticamente a:
   - `/checkout/success` si el pago fue exitoso
   - `/checkout/failure` si el pago falló
   - `/checkout/pending` si el pago está pendiente

## Paso 8: (Opcional) Configurar Webhooks

Los webhooks permiten recibir notificaciones cuando cambia el estado de un pago.

### Configurar Webhook en Mercado Pago

1. En el panel de tu aplicación, ve a **"Webhooks"**
2. Agrega una URL de webhook:
   - Para desarrollo local: Usa [ngrok](https://ngrok.com/) para exponer tu servidor
   - Para producción: Usa la URL de tu servidor
   - Ejemplo: `https://tu-dominio.com/api/webhook/mercadopago`

### Implementar Webhook en tu Aplicación

Necesitarás un backend para recibir las notificaciones. Ejemplo con Node.js:

```javascript
// server.js (ejemplo)
app.post('/api/webhook/mercadopago', async (req, res) => {
  const { type, data } = req.body
  
  if (type === 'payment') {
    const paymentId = data.id
    // Verificar estado del pago y actualizar orden en Firebase
    const payment = await getPaymentStatus(paymentId)
    
    if (payment.status === 'approved') {
      // Actualizar orden en Firebase
      await updateOrderStatus(payment.external_reference, 'paid')
    }
  }
  
  res.status(200).send('OK')
})
```

## Flujo de Pago Completo

1. **Cliente completa el formulario de checkout**
2. **Se crea una orden en Firebase** con estado `pending`
3. **Se crea una preferencia de pago en Mercado Pago**
4. **Cliente es redirigido a Mercado Pago** para pagar
5. **Cliente completa el pago**
6. **Mercado Pago redirige al cliente** a tu sitio
7. **Webhook notifica** el cambio de estado (si está configurado)
8. **Actualizas el estado de la orden** en Firebase

## Estados de Pago

- `pending`: Pago pendiente
- `approved`: Pago aprobado
- `rejected`: Pago rechazado
- `cancelled`: Pago cancelado
- `refunded`: Pago reembolsado

## Comisiones de Mercado Pago

Mercado Pago cobra una comisión por cada transacción:
- **Chile**: Aproximadamente 3.49% + $990 CLP por transacción
- Las comisiones se deducen automáticamente del monto recibido

## Seguridad

⚠️ **IMPORTANTE**:
- **NUNCA** expongas tu Access Token en el código del frontend en producción
- Para producción, usa un backend que maneje las llamadas a la API de Mercado Pago
- Valida siempre los pagos en el backend antes de confirmar órdenes
- Usa HTTPS en producción

## Solución de Problemas

### Error: "Invalid access token"
- Verifica que hayas copiado el token completo
- Asegúrate de usar el token correcto (prueba vs producción)

### Error: "Invalid preference"
- Verifica que los datos del pedido sean correctos
- Asegúrate de que los precios sean números válidos

### El pago no se procesa
- Verifica que estés usando el token correcto
- Revisa la consola del navegador para ver errores
- Verifica que las URLs de retorno sean accesibles

## Recursos Adicionales

- [Documentación de Mercado Pago](https://www.mercadopago.cl/developers/es/docs)
- [API Reference](https://www.mercadopago.cl/developers/es/reference)
- [Checkout Pro](https://www.mercadopago.cl/developers/es/docs/checkout-pro/landing)

## Próximos Pasos

1. Prueba el flujo completo con tarjetas de prueba
2. Configura webhooks para recibir notificaciones
3. Implementa páginas de éxito/fallo para el checkout
4. Cuando estés listo, cambia a credenciales de producción

---

¿Necesitas ayuda? Contacta al [soporte de Mercado Pago](https://www.mercadopago.cl/developers/es/support)
