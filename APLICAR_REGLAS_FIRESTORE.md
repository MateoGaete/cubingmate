# 🔧 Aplicar Reglas de Firestore - Guía Rápida

## ⚠️ IMPORTANTE: Aplica estas reglas AHORA

Tienes errores de permisos porque las reglas de Firestore no están configuradas correctamente. Sigue estos pasos:

## 📋 Pasos para Aplicar las Reglas

### 1. Abre Firebase Console
Ve a: https://console.firebase.google.com/

### 2. Selecciona tu Proyecto
- Haz clic en el proyecto: **cubingmate-7a406**

### 3. Ve a Firestore Database
- En el menú lateral izquierdo, haz clic en **"Firestore Database"**
- Haz clic en la pestaña **"Reglas"** (arriba)

### 4. Copia y Pega estas Reglas

**BORRA TODO** lo que está en el editor y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: lectura pública, escritura solo para administradores
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Órdenes: lectura/escritura para usuarios autenticados
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Usuarios: permitir que los usuarios se guarden a sí mismos
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Publica las Reglas
- Haz clic en el botón **"Publicar"** (arriba a la derecha)
- Espera a que se publique (puede tardar unos segundos)

### 6. Verifica
- Deberías ver un mensaje de éxito
- Las reglas ahora están activas

## ✅ Qué Hacen Estas Reglas

1. **Productos**: Cualquiera puede leer, nadie puede escribir (seguro)
2. **Órdenes**: Solo usuarios autenticados pueden leer y escribir
3. **Usuarios**: Los usuarios solo pueden leer/escribir su propia información

## 🔍 Verificar que Funcionó

Después de aplicar las reglas:
1. Recarga tu aplicación
2. Intenta iniciar sesión o crear una cuenta
3. Los errores de permisos deberían desaparecer

## ⚠️ Si Aún Ves Errores

1. Espera 1-2 minutos (las reglas pueden tardar en propagarse)
2. Limpia la caché del navegador
3. Recarga la página
4. Verifica que las reglas se publicaron correctamente en Firebase Console

## 📝 Nota sobre el Contador de Clientes

El contador de clientes puede mostrar 0 si no hay permisos. Esto es **normal y seguro** porque:
- Las órdenes contienen información sensible
- Solo usuarios autenticados deberían poder verlas
- El código maneja este error silenciosamente

Si quieres que el contador funcione, necesitarías permitir lectura pública de órdenes (menos seguro), pero no es necesario para que la aplicación funcione.
