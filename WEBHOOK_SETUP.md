# 🔔 Configuración de Webhook de Mercado Pago

Este documento explica cómo configurar el webhook para recibir notificaciones automáticas de Mercado Pago cuando cambia el estado de un pago.

## 📋 ¿Qué es un Webhook?

Un webhook es un método que permite a Mercado Pago enviar notificaciones en **tiempo real** a tu servidor cuando ocurre un evento relacionado con tus pagos (creación, aprobación, rechazo, etc.).

**Ventajas:**
- ✅ Notificaciones automáticas sin necesidad de consultar constantemente
- ✅ Actualización inmediata del estado de las órdenes
- ✅ Mejor experiencia para el usuario y el administrador

## 🚀 Configuración Paso a Paso

### Paso 1: Iniciar el Servidor Webhook

El servidor webhook ya está configurado en `server/webhook.js`. Para iniciarlo:

```bash
# Solo el servidor webhook
npm run webhook

# O iniciar tanto el frontend como el webhook simultáneamente
npm run dev:all
```

El servidor se iniciará en `http://localhost:3001` por defecto.

### Paso 2: Exponer el Servidor Localmente (Desarrollo)

Para desarrollo local, necesitas exponer tu servidor a internet. Mercado Pago necesita poder acceder a tu endpoint.

#### Opción A: Usar ngrok (Recomendado para desarrollo)

1. **Instala ngrok**: https://ngrok.com/download
2. **Inicia tu servidor webhook**:
   ```bash
   npm run webhook
   ```
3. **En otra terminal, expone el puerto**:
   ```bash
   ngrok http 3001
   ```
4. **Copia la URL HTTPS** que ngrok te proporciona (ej: `https://abc123.ngrok.io`)

#### Opción B: Usar un servicio de túnel alternativo

- **LocalTunnel**: `npx localtunnel --port 3001`
- **Cloudflare Tunnel**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

### Paso 3: Configurar el Webhook en Mercado Pago

1. **Accede al Panel de Desarrolladores**:
   - Ve a: https://www.mercadopago.cl/developers/panel
   - Inicia sesión con tu cuenta de Mercado Pago

2. **Selecciona tu Aplicación**:
   - Ve a "Tus integraciones"
   - Selecciona tu aplicación

3. **Configura el Webhook**:
   - Ve a la sección **"Webhooks"** o **"Notificaciones"**
   - Haz clic en **"Configurar webhook"** o **"Agregar URL"**
   - Ingresa la URL de tu webhook:
     ```
     https://tu-url-ngrok.ngrok.io/api/webhook/mercadopago
     ```
   - Selecciona el evento: **"Pagos"** (payments)
   - Guarda la configuración

4. **Obtén el Secret Key**:
   - Después de configurar el webhook, Mercado Pago te proporcionará un **Secret Key**
   - Este secret se usa para validar que las notificaciones vienen realmente de Mercado Pago
   - Copia este secret

### Paso 4: Configurar el Secret Key en tu Proyecto

1. **Abre el archivo `.env`**
2. **Agrega el Secret Key**:
   ```env
   MERCADO_PAGO_WEBHOOK_SECRET=tu-secret-key-aqui
   ```
3. **Reinicia el servidor webhook** para que cargue la nueva variable

### Paso 5: Probar el Webhook

1. **Verifica que el servidor esté funcionando**:
   ```bash
   curl http://localhost:3001/api/webhook/health
   ```
   Deberías recibir: `{"status":"ok","message":"Webhook server is running"}`

2. **Realiza un pago de prueba**:
   - Usa las tarjetas de prueba de Mercado Pago
   - Completa un pago en tu aplicación
   - Verifica en los logs del servidor webhook que recibiste la notificación

3. **Verifica en Firebase**:
   - La orden debería actualizarse automáticamente con el estado del pago
   - Revisa la colección `orders` en Firebase Console

## 🔒 Seguridad

### Validación HMAC

El servidor webhook valida automáticamente que las notificaciones vengan de Mercado Pago usando HMAC SHA256:

1. **Extrae la firma** del header `x-signature`
2. **Genera un hash** usando el Secret Key
3. **Compara** con el hash recibido
4. **Rechaza** notificaciones inválidas

### Producción

Para producción:

1. **Usa HTTPS**: El webhook debe estar en HTTPS (no HTTP)
2. **Configura el Secret Key**: Nunca dejes el secret vacío en producción
3. **Monitorea los logs**: Revisa regularmente los logs del servidor
4. **Usa un servidor confiable**: Despliega el webhook en un servidor estable (Vercel, Railway, Heroku, etc.)

## 📡 Endpoints del Webhook

### POST `/api/webhook/mercadopago`

Recibe las notificaciones de Mercado Pago.

**Headers requeridos:**
- `x-signature`: Firma HMAC de la notificación
- `x-request-id`: ID único de la solicitud

**Query params:**
- `data.id`: ID del recurso (pago, preferencia, etc.)
- `type`: Tipo de notificación (payment, plan, subscription, etc.)

**Respuesta:**
- `200 OK`: Notificación procesada correctamente
- `400 Bad Request`: Parámetros faltantes
- `401 Unauthorized`: Firma inválida

### GET `/api/webhook/health`

Endpoint de salud para verificar que el servidor está funcionando.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Webhook server is running",
  "timestamp": "2024-01-13T12:00:00.000Z"
}
```

## 🔄 Flujo de una Notificación

1. **Mercado Pago** detecta un cambio en un pago
2. **Envía una notificación POST** a tu webhook
3. **Tu servidor valida** la firma HMAC
4. **Obtiene información completa** del pago desde la API de Mercado Pago
5. **Actualiza la orden** en Firebase con el nuevo estado
6. **Responde con HTTP 200** para confirmar recepción

## 📝 Logs y Debugging

El servidor webhook registra información detallada en la consola:

- ✅ Notificaciones recibidas
- ✅ Validación HMAC exitosa
- ✅ Actualizaciones de órdenes
- ❌ Errores y advertencias

Para ver los logs en tiempo real:
```bash
npm run webhook
```

## 🐛 Solución de Problemas

### El webhook no recibe notificaciones

1. **Verifica que el servidor esté corriendo**: `npm run webhook`
2. **Verifica que la URL sea accesible**: Usa `curl` o visita la URL en el navegador
3. **Verifica la configuración en Mercado Pago**: Asegúrate de que la URL esté correcta
4. **Revisa los logs**: Busca errores en la consola

### Error: "Validación HMAC fallida"

1. **Verifica el Secret Key**: Asegúrate de que esté correcto en el `.env`
2. **Verifica que el secret coincida**: Debe ser el mismo que configuraste en Mercado Pago
3. **Reinicia el servidor**: Después de cambiar el `.env`

### Las órdenes no se actualizan

1. **Verifica la conexión a Firebase**: Asegúrate de que las credenciales sean correctas
2. **Revisa los logs**: Busca errores al actualizar Firebase
3. **Verifica el external_reference**: Debe tener el formato `order-{orderId}`

## 📚 Referencias

- [Documentación oficial de Webhooks de Mercado Pago](https://www.mercadopago.cl/developers/es/docs/checkout-pro/payment-notifications)
- [Panel de Desarrolladores](https://www.mercadopago.cl/developers/panel)
- [ngrok - Túnel HTTPS local](https://ngrok.com/)

## ✅ Checklist de Configuración

- [ ] Servidor webhook iniciado y funcionando
- [ ] URL del webhook expuesta públicamente (ngrok o similar)
- [ ] Webhook configurado en el panel de Mercado Pago
- [ ] Secret Key configurado en el archivo `.env`
- [ ] Prueba de pago realizada exitosamente
- [ ] Verificación de que las órdenes se actualizan en Firebase
- [ ] Logs revisados sin errores

---

**¿Necesitas ayuda?** Revisa los logs del servidor o consulta la [documentación oficial de Mercado Pago](https://www.mercadopago.cl/developers/es/docs/checkout-pro/payment-notifications).
