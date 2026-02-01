# 🔔 Configuración de Webhook - Paso a Paso

## ⚠️ IMPORTANTE: No puedes usar `localhost`

Mercado Pago **NO puede acceder** a `localhost` porque no es una URL pública. Necesitas exponer tu servidor local a internet usando un túnel.

---

## 📋 Paso 1: Instalar ngrok

1. **Descarga ngrok**: https://ngrok.com/download
2. **Instala ngrok** en tu sistema
3. **Crea una cuenta gratuita** en ngrok.com (opcional pero recomendado)

---

## 📋 Paso 2: Iniciar tu servidor webhook

Abre una terminal y ejecuta:

```bash
npm run webhook
```

Deberías ver:
```
🚀 Servidor webhook iniciado en http://localhost:3001
📡 Endpoint: http://localhost:3001/api/webhook/mercadopago
```

**⚠️ NO CIERRES ESTA TERMINAL** - Déjala corriendo.

---

## 📋 Paso 3: Exponer el servidor con ngrok

Abre **OTRA terminal nueva** y ejecuta:

```bash
ngrok http 3001
```

**Nota**: Si instalaste ngrok pero no está en el PATH, usa la ruta completa o agrega ngrok al PATH.

Deberías ver algo como:

```
Forwarding   https://abc123-def456.ngrok.io -> http://localhost:3001
```

**📌 COPIA LA URL HTTPS** (la que empieza con `https://` y termina en `.ngrok.io`)

Ejemplo: `https://abc123-def456.ngrok.io`

**⚠️ NO CIERRES ESTA TERMINAL TAMPOCO** - ngrok debe seguir corriendo.

---

## 📋 Paso 4: Configurar en Mercado Pago

### 4.1. Modo de Prueba

En la pantalla de Mercado Pago que estás viendo:

1. ✅ **Asegúrate de estar en "Modo de prueba"** (ya lo tienes seleccionado)

### 4.2. URL para Prueba

1. **Borra** el contenido del campo "URL para prueba" (`https://localhost:3000/`)
2. **Pega** la URL de ngrok que copiaste en el Paso 3
3. **Agrega** `/api/webhook/mercadopago` al final

**Ejemplo completo:**
```
https://abc123-def456.ngrok.io/api/webhook/mercadopago
```

**✅ Formato correcto:**
- ✅ Debe empezar con `https://`
- ✅ Debe terminar en `.ngrok.io` (o tu dominio público)
- ✅ Debe incluir `/api/webhook/mercadopago` al final
- ❌ NO debe tener `localhost`
- ❌ NO debe tener `:3000` o `:3001` en la URL

### 4.3. Eventos Recomendados

En la sección **"Eventos recomendados para integraciones con Checkout Pro"**:

1. ✅ **Marca "Pagos"** (ya lo tienes marcado) - **ESTO ES OBLIGATORIO**
2. ❌ Los demás eventos puedes dejarlos sin marcar por ahora

### 4.4. Clave Secreta (Secret Key)

1. **Haz clic en el ícono circular** (🔄) junto al campo "Clave secreta"
   - Esto generará un nuevo secret key automáticamente
   
2. **Copia el secret key** que se genera
   - Se mostrará como texto enmascarado (*****)
   - Haz clic en el ícono de "ojo" 👁️ para verlo completo si es necesario
   - **COPIA ESTE VALOR** - lo necesitarás después

### 4.5. Guardar Configuración

1. **Haz clic en "Guardar configuración"** (botón gris abajo a la izquierda)
2. Espera a que aparezca un mensaje de confirmación

---

## 📋 Paso 5: Configurar el Secret Key en tu proyecto

1. **Abre el archivo `.env`** en tu proyecto
2. **Busca la línea** que dice:
   ```env
   MERCADO_PAGO_WEBHOOK_SECRET=
   ```
3. **Pega el secret key** que copiaste en el Paso 4.4:
   ```env
   MERCADO_PAGO_WEBHOOK_SECRET=tu-secret-key-aqui
   ```
4. **Guarda el archivo**

---

## 📋 Paso 6: Reiniciar el servidor webhook

1. **Ve a la terminal** donde está corriendo `npm run webhook`
2. **Presiona `Ctrl + C`** para detenerlo
3. **Vuelve a ejecutar**:
   ```bash
   npm run webhook
   ```

Ahora deberías ver:
```
✅ Validación HMAC habilitada
```

---

## 📋 Paso 7: Probar el Webhook

### Opción A: Simular Notificación (Recomendado)

1. **En la pantalla de Mercado Pago**, haz clic en **"Simular notificación"**
2. **Selecciona** el tipo de evento: "Pagos"
3. **Haz clic en "Enviar"**
4. **Ve a la terminal** donde está corriendo el webhook
5. **Deberías ver**:
   ```
   📨 Notificación recibida de Mercado Pago
   ✅ Validación HMAC exitosa
   ```

### Opción B: Realizar un Pago de Prueba

1. **Realiza un pago de prueba** en tu aplicación usando:
   - Tarjeta: `5031 7557 3453 0604`
   - CVV: `123`
   - Fecha: Cualquier fecha futura
   - Nombre: `APRO`
2. **Completa el pago**
3. **Verifica en la terminal** del webhook que recibiste la notificación
4. **Verifica en Firebase** que la orden se actualizó automáticamente

---

## ✅ Checklist de Verificación

Antes de considerar que está configurado correctamente, verifica:

- [ ] ngrok está corriendo y muestra una URL HTTPS
- [ ] El servidor webhook está corriendo en el puerto 3001
- [ ] La URL en Mercado Pago es HTTPS (no HTTP) y no contiene `localhost`
- [ ] La URL termina en `/api/webhook/mercadopago`
- [ ] El evento "Pagos" está marcado
- [ ] El Secret Key está configurado en el archivo `.env`
- [ ] El servidor webhook fue reiniciado después de agregar el Secret Key
- [ ] La simulación de notificación funciona correctamente

---

## 🐛 Problemas Comunes

### Error: "Revisa la URL que ingresaste"

**Causa**: La URL contiene `localhost` o no es accesible públicamente.

**Solución**:
1. Asegúrate de usar la URL de ngrok (https://...ngrok.io)
2. Verifica que ngrok esté corriendo
3. Verifica que el servidor webhook esté corriendo en el puerto 3001

### Error: "Validación HMAC fallida"

**Causa**: El Secret Key no está configurado correctamente.

**Solución**:
1. Verifica que copiaste el Secret Key completo
2. Verifica que está en el archivo `.env` como `MERCADO_PAGO_WEBHOOK_SECRET=...`
3. Reinicia el servidor webhook después de cambiar el `.env`

### No recibo notificaciones

**Causa**: La URL no es accesible o el servidor no está corriendo.

**Solución**:
1. Verifica que ngrok esté corriendo
2. Verifica que el servidor webhook esté corriendo
3. Prueba acceder a: `https://tu-url-ngrok.ngrok.io/api/webhook/health`
   - Deberías ver: `{"status":"ok","message":"Webhook server is running"}`
4. Verifica que la URL en Mercado Pago sea exactamente la misma

---

## 📝 Notas Importantes

1. **ngrok URLs temporales**: Las URLs gratuitas de ngrok cambian cada vez que reinicias ngrok. Si reinicias ngrok, debes actualizar la URL en Mercado Pago.

2. **ngrok Pro**: Si necesitas una URL permanente, considera la versión Pro de ngrok.

3. **Producción**: Para producción, usa un servidor real con dominio propio (no ngrok).

4. **Puerto**: El servidor webhook usa el puerto 3001 por defecto. Si necesitas cambiarlo, modifica `WEBHOOK_PORT` en el `.env`.

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu webhook estará configurado y recibirá notificaciones automáticas de Mercado Pago cada vez que cambie el estado de un pago.
