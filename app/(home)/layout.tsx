import localFont from 'next/font/local'
import { Providers } from '@components/admin-route-components/global-redux-store/providers'
import '../globals.css'
import 'highlight.js/styles/github-dark.css'

import { cn } from '../../lib/utils'

import LayoutWrapper from './layout-wrapper'

const bebasNeue = localFont({
  src: '../../fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas-neue',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-bebas-neue text-primary border-box bg-background m-0 flex flex-col scroll-smooth p-0 antialiased',
          bebasNeue.variable,
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
