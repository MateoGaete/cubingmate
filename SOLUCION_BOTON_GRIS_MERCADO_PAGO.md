# 🔧 Solución: Botón de Pago en Gris en Mercado Pago

Si cuando ingresas los datos de tu tarjeta en Mercado Pago, el botón de pagar está en gris y no funciona, aquí están las soluciones:

## 🔍 Causas Comunes

### 1. Datos Incompletos en el Formulario
Mercado Pago requiere ciertos datos para habilitar el botón de pago.

**Verifica que hayas completado:**
- ✅ Nombre completo del titular de la tarjeta
- ✅ Número de tarjeta (16 dígitos)
- ✅ CVV (3 dígitos)
- ✅ Fecha de vencimiento
- ✅ Email (si lo pide)

### 2. Tarjeta de Prueba Incorrecta
Si estás usando tarjetas de prueba, asegúrate de usar las correctas:

**Tarjeta APROBADA (debe funcionar):**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura (ej: `11/25`)
- Nombre: `APRO`

### 3. Token de Prueba vs Producción
- Si usas token `TEST-`, solo funcionan tarjetas de prueba
- Si usas token `APP_USR-`, funcionan tarjetas reales

### 4. Datos del Payer Incorrectos
El problema puede estar en cómo se envían los datos del cliente.

## ✅ Soluciones Implementadas

He mejorado el código para:

1. **Formato correcto del teléfono**: Ahora se formatea correctamente para Chile
2. **Validación de datos**: Se valida que nombre y email estén presentes
3. **Limpieza de campos**: Se eliminan campos undefined que pueden causar problemas
4. **Mejor manejo de errores**: Mensajes más claros

## 🔧 Qué Hacer Ahora

### Paso 1: Verificar tus Datos en el Checkout

Antes de ir a Mercado Pago, asegúrate de completar:
- ✅ Nombre completo
- ✅ Apellido completo
- ✅ Email válido
- ✅ Teléfono (9 dígitos)

### Paso 2: Usar Tarjeta de Prueba Correcta

Si estás probando:
1. Usa la tarjeta: `5031 7557 3453 0604`
2. CVV: `123`
3. Fecha: `11/25` (o cualquier fecha futura)
4. Nombre: `APRO`

### Paso 3: Verificar el Access Token

1. Abre `src/services/mercadoPago.js`
2. Verifica que el Access Token esté configurado
3. Si estás probando, usa token `TEST-`
4. Si quieres recibir pagos reales, usa token `APP_USR-`

### Paso 4: Recargar y Probar

1. Recarga la página (F5)
2. Completa el checkout nuevamente
3. Intenta pagar con la tarjeta de prueba
4. El botón debería estar habilitado

## 🆘 Si el Problema Persiste

### Verificar en la Consola

1. Abre la consola (F12)
2. Ve a la pestaña "Network" (Red)
3. Intenta hacer el pago
4. Busca la petición a `api.mercadopago.com`
5. Revisa si hay errores en la respuesta

### Verificar los Datos Enviados

En la consola deberías ver:
```
Datos de preferencia enviados a Mercado Pago: {...}
```

Revisa que:
- ✅ `items` tenga productos con precios válidos
- ✅ `payer.name` y `payer.email` estén presentes
- ✅ `back_urls` tengan URLs válidas

## 💡 Consejos Adicionales

1. **Usa Chrome o Edge** para mejores resultados
2. **Desactiva bloqueadores de anuncios** temporalmente
3. **Prueba en modo incógnito** para descartar extensiones
4. **Verifica tu conexión a internet**

## 📞 Contactar Soporte de Mercado Pago

Si nada funciona:
1. Ve a: https://www.mercadopago.cl/ayuda
2. Explica que el botón de pago está deshabilitado
3. Menciona que estás usando Checkout Pro
4. Proporciona el ID de tu preferencia (si lo tienes)

---

**Prueba ahora** con los cambios que hice. El código ahora maneja mejor el formato del teléfono y valida los datos antes de enviarlos.
