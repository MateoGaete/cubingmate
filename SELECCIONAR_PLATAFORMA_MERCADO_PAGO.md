# 🖥️ Cómo Seleccionar la Plataforma en Mercado Pago

Cuando Mercado Pago te pide seleccionar la plataforma, aquí te explico qué elegir para tu tienda web.

## ✅ Plataforma Correcta para tu Proyecto

Tu aplicación CubingMate es una **aplicación web** construida con React/Vite, por lo que debes seleccionar:

### Opción Recomendada: **"Web"** o **"Website"** o **"Aplicación web"**

Esta es la opción correcta para tiendas online que funcionan en navegadores web.

## 📋 Pasos Detallados

### Paso 1: Buscar la Opción Correcta

Cuando veas la lista de plataformas, busca:

✅ **Opciones correctas** (en orden de preferencia):
1. **"Web"** o **"Website"** o **"Aplicación web"**
2. **"Checkout Pro"** (también funciona para web)
3. **"API"** o **"REST API"** (si no hay opción Web)
4. **"Otro"** o **"Other"** (como última opción)

❌ **Opciones incorrectas** (NO selecciones estas):
- "Android" (es para apps móviles Android)
- "iOS" (es para apps móviles iPhone)
- "React Native" (es para apps móviles)
- "Flutter" (es para apps móviles)

### Paso 2: Seleccionar la Plataforma

1. Haz clic en la opción **"Web"** o **"Website"**
2. Si no ves "Web", selecciona **"Checkout Pro"** (es el método que estás usando)
3. Si tampoco ves "Checkout Pro", selecciona **"API"** o **"Otro"**

### Paso 3: Continuar con el Formulario

Después de seleccionar la plataforma:

1. Completa el formulario que aparece:
   - **Nombre de la aplicación**: `CubingMate`
   - **Descripción**: `Tienda online de cubos de Rubik`
   - **Categoría**: Selecciona `E-commerce` o `Retail` o `Venta online`
   - **URL del sitio** (opcional): Puedes poner `http://localhost:5173` para desarrollo
   
2. Haz clic en **"Crear"** o **"Crear aplicación"**

## 🎯 ¿Por Qué "Web" o "Checkout Pro"?

- **"Web"**: Es la opción genérica para cualquier sitio web
- **"Checkout Pro"**: Es específicamente para integraciones de pago en sitios web (que es lo que estás haciendo)
- Ambas funcionan perfectamente para tu caso

## 💡 Si No Ves Ninguna de Estas Opciones

Si la lista de plataformas es diferente, busca:

1. **Cualquier opción relacionada con "Web" o "Sitio web"**
2. **"Checkout"** (puede ser Checkout Pro, Checkout API, etc.)
3. **"API"** o **"REST API"** (funciona para cualquier integración)
4. **"Otro"** o **"Other"** (siempre está disponible)

## ✅ Después de Seleccionar la Plataforma

Una vez que hayas seleccionado la plataforma y creado la aplicación:

1. Te llevará a la página de tu aplicación
2. Busca la pestaña o sección **"Credenciales"** o **"Credentials"**
3. Haz clic en **"Credenciales de prueba"** o **"Test credentials"**
4. Copia tu **Access Token** (debe comenzar con `TEST-`)

## 🔍 Ejemplo Visual

Cuando veas algo como esto:

```
┌─────────────────────────────────┐
│ Selecciona tu plataforma        │
├─────────────────────────────────┤
│ ☐ Android                       │
│ ☐ iOS                          │
│ ☑ Web                          │ ← Selecciona esta
│ ☐ Checkout Pro                 │ ← O esta
│ ☐ API                          │
│ ☐ Otro                         │
└─────────────────────────────────┘
```

Selecciona **"Web"** o **"Checkout Pro"**.

## 📞 Si Tienes Dudas

Si ninguna de las opciones parece correcta:

1. Selecciona **"Otro"** o **"Other"** (siempre funciona)
2. O selecciona **"API"** o **"REST API"**
3. Ambas opciones te permitirán obtener las credenciales que necesitas

---

**Una vez que selecciones la plataforma y completes el formulario**, podrás obtener tus credenciales y continuar con la integración.
