import { Access } from 'payload'

// Tüm yöneticiler girebilir
export const isAnyAdmin: Access = ({ req: { user } }) => {
  return Boolean(user)
}

// Sadece sistem yöneticisi (admin) girebilir
export const isSuperAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

// Admin veya İçerik Editörü
export const isEditorOrAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}

// Sadece Şube kendi siparişlerini görsün, Mutfak ve Admin hepsini görsün
export const orderAccess: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'kitchen' || user.role === 'editor') {
    return true; // Admin, mutfak ve editör tüm siparişleri görebilir
  }
  if (user.role === 'branch' && user.branch) {
    // Şube sadece kendi "Gel-Al" siparişlerini görebilir (Geliştirilebilir)
    return {
      pickupBranch: {
        equals: user.branch,
      }
    }
  }
  return false;
}
