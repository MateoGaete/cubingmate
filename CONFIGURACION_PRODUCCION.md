# 🚀 Configuración de Producción - Mercado Pago

## ✅ Credenciales Configuradas

Las credenciales de **PRODUCCIÓN** de Mercado Pago han sido configuradas en el archivo `.env`:

- ✅ **Public Key**: `APP_USR-e14a8fb2-ca09-4a88-9b8f-def352585845`
- ✅ **Access Token**: `APP_USR-4499431422783159-012519-5f6c85876b79712bc5d4094dfe6beb09-1342185967`
- ✅ **Client ID**: `4499431422783159`
- ✅ **Client Secret**: `1oEWbZgau8Z7UrVfLHfzL3JPRW1y8e0M`
- ✅ **Webhook Secret**: Configurado

## ⚠️ IMPORTANTE: Modo de Producción

**Estas credenciales procesan pagos REALES**. Ten en cuenta:

1. **Los pagos serán reales**: Cada transacción cobrará dinero real a los clientes
2. **Mercado Pago cobrará comisiones**: Aproximadamente 3.49% + $990 CLP por transacción
3. **El dinero llegará a tu cuenta**: Los pagos se acreditarán en tu cuenta de Mercado Pago
4. **No hay vuelta atrás**: Una vez que uses credenciales de producción, los pagos serán reales

## 🔒 Seguridad en Producción

### Checklist de Seguridad

- [x] Credenciales configuradas en `.env` (no hardcodeadas)
- [x] Archivo `.env` en `.gitignore` (no se subirá al repositorio)
- [x] Webhook secret configurado para validar notificaciones
- [ ] HTTPS configurado en producción (obligatorio)
- [ ] Webhook configurado con URL pública (no localhost)
- [ ] Variables de entorno configuradas en el servidor de producción

## 📋 Configuración del Webhook en Producción

### Paso 1: Configurar Webhook en Mercado Pago (Modo Productivo)

1. Ve a: https://www.mercadopago.cl/developers/panel
2. Selecciona tu aplicación
3. Ve a **"Webhooks"** → **"Modo productivo"**
4. Configura la URL de tu webhook de producción:
   ```
   https://tu-dominio.com/api/webhook/mercadopago
   ```
5. Selecciona el evento: **"Pagos"**
6. Copia el **Secret Key** del webhook de producción
7. Actualiza `MERCADO_PAGO_WEBHOOK_SECRET` en tu servidor de producción

### Paso 2: Desplegar el Servidor Webhook

El servidor webhook debe estar desplegado en un servidor público con HTTPS:

**Opciones de despliegue:**
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **Render**: https://render.com
- **DigitalOcean**: https://digitalocean.com

**Requisitos:**
- ✅ HTTPS habilitado (obligatorio)
- ✅ Dominio público (no localhost)
- ✅ Variables de entorno configuradas
- ✅ Puerto accesible públicamente

## 🔄 Cambiar entre Desarrollo y Producción

### Para Desarrollo (Pruebas)

Usa credenciales que empiecen con `TEST-`:
```env
VITE_MERCADO_PAGO_ACCESS_TOKEN=TEST-tu-token-de-prueba
```

### Para Producción

Usa credenciales que empiecen con `APP_USR-`:
```env
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-tu-token-de-produccion
```

## 📊 Monitoreo de Pagos

### Ver Pagos en Mercado Pago

1. Ve a: https://www.mercadopago.cl/activities/list
2. Verás todos los pagos recibidos
3. Puedes filtrar por fecha, estado, etc.

### Ver Pagos en tu Aplicación

- **Panel de Admin**: `/admin` (si está configurado)
- **Firebase Console**: Colección `orders`
- **Logs del Webhook**: Revisa los logs del servidor

## 🧪 Probar antes de Ir a Producción

Antes de usar credenciales de producción:

1. **Prueba con credenciales de prueba** (`TEST-`)
2. **Verifica que todo funcione correctamente**
3. **Prueba el flujo completo**:
   - Crear orden
   - Redirigir a Mercado Pago
   - Completar pago
   - Recibir notificación webhook
   - Actualizar orden en Firebase
4. **Verifica los logs** del webhook
5. **Confirma que las órdenes se actualizan** correctamente

## 🚨 Si Algo Sale Mal

### Pago Procesado pero Orden No Actualizada

1. Verifica que el webhook esté configurado correctamente
2. Revisa los logs del servidor webhook
3. Verifica que Firebase esté configurado correctamente
4. Usa el panel de admin para actualizar manualmente si es necesario

### Webhook No Recibe Notificaciones

1. Verifica que la URL sea accesible públicamente
2. Verifica que use HTTPS (no HTTP)
3. Revisa la configuración en el panel de Mercado Pago
4. Prueba con "Simular notificación" en el panel

### Error de Validación HMAC

1. Verifica que `MERCADO_PAGO_WEBHOOK_SECRET` esté correcto
2. Asegúrate de usar el secret del modo correcto (prueba vs producción)
3. Reinicia el servidor webhook después de cambiar el secret

## 📚 Recursos

- [Panel de Mercado Pago](https://www.mercadopago.cl)
- [Panel de Desarrolladores](https://www.mercadopago.cl/developers/panel)
- [Documentación de Webhooks](https://www.mercadopago.cl/developers/es/docs/checkout-pro/payment-notifications)
- [Reportes de Actividades](https://www.mercadopago.cl/activities/list)

## ✅ Checklist Final

Antes de comenzar a recibir pagos reales:

- [ ] Credenciales de producción configuradas
- [ ] Webhook configurado en modo productivo
- [ ] Servidor webhook desplegado con HTTPS
- [ ] Variables de entorno configuradas en producción
- [ ] Pruebas realizadas con credenciales de prueba
- [ ] Monitoreo configurado
- [ ] Proceso de soporte definido

---

**¡Listo para recibir pagos reales!** 🎉

Recuerda: Los pagos ahora serán reales. Asegúrate de tener todo configurado correctamente antes de comenzar.
