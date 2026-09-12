import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { Providers } from '@components/providers'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </div>
      </body>
    </html>
  )
}
