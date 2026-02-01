# 🧭 Cómo Navegar en el Panel de Desarrolladores de Mercado Pago

Si estás viendo "Mis pedidos", "Período", "Operaciones", "Estados", "Medios de pago", estás en una vista de reportes. Aquí te explico cómo llegar a donde necesitas.

## 📍 Situación Actual

Estás viendo:
- ✅ Mis pedidos
- ✅ Período
- ✅ Operaciones
- ✅ Estados
- ✅ Medios de pago

Esto significa que estás en una **vista de reportes o estadísticas**, pero necesitas ir a **"Aplicaciones"** o **"Credenciales"**.

## 🎯 Pasos para Llegar a las Credenciales

### Paso 1: Buscar el Menú de Navegación

**Opción A: Menú Lateral Izquierdo**
1. Mira a la **izquierda de la pantalla**
2. Busca un menú vertical con opciones como:
   - 📱 **Aplicaciones**
   - 🔗 **Tus integraciones**
   - 🔑 **Credenciales**
   - 📊 **Reportes** (donde estás ahora)
   - ⚙️ **Configuración**

**Opción B: Menú Superior**
1. Mira la **parte superior** de la pantalla
2. Busca pestañas o enlaces que digan:
   - "Aplicaciones"
   - "Integraciones"
   - "Panel"
   - "Developers"

**Opción C: Menú Hamburguesa**
1. Busca un icono de **tres líneas horizontales (☰)** en la esquina superior izquierda
2. Haz clic en él para abrir el menú
3. Busca "Aplicaciones" o "Integraciones"

### Paso 2: Ir a Aplicaciones

1. Haz clic en **"Aplicaciones"** o **"Tus integraciones"** o **"Mis aplicaciones"**

### Paso 3: Crear una Aplicación (si no tienes una)

Si ves un mensaje que dice "No tienes aplicaciones" o un botón grande:

1. Haz clic en **"Crear nueva aplicación"** o **"Nueva aplicación"** o **"Crear aplicación"**
2. Completa el formulario:
   - **Nombre**: `CubingMate`
   - **Descripción**: `Tienda online de cubos de Rubik`
   - **Categoría**: Selecciona `E-commerce` o `Retail` o `Venta online`
3. Haz clic en **"Crear"** o **"Guardar"**

### Paso 4: Ver las Credenciales

Una vez que tengas una aplicación:

1. Haz clic en el nombre de tu aplicación (`CubingMate`)
2. Verás varias pestañas o secciones:
   - **Credenciales de prueba** ← **AQUÍ ES LO QUE NECESITAS**
   - Credenciales de producción
   - Webhooks
   - Configuración

3. Haz clic en **"Credenciales de prueba"**

### Paso 5: Copiar el Access Token

En la sección "Credenciales de prueba" verás:

- **Public Key** (no la necesitas ahora)
- **Access Token** ← **ESTE ES EL QUE NECESITAS**
  - Debe comenzar con `TEST-`
  - Ejemplo: `TEST-1234567890-abcdef-123456-abcdef123456-123456`

1. Haz clic en el botón **"Copiar"** o **"Revelar"** junto al Access Token
2. Copia el token completo

## 🚀 Método Rápido: URL Directa

Si no encuentras el menú, intenta estas URLs directamente:

### Para ver tus aplicaciones:
```
https://www.mercadopago.cl/developers/panel/app
```

### Para crear una aplicación nueva:
```
https://www.mercadopago.cl/developers/panel/app/create
```

### Para ver credenciales directamente:
```
https://www.mercadopago.cl/developers/panel/credentials
```

## 🔍 Si No Encuentras las Opciones

### Verifica que estés en el lugar correcto:

1. **La URL debe ser**: `mercadopago.cl/developers/...`
2. **NO debe ser**: `mercadopago.cl` (panel principal)
3. **NO debe ser**: `mercadopago.com` (versión internacional)

### Busca estos elementos visuales:

- Un logo o icono de **"Developers"** o **"Dev"**
- Un menú que diga **"Panel de desarrolladores"**
- Opciones relacionadas con **"API"**, **"Integraciones"**, **"Aplicaciones"**

## 📸 Qué Buscar Visualmente

Cuando estés en el lugar correcto, deberías ver algo como:

```
┌─────────────────────────────────────┐
│  Mercado Pago Developers             │
├─────────────────────────────────────┤
│  [Menú Lateral]                     │
│  📱 Aplicaciones                    │
│  🔑 Credenciales                    │
│  📊 Reportes                        │
│  ⚙️  Configuración                  │
└─────────────────────────────────────┘
```

## 💡 Consejos

1. **Si estás perdido**: Haz clic en el logo de Mercado Pago para volver al inicio del panel
2. **Usa Ctrl+F**: Presiona Ctrl+F y busca "Credenciales" o "Access Token"
3. **Revisa todas las pestañas**: A veces las credenciales están en una pestaña diferente
4. **Intenta en otro navegador**: A veces hay problemas de compatibilidad

## ✅ Checklist

- [ ] Estoy en `mercadopago.cl/developers`
- [ ] Veo un menú con "Aplicaciones" o "Integraciones"
- [ ] Tengo una aplicación creada (o la voy a crear)
- [ ] Puedo ver "Credenciales de prueba"
- [ ] Puedo copiar mi Access Token (comienza con `TEST-`)

## 🆘 Si Aún No Puedes Encontrarlo

1. Toma una captura de pantalla de lo que ves
2. Busca en Google: "Mercado Pago Developers Chile credenciales"
3. O contacta al soporte de Mercado Pago explicando que necesitas crear una aplicación para integración

---

**Una vez que tengas tu Access Token**, vuelve a `GUIA_INTEGRAR_MERCADO_PAGO.md` para continuar con la configuración.
