# 🔧 Solución: Error al Pagar con Mercado Pago

Si al hacer clic en "Pagar con Mercado Pago" te sale un error y no te redirige, sigue estos pasos:

## 🔍 Paso 1: Abrir la Consola del Navegador

1. Presiona **F12** en tu teclado (o clic derecho → "Inspeccionar")
2. Ve a la pestaña **"Console"** (Consola)
3. Intenta hacer el pago nuevamente
4. **Copia el error completo** que aparece en rojo

## 🔍 Paso 2: Verificar el Access Token

1. Abre: `src/services/mercadoPago.js`
2. Verifica la línea 7:
   ```javascript
   const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-tu-token-aqui'
   ```
3. Asegúrate de que:
   - ✅ NO diga `'TU_ACCESS_TOKEN_AQUI'`
   - ✅ NO esté vacío `''`
   - ✅ Comience con `APP_USR-` (producción) o `TEST-` (prueba)
   - ✅ No tenga espacios al inicio o final

## 🔍 Paso 3: Verificar que Todos los Campos Estén Completos

Antes de hacer clic en "Pagar", asegúrate de haber completado:

### Paso 1: Identificación
- [ ] Nombre
- [ ] Apellido
- [ ] Email (formato válido: usuario@email.com)
- [ ] Ciudad
- [ ] Teléfono (9 dígitos)

### Paso 2: Envío
- [ ] Comuna seleccionada
- [ ] Calle
- [ ] Número (o marcado "Calle sin número")
- [ ] Tipo de vivienda seleccionado

### Paso 3: Pago
- [ ] Método de pago seleccionado (Tarjeta)

## 🔍 Paso 4: Errores Comunes y Soluciones

### Error: "Access Token inválido" o "401"
**Solución:**
- Verifica que tu Access Token esté correcto
- Asegúrate de usar el token de producción (`APP_USR-`) si quieres recibir pagos reales
- O usa el token de prueba (`TEST-`) para probar

### Error: "Datos inválidos" o "400"
**Solución:**
- Verifica que todos los campos estén completos
- Asegúrate de que los precios sean números válidos
- Verifica que el email tenga formato correcto

### Error: "No hay productos en el carrito"
**Solución:**
- Agrega productos al carrito antes de ir al checkout
- Verifica que el carrito no esté vacío

### Error: "Faltan datos del cliente"
**Solución:**
- Completa todos los campos del Paso 1 (Identificación)
- Asegúrate de que el nombre y email estén completos

### Error: "Error al conectar con Mercado Pago"
**Solución:**
- Verifica tu conexión a internet
- Intenta nuevamente después de unos segundos
- Verifica que no haya bloqueadores de anuncios activos

## 🔍 Paso 5: Probar con Token de Prueba

Si el problema persiste, prueba con un token de prueba primero:

1. Ve a: https://www.mercadopago.cl/developers
2. Obtén tu **Access Token de prueba** (comienza con `TEST-`)
3. Reemplázalo en `src/services/mercadoPago.js`
4. Prueba el pago con una tarjeta de prueba:
   - Número: `5031 7557 3453 0604`
   - CVV: `123`
   - Nombre: `APRO`

## 🔍 Paso 6: Verificar en la Red

1. Abre la consola (F12)
2. Ve a la pestaña **"Network"** (Red)
3. Intenta hacer el pago
4. Busca una petición a `api.mercadopago.com`
5. Haz clic en ella y revisa:
   - **Status**: Debe ser 200 o 201 (éxito)
   - **Response**: Debe tener `init_point` con una URL
   - Si hay error, revisa el mensaje

## 📋 Checklist de Verificación

- [ ] Access Token configurado correctamente
- [ ] Todos los campos del formulario completos
- [ ] Hay productos en el carrito
- [ ] Conexión a internet activa
- [ ] Consola del navegador abierta para ver errores
- [ ] No hay bloqueadores de anuncios activos

## 🆘 Si Nada Funciona

1. **Copia el error completo** de la consola
2. **Toma una captura de pantalla** del error
3. Verifica:
   - ¿Qué error exacto aparece?
   - ¿En qué paso del checkout ocurre?
   - ¿Qué datos has ingresado?

4. Revisa estos archivos:
   - `src/services/mercadoPago.js` (línea 7 - Access Token)
   - `src/pages/Checkout.jsx` (función handleSubmit)

## 💡 Mejoras Implementadas

He mejorado el código para que:
- ✅ Muestre mensajes de error más específicos
- ✅ Valide los datos antes de enviarlos
- ✅ Muestre el error completo en el alert
- ✅ Registre errores detallados en la consola

---

**Prueba nuevamente** y revisa la consola (F12) para ver el error específico. Con esa información podremos solucionarlo más rápido.
