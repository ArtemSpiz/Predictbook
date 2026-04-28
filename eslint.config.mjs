import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  }),
  { ignores: ['.next/**', 'node_modules/**', 'src/payload-types.ts', 'src/migrations/**'] },
]
