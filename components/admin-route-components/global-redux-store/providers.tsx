'use client'

import { ReduxProviders } from './rtk-provider'
import { NextThemeProvider } from './theme-provider'

import { Toaster } from '@components/ui/toaster'
import { TooltipProvider } from '@components/ui/tooltip'
import { TanstackProvider } from './tanstack-provider'

// TODO(P3.2): this whole provider tree comes out when admin-route-components is deleted.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextThemeProvider>
        <TanstackProvider>
          <ReduxProviders>
            <TooltipProvider>{children}</TooltipProvider>
          </ReduxProviders>
        </TanstackProvider>
      </NextThemeProvider>
      <Toaster />
    </>
  )
}
