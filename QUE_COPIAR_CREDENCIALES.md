# 🔑 Qué Copiar en las Credenciales de Mercado Pago

Cuando veas las credenciales de prueba, verás DOS cosas diferentes. Aquí te explico cuál copiar.

## 📋 Lo que Verás

En la sección "Credenciales de prueba" verás algo como:

```
┌─────────────────────────────────────────┐
│ Credenciales de prueba                 │
├─────────────────────────────────────────┤
│ Public Key                              │
│ TEST-abc123-def456-ghi789...           │ ← NO COPIES ESTE
│ [Copiar]                                │
├─────────────────────────────────────────┤
│ Access Token                            │
│ TEST-xyz789-uvw456-rst123...           │ ← COPIA ESTE ✅
│ [Copiar] [Revelar]                      │
└─────────────────────────────────────────┘
```

## ✅ Qué Copiar: **Access Token**

### Pasos:

1. **Busca donde dice "Access Token"** o **"Token de acceso"**
   - NO confundas con "Public Key"
   - El Access Token está más abajo o en otra sección

2. **Haz clic en "Revelar"** o **"Mostrar"** (si está oculto)
   - El Access Token suele estar oculto por seguridad
   - Necesitas hacer clic en "Revelar" para verlo completo

3. **Copia el Access Token completo**
   - Debe comenzar con `TEST-`
   - Es una cadena larga de caracteres
   - Ejemplo: `TEST-1234567890-abcdef-123456-abcdef123456-123456`

4. **Pégalo en tu código**
   - Abre `src/services/mercadoPago.js`
   - Reemplaza `'TU_ACCESS_TOKEN_AQUI'` con tu Access Token

## ❌ NO Copies: Public Key

- El **Public Key** también comienza con `TEST-`
- Pero NO es lo que necesitas
- El Public Key se usa para otras cosas, no para tu integración actual

## 🔍 Cómo Identificar el Access Token

El Access Token:
- ✅ Dice **"Access Token"** o **"Token de acceso"**
- ✅ Comienza con `TEST-` (en modo de prueba)
- ✅ Es una cadena MUY larga (mucho más larga que el Public Key)
- ✅ Suele estar oculto y necesitas hacer clic en "Revelar"
- ✅ Tiene un botón que dice "Copiar" o "Revelar"

## 📝 Ejemplo Visual

```
┌──────────────────────────────────────────────┐
│ Public Key                                   │
│ ┌──────────────────────────────────────────┐ │
│ │ TEST-abc123-def456                       │ │ ← IGNORA ESTO
│ └──────────────────────────────────────────┘ │
│ [Copiar]                                     │
├──────────────────────────────────────────────┤
│ Access Token                                 │
│ ┌──────────────────────────────────────────┐ │
│ │ ••••••••••••••••••••••••••••••••••••••   │ │ ← ESTE ESTÁ OCULTO
│ └──────────────────────────────────────────┘ │
│ [Revelar] [Copiar]                            │ ← Haz clic en "Revelar"
└──────────────────────────────────────────────┘

Después de hacer clic en "Revelar":

┌──────────────────────────────────────────────┐
│ Access Token                                 │
│ ┌──────────────────────────────────────────┐ │
│ │ TEST-1234567890-abcdef-123456-abcdef...  │ │ ← COPIA ESTO ✅
│ └──────────────────────────────────────────┘ │
│ [Ocultar] [Copiar]                            │ ← Haz clic en "Copiar"
└──────────────────────────────────────────────┘
```

## ✅ Checklist

- [ ] Encontré la sección "Credenciales de prueba"
- [ ] Veo "Public Key" (lo ignoro)
- [ ] Veo "Access Token" (este es el que necesito)
- [ ] Hice clic en "Revelar" para ver el Access Token completo
- [ ] Copié el Access Token (comienza con TEST-)
- [ ] Lo pegué en `src/services/mercadoPago.js`

## 🆘 Si No Puedes Ver el Access Token

1. **Busca un botón que diga "Revelar"** o **"Mostrar"**
2. **Haz clic en él** para ver el token completo
3. **Si no hay botón**, intenta hacer clic directamente en el campo
4. **Si aún no lo ves**, busca en otra pestaña o sección de la página

---

**Recuerda**: Necesitas el **Access Token**, NO el Public Key. Ambos empiezan con TEST-, pero el Access Token es mucho más largo y es el que necesitas para tu integración.
