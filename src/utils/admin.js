// Utilidades para verificar si un usuario es administrador

// Lista de emails de administradores
// Agrega aquí tu email para tener acceso al panel de administración
const ADMIN_EMAILS = [
  'mateogaete214@gmail.com', // Reemplaza con tu email real
  // Puedes agregar más emails de administradores aquí
]

// Lista de UIDs de administradores (opcional, más seguro)
// Puedes obtener tu UID desde Firebase Console > Authentication > Users
const ADMIN_UIDS = [
  // 'tu-uid-aqui', // Descomenta y agrega tu UID si prefieres usar UID en lugar de email
]

/**
 * Verifica si un usuario es administrador
 * @param {Object} user - Objeto de usuario de Firebase Auth
 * @returns {boolean} - true si el usuario es admin, false si no
 */
export const isAdmin = (user) => {
  if (!user) return false

  // Verificar por email
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true
  }

  // Verificar por UID (más seguro)
  if (user.uid && ADMIN_UIDS.includes(user.uid)) {
    return true
  }

  return false
}

/**
 * Obtiene la lista de emails de administradores
 * @returns {Array} - Lista de emails de admin
 */
export const getAdminEmails = () => {
  return ADMIN_EMAILS
}
