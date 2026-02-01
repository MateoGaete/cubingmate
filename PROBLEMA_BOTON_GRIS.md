# 🔧 Problema: Botón de Pago en Gris en Mercado Pago

Si el botón de pagar está en gris y no funciona cuando ingresas los datos de tu tarjeta, aquí están las soluciones:

## 🔍 Causas Más Comunes

### 1. **Tarjeta de Prueba Incorrecta**
Si estás usando token `TEST-`, solo funcionan tarjetas de prueba específicas.

**Tarjeta que DEBE funcionar:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: `11/25` (cualquier fecha futura)
- Nombre: `APRO`

### 2. **Token de Producción con Tarjeta de Prueba**
Si tienes token `APP_USR-` (producción), NO puedes usar tarjetas de prueba.
- Necesitas usar una tarjeta REAL
- O cambiar a token `TEST-` para probar

### 3. **Datos Incompletos en Mercado Pago**
Aunque completes los datos en tu tienda, Mercado Pago puede pedir información adicional:
- Verifica que completes TODOS los campos que Mercado Pago pide
- Asegúrate de que el nombre del titular coincida con la tarjeta

### 4. **Problema con el Access Token**
El token puede tener permisos limitados o estar expirado.

## ✅ Soluciones Implementadas

He simplificado el código para:
1. ✅ Eliminar el teléfono (puede causar problemas)
2. ✅ Simplificar la configuración de la preferencia
3. ✅ Validar todos los datos antes de enviar
4. ✅ Mejorar los mensajes de error

## 🔧 Qué Hacer Ahora

### Paso 1: Verificar tu Token

1. Abre `src/services/mercadoPago.js`
2. Verifica la línea 9:
   - Si dice `TEST-` → Usa tarjeta de prueba: `5031 7557 3453 0604`
   - Si dice `APP_USR-` → Usa tarjeta REAL (no de prueba)

### Paso 2: Probar con Tarjeta Correcta

**Si tienes token TEST-:**
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/25
Nombre: APRO
```

**Si tienes token APP_USR-:**
- Debes usar tu tarjeta REAL
- No funcionará con tarjetas de prueba

### Paso 3: Verificar en la Consola

1. Abre la consola (F12)
2. Ve a "Network" (Red)
3. Intenta pagar
4. Busca la petición a `api.mercadopago.com`
5. Revisa la respuesta - debería tener `init_point`

### Paso 4: Verificar los Datos Enviados

En la consola deberías ver:
```
Datos de preferencia enviados a Mercado Pago: {...}
```

Verifica que:
- ✅ `items` tenga productos con precios > 0
- ✅ `payer.name` y `payer.email` estén presentes
- ✅ `back_urls` tengan URLs válidas

## 🆘 Si Nada Funciona

### Opción 1: Cambiar a Token de Prueba Temporalmente

1. Ve a: https://www.mercadopago.cl/developers
2. Obtén tu token de PRUEBA (`TEST-`)
3. Reemplázalo en `src/services/mercadoPago.js`
4. Prueba con la tarjeta de prueba: `5031 7557 3453 0604`

### Opción 2: Verificar tu Cuenta de Mercado Pago

1. Ve a: https://www.mercadopago.cl
2. Verifica que tu cuenta esté completa
3. Verifica que no haya restricciones en tu cuenta

### Opción 3: Contactar Soporte de Mercado Pago

1. Ve a: https://www.mercadopago.cl/ayuda
2. Explica que el botón de pago está deshabilitado
3. Menciona que estás usando Checkout Pro
4. Proporciona el ID de tu preferencia (si lo tienes)

## 💡 Consejos

1. **Usa Chrome o Edge** - Funcionan mejor con Mercado Pago
2. **Desactiva extensiones** - Pueden interferir
3. **Prueba en modo incógnito** - Para descartar problemas de caché
4. **Verifica tu conexión** - Debe ser estable

---

**Prueba ahora** con los cambios que hice. El código está más simple y debería funcionar mejor.
