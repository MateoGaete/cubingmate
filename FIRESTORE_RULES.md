# 🔒 Reglas de Seguridad de Firestore

Este documento contiene las reglas recomendadas para Firestore que permiten que la aplicación funcione correctamente.

## 📋 Reglas Recomendadas

Copia y pega estas reglas en Firebase Console > Firestore Database > Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: lectura pública, escritura solo para administradores
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Cambiar a true solo si tienes autenticación de admin
    }
    
    // Órdenes: lectura/escritura para usuarios autenticados
    match /orders/{orderId} {
      // Permitir lectura si el usuario está autenticado
      allow read: if request.auth != null;
      // Permitir escritura solo si el usuario está autenticado
      allow write: if request.auth != null;
    }
    
    // Usuarios: permitir que los usuarios se guarden a sí mismos
    match /users/{userId} {
      // Permitir lectura si el usuario está autenticado y es el mismo usuario
      allow read: if request.auth != null && request.auth.uid == userId;
      // Permitir escritura si el usuario está autenticado y es el mismo usuario
      // Esto permite que los usuarios se guarden a sí mismos durante el registro/login
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## ⚠️ Nota sobre el Error de Permisos

Si ves el error "Missing or insufficient permissions" al obtener el total de clientes:

**Opción 1: Permitir lectura pública de órdenes (menos seguro)**
```javascript
match /orders/{orderId} {
  allow read: if true; // Permite lectura pública
  allow write: if request.auth != null;
}
```

**Opción 2: Mantener seguridad y manejar el error (recomendado)**
- El código ya maneja este error silenciosamente
- El contador de clientes mostrará 0 si no hay permisos
- Esto es más seguro porque no expone datos de órdenes

## 🔐 Cómo Aplicar las Reglas

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **cubingmate-7a406**
3. Ve a **Firestore Database** > **Reglas**
4. Copia y pega las reglas de arriba
5. Haz clic en **Publicar**

## ✅ Verificación

Después de aplicar las reglas:
- Los productos deberían ser visibles para todos
- Las órdenes solo deberían ser visibles para usuarios autenticados
- El contador de clientes puede mostrar 0 si no hay permisos (esto es normal y seguro)
