import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
import './custom.scss'
import { importMap } from './admin/[[...segments]]/importMap.js'

type Args = { children: React.ReactNode }

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
