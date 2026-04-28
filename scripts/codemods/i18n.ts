import { type SourceFile, type ObjectLiteralExpression, Node, SyntaxKind } from 'ts-morph'

const DENYLIST = new Set([
  'slug',
  'email',
  'url',
  'phone',
  '_status',
  'role',
  'password',
  'id',
  'key',
  'code',
  'provider',
  'iconName',
  'staticURL',
])

const LOCALIZABLE_TYPES = new Set(['text', 'textarea', 'richText', 'select'])

export interface CodemodOptions {
  mode: 'add' | 'remove'
  skipFields: string[]
  forceFields: string[]
  skipCollections: string[]
}

function getStringProp(obj: ObjectLiteralExpression, name: string): string | undefined {
  const prop = obj.getProperty(name)
  if (!prop || !Node.isPropertyAssignment(prop)) return undefined
  const init = prop.getInitializer()
  if (!init || !Node.isStringLiteral(init)) return undefined
  return init.getLiteralValue()
}

function getBoolProp(obj: ObjectLiteralExpression, name: string): boolean {
  const prop = obj.getProperty(name)
  if (!prop || !Node.isPropertyAssignment(prop)) return false
  const init = prop.getInitializer()
  return init?.getKind() === SyntaxKind.TrueKeyword
}

function shouldLocalize(
  field: ObjectLiteralExpression,
  collectionSlug: string,
  opts: CodemodOptions,
): boolean {
  const name = getStringProp(field, 'name')
  const type = getStringProp(field, 'type')
  if (!name || !type) return false

  const fqName = `${collectionSlug}.${name}`
  if (opts.forceFields.includes(fqName)) return true
  if (opts.skipFields.includes(fqName)) return false
  if (DENYLIST.has(name)) return false
  if (getBoolProp(field, 'unique')) return false
  if (!LOCALIZABLE_TYPES.has(type)) return false
  return true
}

function walkFieldArray(
  arrayExpr: Node,
  collectionSlug: string,
  opts: CodemodOptions,
): void {
  if (!Node.isArrayLiteralExpression(arrayExpr)) return

  for (const element of arrayExpr.getElements()) {
    if (!Node.isObjectLiteralExpression(element)) continue

    const type = getStringProp(element, 'type')

    if (type === 'array' || type === 'group') {
      const nestedFieldsProp = element.getProperty('fields')
      if (nestedFieldsProp && Node.isPropertyAssignment(nestedFieldsProp)) {
        const init = nestedFieldsProp.getInitializer()
        if (init) walkFieldArray(init, collectionSlug, opts)
      }
      continue
    }

    if (type === 'tabs') {
      const tabsProp = element.getProperty('tabs')
      if (tabsProp && Node.isPropertyAssignment(tabsProp)) {
        const tabsArray = tabsProp.getInitializer()
        if (tabsArray && Node.isArrayLiteralExpression(tabsArray)) {
          for (const tab of tabsArray.getElements()) {
            if (Node.isObjectLiteralExpression(tab)) {
              const tabFields = tab.getProperty('fields')
              if (tabFields && Node.isPropertyAssignment(tabFields)) {
                const init = tabFields.getInitializer()
                if (init) walkFieldArray(init, collectionSlug, opts)
              }
            }
          }
        }
      }
      continue
    }

    const wantLocalized = shouldLocalize(element, collectionSlug, opts)
    const hasLocalized = element.getProperty('localized') !== undefined

    if (opts.mode === 'add' && wantLocalized && !hasLocalized) {
      element.addPropertyAssignment({ name: 'localized', initializer: 'true' })
    }
    if (opts.mode === 'remove' && hasLocalized) {
      const prop = element.getProperty('localized')
      if (prop) prop.remove()
    }
  }
}

export function applyI18nCodemod(
  file: SourceFile,
  collectionSlug: string,
  opts: CodemodOptions,
): void {
  if (opts.skipCollections.includes(collectionSlug)) return

  const exportSyms = file.getExportSymbols()
  for (const sym of exportSyms) {
    const decl = sym.getDeclarations()[0]
    if (!decl) continue
    if (Node.isVariableDeclaration(decl)) {
      const init = decl.getInitializer()
      if (init && Node.isObjectLiteralExpression(init)) {
        const fieldsProp = init.getProperty('fields')
        if (fieldsProp && Node.isPropertyAssignment(fieldsProp)) {
          const arr = fieldsProp.getInitializer()
          if (arr) walkFieldArray(arr, collectionSlug, opts)
        }
      }
    }
  }

  file.saveSync()
}
