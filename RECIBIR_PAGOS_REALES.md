# 💰 Cómo Recibir Pagos Reales con Mercado Pago - Paso a Paso

Esta guía te explica cómo configurar tu tienda para que los clientes puedan pagar con tarjeta y recibas el dinero en tu cuenta de Mercado Pago.

## ✅ Paso 1: Verificar que Tienes tu Access Token Configurado

1. Abre el archivo: `src/services/mercadoPago.js`
2. Verifica que tengas tu Access Token configurado:
   ```javascript
   const MERCADO_PAGO_ACCESS_TOKEN = 'TEST-tu-token-aqui'
   ```
3. Si aún dice `'TU_ACCESS_TOKEN_AQUI'`, necesitas configurarlo primero (ver `GUIA_INTEGRAR_MERCADO_PAGO.md`)

## ✅ Paso 2: Cambiar a Credenciales de Producción

**IMPORTANTE**: Para recibir pagos REALES, necesitas usar credenciales de PRODUCCIÓN, no de prueba.

### 2.1 Obtener tu Access Token de Producción

1. Ve a: https://www.mercadopago.cl/developers
2. Inicia sesión con tu cuenta de Mercado Pago
3. Ve a **"Tus integraciones"** o **"Aplicaciones"**
4. Haz clic en tu aplicación (CubingMate)
5. Busca la sección **"Credenciales de producción"** (NO "Credenciales de prueba")
6. Haz clic en **"Revelar"** junto al **Access Token**
7. Copia el Access Token que comienza con **`APP_USR-`** (NO `TEST-`)

### 2.2 Configurar el Token de Producción en tu Código

1. Abre: `src/services/mercadoPago.js`
2. Reemplaza el Access Token:
   ```javascript
   // ANTES (modo de prueba):
   const MERCADO_PAGO_ACCESS_TOKEN = 'TEST-tu-token-de-prueba'
   
   // DESPUÉS (producción - pagos reales):
   const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-tu-token-de-produccion'
   ```
3. Guarda el archivo

⚠️ **ADVERTENCIA**: Una vez que cambies a producción, los pagos serán REALES y recibirás dinero real.

## ✅ Paso 3: Verificar tu Cuenta de Mercado Pago

Para recibir dinero, tu cuenta debe estar completa y verificada:

1. Ve a: https://www.mercadopago.cl
2. Inicia sesión
3. Verifica que tengas:
   - ✅ Email verificado
   - ✅ Teléfono verificado
   - ✅ Datos personales completos
   - ✅ Documento de identidad verificado (si es requerido)

## ✅ Paso 4: Probar con un Pago Pequeño Primero

**ANTES de recibir pagos de clientes reales**, prueba tú mismo:

1. **Agrega un producto** a tu carrito (precio bajo, ej: $1,000 CLP)
2. **Ve al checkout** y completa el formulario
3. **Haz clic en "Pagar"**
4. **Serás redirigido a Mercado Pago**
5. **Usa tu propia tarjeta** para hacer un pago de prueba
6. **Completa el pago**
7. **Verifica que recibiste el dinero** en tu cuenta de Mercado Pago

### Verificar que Recibiste el Pago

1. Ve a: https://www.mercadopago.cl
2. Haz clic en **"Actividad"** o **"Tu dinero"**
3. Deberías ver el pago que acabas de hacer
4. El dinero puede tardar unos minutos en aparecer

## ✅ Paso 5: Publicar tu Tienda

Una vez que hayas probado que todo funciona:

1. **Sube tu aplicación a un servidor** (Vercel, Netlify, Firebase Hosting, etc.)
2. **Asegúrate de que el Access Token de producción esté configurado** en el servidor
3. **Prueba el flujo completo** en la versión publicada
4. **Comparte el enlace** de tu tienda con tus clientes

## ✅ Paso 6: Los Clientes Pueden Pagar

Cuando un cliente visite tu tienda:

1. **Agrega productos** al carrito
2. **Va al checkout** y completa sus datos
3. **Selecciona "Tarjeta"** como método de pago
4. **Hace clic en "Pagar"**
5. **Es redirigido a Mercado Pago**
6. **Ingresa los datos de su tarjeta**:
   - Número de tarjeta
   - CVV
   - Fecha de vencimiento
   - Nombre del titular
7. **Completa el pago**
8. **Es redirigido de vuelta** a tu tienda:
   - `/checkout/success` si el pago fue exitoso
   - `/checkout/failure` si el pago falló
   - `/checkout/pending` si el pago está pendiente

## 💰 Paso 7: Recibir el Dinero

### ¿Cuándo Recibes el Dinero?

- **Tiempo de acreditación**: Generalmente 1-3 días hábiles
- **Puedes verlo antes** en "Actividad" como "Dinero en proceso"
- **Una vez acreditado**, aparecerá en "Tu dinero"

### ¿Dónde Ver los Pagos?

1. Ve a: https://www.mercadopago.cl
2. Haz clic en **"Actividad"**
3. Verás todos los pagos recibidos
4. Puedes filtrar por fecha, estado, etc.

### Comisiones de Mercado Pago

Mercado Pago cobra una comisión por cada transacción:
- **Chile**: Aproximadamente **3.49% + $990 CLP** por transacción
- Las comisiones se deducen automáticamente
- Ejemplo: Si vendes por $10,000 CLP, recibirás aproximadamente $9,641 CLP

## 🔒 Seguridad Importante

⚠️ **ADVERTENCIA**:

1. **NUNCA** compartas tu Access Token públicamente
2. **NO** subas tu código con el token a repositorios públicos (GitHub público)
3. **Usa variables de entorno** en producción (recomendado)
4. **Valida siempre los pagos** antes de enviar productos
5. **Usa HTTPS** en producción (obligatorio)

## 📋 Checklist Antes de Recibir Pagos Reales

- [ ] Access Token de producción configurado (`APP_USR-`)
- [ ] Cuenta de Mercado Pago verificada y completa
- [ ] Probé el flujo completo con un pago pequeño
- [ ] Verifiqué que recibí el dinero en mi cuenta
- [ ] Mi tienda está publicada y funcionando
- [ ] Las URLs de retorno funcionan correctamente
- [ ] Entiendo las comisiones de Mercado Pago

## 🆘 Solución de Problemas

### No Recibo el Dinero

1. Verifica que estés usando el Access Token de **producción** (`APP_USR-`)
2. Revisa "Actividad" en Mercado Pago (puede estar en proceso)
3. Verifica que tu cuenta esté completa y verificada
4. Contacta al soporte de Mercado Pago si el problema persiste

### Los Pagos No se Procesan

1. Verifica que el Access Token esté correcto
2. Revisa la consola del navegador (F12) por errores
3. Verifica que los datos del pedido sean correctos
4. Asegúrate de tener conexión a internet

### Error: "Invalid access token"

1. Verifica que copiaste el token completo
2. Asegúrate de usar el token de producción (`APP_USR-`)
3. Verifica que no haya espacios al inicio o final

## 📞 Contactar Soporte

Si tienes problemas:

1. Ve a: https://www.mercadopago.cl/ayuda
2. Busca tu problema o contacta al soporte
3. Explica que estás integrando pagos en tu tienda online

## ✅ Resumen Rápido

1. **Configura Access Token de producción** (`APP_USR-`)
2. **Verifica tu cuenta** de Mercado Pago
3. **Prueba con un pago pequeño** tú mismo
4. **Publica tu tienda**
5. **Los clientes pueden pagar** y recibirás el dinero en 1-3 días

---

**¡Listo!** Una vez que completes estos pasos, tu tienda estará lista para recibir pagos reales con tarjeta.
