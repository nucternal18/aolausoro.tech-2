import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Providers } from '@components/providers'
import { Navbar } from '@components/navigation/Navbar'
import '../globals.css'
import 'highlight.js/styles/github-dark.css'

import { cn } from '../../lib/utils'

import LayoutWrapper from './layout-wrapper'

const bebas = localFont({
  src: '../../fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: false,
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background text-foreground border-box m-0 flex flex-col scroll-smooth p-0 antialiased',
          bebas.variable,
          inter.variable,
        )}
      >
        <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
          <Providers>
            <Navbar nav={siteSettings.nav} email={siteSettings.contact.email} />
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </div>
      </body>
    </html>
  )
}
