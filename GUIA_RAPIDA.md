# 🚀 Guía Rápida de Inicio - CubingMate

Esta guía te ayudará a poner en marcha tu tienda de cubos de Rubik en menos de 30 minutos.

## ⚡ Inicio Rápido (5 pasos)

### 1️⃣ Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### 2️⃣ Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Firestore Database** (modo de prueba)
4. Ve a **Configuración del proyecto** > **Tus aplicaciones** > **Web**
5. Copia las credenciales
6. Abre `src/firebase/config.js` y pega tus credenciales

**📖 Guía detallada:** Lee `FIREBASE_SETUP.md`

### 3️⃣ Configurar Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.cl/developers)
2. Crea una aplicación
3. Copia tu **Access Token** (usa el de prueba para desarrollo)
4. Abre `src/services/mercadoPago.js` y pega tu token

**📖 Guía detallada:** Lee `MERCADO_PAGO_SETUP.md`

### 4️⃣ Agregar Productos

Tienes dos opciones:

**Opción A: Desde Firebase Console**
1. Ve a Firestore Database
2. Crea colección `products`
3. Agrega documentos con estos campos:
   - `name` (string)
   - `description` (string)
   - `price` (number)
   - `category` (string): "3x3", "2x2", "4x4", "5x5", "speedcubes", "accesorios"
   - `stock` (number)
   - `image` (string): URL de la imagen

**Opción B: Usar script de ejemplo**
1. Edita `scripts/addSampleProducts.js` con tus credenciales
2. Ejecuta: `node scripts/addSampleProducts.js`

### 5️⃣ Iniciar la Aplicación

```bash
npm run dev
```

Abre tu navegador en `http://localhost:3000` 🎉

## 📋 Checklist de Configuración

- [ ] Node.js instalado (versión 16+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Firebase configurado (`src/firebase/config.js`)
- [ ] Firestore Database creada y habilitada
- [ ] Reglas de Firestore configuradas
- [ ] Mercado Pago configurado (`src/services/mercadoPago.js`)
- [ ] Al menos un producto agregado a Firestore
- [ ] Aplicación funcionando en localhost

## 🧪 Probar la Aplicación

1. **Ver productos**: Deberías ver tus productos en la página principal
2. **Agregar al carrito**: Haz clic en un producto y agrega al carrito
3. **Ver carrito**: Ve a `/cart` para ver tus productos
4. **Probar pago**: Completa el checkout (usa tarjetas de prueba de Mercado Pago)

## 🎯 Próximos Pasos

1. **Personalizar diseño**: Edita los archivos CSS en `src/`
2. **Agregar más productos**: Usa Firebase Console o el script
3. **Configurar imágenes**: Sube imágenes a Firebase Storage
4. **Probar pagos**: Usa las tarjetas de prueba de Mercado Pago
5. **Desplegar**: Cuando estés listo, despliega en Firebase Hosting o Vercel

## 🆘 Problemas Comunes

### "Error: Firebase configuration not found"
- Verifica que `src/firebase/config.js` tenga todas las credenciales

### "No se muestran productos"
- Verifica que la colección se llame exactamente `products`
- Revisa las reglas de Firestore (deben permitir lectura)

### "Error al crear preferencia de pago"
- Verifica tu Access Token de Mercado Pago
- Asegúrate de usar el token correcto (prueba vs producción)

## 📚 Documentación Completa

- **README.md** - Documentación general del proyecto
- **FIREBASE_SETUP.md** - Guía detallada de Firebase
- **MERCADO_PAGO_SETUP.md** - Guía detallada de Mercado Pago

## 💡 Consejos

- Usa **modo de prueba** de Mercado Pago durante el desarrollo
- Agrega productos de ejemplo para probar la funcionalidad
- Revisa la consola del navegador (F12) si hay errores
- Las imágenes pueden ser URLs externas o de Firebase Storage

---

¡Listo para comenzar! Si tienes dudas, revisa la documentación completa en los archivos mencionados. 🧩✨
