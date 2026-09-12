'use client'

import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@components/ui/tooltip'
import { Toaster } from '@components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
      <Toaster />
    </>
  )
}
