# 🚨 SOLUCIÓN: No Puedo Pagar

Si al hacer clic en "Pagar con Mercado Pago" no pasa nada o aparece un error, sigue estos pasos:

## 🔍 Paso 1: Abrir la Consola del Navegador

1. **Presiona F12** en tu teclado (o clic derecho → "Inspeccionar")
2. Ve a la pestaña **"Console"** (Consola)
3. **Intenta hacer el pago** nuevamente
4. **Busca mensajes en ROJO** - esos son los errores
5. **Copia el mensaje completo** que aparece en rojo

## 🔍 Paso 2: Verificar el Access Token de Mercado Pago

1. Abre el archivo: `src/services/mercadoPago.js`
2. Ve a la **línea 9**
3. Verifica que el token:
   - ✅ NO esté vacío `''`
   - ✅ NO diga `'TU_ACCESS_TOKEN_AQUI'`
   - ✅ Comience con `APP_USR-` (producción) o `TEST-` (prueba)
   - ✅ No tenga espacios al inicio o final

**Ejemplo correcto:**
```javascript
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-4499431422783159-012519-...'
```

**Ejemplo incorrecto:**
```javascript
const MERCADO_PAGO_ACCESS_TOKEN = ''  // ❌ Vacío
const MERCADO_PAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI'  // ❌ Placeholder
```

## 🔍 Paso 3: Verificar que Todos los Campos Estén Completos

Antes de hacer clic en "Pagar", asegúrate de haber completado:

### ✅ Paso 1: Identificación
- [ ] Nombre
- [ ] Apellido
- [ ] Email (formato válido: usuario@email.com)
- [ ] Ciudad
- [ ] Teléfono (9 dígitos, sin espacios)

### ✅ Paso 2: Envío
- [ ] Comuna seleccionada
- [ ] Calle
- [ ] Número (o marcado "Calle sin número")
- [ ] Tipo de vivienda seleccionado
- [ ] Código postal (7 dígitos)

### ✅ Paso 3: Pago
- [ ] Método de pago seleccionado (Tarjeta)

## 🔍 Paso 4: Errores Comunes y Soluciones

### ❌ Error: "Access Token inválido" o "401"
**Solución:**
1. Ve a: https://www.mercadopago.cl/developers/panel/credentials
2. Copia tu **Access Token** (debe comenzar con `APP_USR-` o `TEST-`)
3. Pégalo en `src/services/mercadoPago.js` línea 9
4. Guarda el archivo
5. Recarga la página (F5)

### ❌ Error: "Datos inválidos" o "400"
**Solución:**
- Verifica que todos los campos estén completos
- Asegúrate de que el email tenga formato válido (usuario@email.com)
- Verifica que el nombre tenga al menos 2 caracteres
- Asegúrate de que los precios sean números válidos

### ❌ Error: "No hay productos en el carrito"
**Solución:**
- Agrega productos al carrito antes de ir al checkout
- Verifica que el carrito no esté vacío

### ❌ Error: "No se pudo conectar con Mercado Pago"
**Solución:**
- Verifica tu conexión a internet
- Intenta nuevamente después de unos segundos
- Verifica que no haya bloqueadores de anuncios activos

### ❌ El botón está deshabilitado (gris)
**Solución:**
- Espera a que termine de procesar (no hagas clic múltiples veces)
- Si está atascado, recarga la página (F5)
- Verifica la consola (F12) para ver si hay errores

## 🔍 Paso 5: Verificar en la Pestaña "Network" (Red)

1. Abre la consola (F12)
2. Ve a la pestaña **"Network"** (Red)
3. Intenta hacer el pago
4. Busca una petición a `api.mercadopago.com`
5. Haz clic en ella y revisa:
   - **Status**: Debe ser 200 o 201 (éxito)
   - **Response**: Debe tener `init_point` con una URL
   - Si hay error, revisa el mensaje en "Response"

## 🔍 Paso 6: Verificar los Logs en la Consola

Cuando intentes pagar, deberías ver estos mensajes en la consola:

```
🚀 Iniciando proceso de pago...
📦 Datos de la orden preparados: {...}
🔥 Creando orden en Firebase...
✅ Orden creada en Firebase con ID: abc123
💳 Creando preferencia de pago en Mercado Pago...
=== DATOS ENVIADOS A MERCADO PAGO ===
✅ Preferencia creada exitosamente
URL de pago: https://www.mercadopago.cl/checkout/v1/redirect...
```

Si ves un error en alguno de estos pasos, ese es el problema.

## 📋 Checklist de Verificación Rápida

- [ ] Access Token configurado correctamente (línea 9 de mercadoPago.js)
- [ ] Token comienza con `APP_USR-` o `TEST-`
- [ ] Todos los campos del formulario completos
- [ ] Hay productos en el carrito
- [ ] Conexión a internet activa
- [ ] Consola del navegador abierta (F12)
- [ ] No hay bloqueadores de anuncios activos
- [ ] El botón no está deshabilitado (gris)

## 🆘 Si Nada Funciona

1. **Copia el error completo** de la consola (F12 → Console)
2. **Toma una captura de pantalla** del error
3. **Verifica estos archivos:**
   - `src/services/mercadoPago.js` (línea 9 - Access Token)
   - `src/pages/Checkout.jsx` (función handleSubmit)
4. **Comparte conmigo:**
   - El error completo de la consola
   - Qué paso del checkout estás completando
   - Qué datos has ingresado

## 💡 Mejoras Implementadas

He mejorado el código para que:
- ✅ Muestre mensajes de error más específicos y claros
- ✅ Valide los datos antes de enviarlos
- ✅ Muestre logs detallados en la consola para diagnosticar problemas
- ✅ Verifique el formato del Access Token
- ✅ Maneje mejor los errores de red

---

**Prueba nuevamente** y revisa la consola (F12) para ver el error específico. Con esa información podremos solucionarlo más rápido.
