"use client";

import { ReduxProviders } from "./rtk-provider";
import { NextThemeProvider } from "./theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@components/ui/toaster";
import { TooltipProvider } from "@components/ui/tooltip";
import { TanstackProvider } from "./tanstack-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextThemeProvider>
        <ClerkProvider>
          <TanstackProvider>
            <ReduxProviders>
              <TooltipProvider>{children}</TooltipProvider>
            </ReduxProviders>
          </TanstackProvider>
        </ClerkProvider>
      </NextThemeProvider>
      <Toaster />
    </>
  );
}
