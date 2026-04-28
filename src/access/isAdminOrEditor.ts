import type { Access } from 'payload'

export const isAdminOrEditor: Access = ({ req }) => {
  if (!req.user) return false
  const role = (req.user as { role?: string }).role
  return role === 'admin' || role === 'editor'
}
