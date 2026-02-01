# 🔧 Solución: No Puedo Pagar con Tarjeta en Mercado Pago

## 📌 Respuesta Rápida sobre el Token

**NO necesitas poner tokens en múltiples lugares.** Solo necesitas configurar el Access Token **UNA VEZ** en la línea 9 del archivo `src/services/mercadoPago.js`. Ese mismo token se usa automáticamente en todas las funciones.

## ❌ Problema: No me deja pagar con mi tarjeta

Si cuando llegas al paso de pagar con tu tarjeta no te deja completar el pago, puede ser por varias razones:

### 1. Token Inválido o Expirado

**Síntomas:**
- La página de pago no carga
- Aparece un error al intentar crear el pago
- El botón de pago está deshabilitado

**Solución:**
1. Ve a: https://www.mercadopago.cl/developers/panel/credentials
2. Inicia sesión con tu cuenta de Mercado Pago
3. Busca tu aplicación (CubingMate)
4. Si estás en **producción** (recibiendo pagos reales):
   - Ve a "Credenciales de producción"
   - Copia el Access Token que comienza con `APP_USR-`
5. Si estás en **pruebas**:
   - Ve a "Credenciales de prueba"
   - Copia el Access Token que comienza con `TEST-`
6. Abre el archivo: `src/services/mercadoPago.js`
7. Reemplaza el token en la **línea 9**:
   ```javascript
   const MERCADO_PAGO_ACCESS_TOKEN = 'TU_NUEVO_TOKEN_AQUI'
   ```
8. Guarda el archivo y prueba nuevamente

### 2. Cuenta de Mercado Pago No Verificada

**Síntomas:**
- Puedes crear la preferencia de pago
- Pero cuando intentas pagar, aparece un error o no te deja continuar

**Solución:**
1. Ve a: https://www.mercadopago.cl
2. Inicia sesión
3. Verifica que tu cuenta esté completa:
   - ✅ Email verificado
   - ✅ Teléfono verificado
   - ✅ Datos personales completos (nombre, apellido, RUT)
   - ✅ Dirección registrada
4. Si falta algo, complétalo y verifica tu identidad
5. Si usas token de producción (`APP_USR-`), asegúrate de haber completado el proceso de verificación de identidad

### 3. Restricciones en la Cuenta

**Síntomas:**
- El pago se crea correctamente
- Pero aparece un mensaje de "pago no disponible" o similar

**Solución:**
1. Ve a: https://www.mercadopago.cl
2. Revisa si hay notificaciones o alertas en tu cuenta
3. Verifica que no tengas restricciones de pago
4. Contacta al soporte de Mercado Pago si es necesario: https://www.mercadopago.cl/ayuda

### 4. Token de Prueba con Tarjeta Real

**Síntomas:**
- Estás usando un token que comienza con `TEST-`
- Intentas pagar con una tarjeta real
- El pago no funciona

**Solución:**
- Si usas token de prueba (`TEST-`), debes usar **tarjetas de prueba** de Mercado Pago:
  - Tarjeta aprobada: `5031 7557 3453 0604` (CVV: 123)
  - Tarjeta rechazada: `5031 4332 1540 6351` (CVV: 123)
- Si quieres usar tu tarjeta real, cambia a token de producción (`APP_USR-`)

### 5. Datos Incompletos en el Formulario

**Síntomas:**
- El formulario de checkout se completa
- Pero al crear el pago aparece un error

**Solución:**
Asegúrate de completar TODOS los campos:
- ✅ Nombre completo
- ✅ Apellido
- ✅ Email válido
- ✅ Teléfono (al menos 8 dígitos)
- ✅ Ciudad
- ✅ Comuna
- ✅ Calle
- ✅ Número de calle
- ✅ Código postal

## 🔍 Cómo Verificar que el Token Funciona

He agregado una función para verificar tu token. Puedes probarla en la consola del navegador:

1. Abre tu aplicación en el navegador
2. Abre la consola del desarrollador (F12)
3. Ejecuta:
   ```javascript
   import { verifyAccessToken } from './services/mercadoPago'
   verifyAccessToken()
   ```

Si el token es válido, verás un mensaje de éxito. Si no, verás el error específico.

## 📝 Checklist de Verificación

Antes de intentar pagar nuevamente, verifica:

- [ ] Token configurado en `src/services/mercadoPago.js` línea 9
- [ ] Token comienza con `APP_USR-` (producción) o `TEST-` (prueba)
- [ ] Token no está expirado (obtén uno nuevo si es necesario)
- [ ] Cuenta de Mercado Pago completamente verificada
- [ ] Email verificado en Mercado Pago
- [ ] Teléfono verificado en Mercado Pago
- [ ] Datos personales completos en Mercado Pago
- [ ] Si usas token de prueba, usas tarjetas de prueba
- [ ] Todos los campos del formulario de checkout están completos

## 🆘 Si Nada Funciona

1. **Revisa la consola del navegador** (F12) para ver errores específicos
2. **Revisa los logs** en la consola cuando intentas crear el pago
3. **Verifica tu cuenta** en: https://www.mercadopago.cl
4. **Contacta al soporte** de Mercado Pago: https://www.mercadopago.cl/ayuda

## 📞 Recursos Útiles

- Panel de desarrolladores: https://www.mercadopago.cl/developers
- Credenciales: https://www.mercadopago.cl/developers/panel/credentials
- Soporte: https://www.mercadopago.cl/ayuda
- Documentación: https://www.mercadopago.cl/developers/es/docs
