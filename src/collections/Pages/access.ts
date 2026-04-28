import type { Access } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const pagesReadAccess: Access = ({ req }) => {
  const role = (req.user as { role?: string })?.role
  if (role === 'admin' || role === 'editor') return true
  return { _status: { equals: 'published' } }
}

export const pagesWriteAccess = isAdminOrEditor
