import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req }) => {
  return Boolean(req.user && (req.user as { role?: string }).role === 'admin')
}

export const isAdminFieldLevel: FieldAccess = ({ req }) => {
  return Boolean(req.user && (req.user as { role?: string }).role === 'admin')
}
