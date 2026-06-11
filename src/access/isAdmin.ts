import { Access } from 'payload'

// Sadece giriş yapmış olan 'users' (Adminler) erişebilir
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user)
}
