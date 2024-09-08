"use client";

import { ReduxProviders } from "./rtk-provider";
import { NextThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@components/ui/toaster";
import { TooltipProvider } from "@components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <NextThemeProvider>
        <ClerkProvider>
          <ReduxProviders>
            <TooltipProvider>{children}</TooltipProvider>
          </ReduxProviders>
        </ClerkProvider>
      </NextThemeProvider>
      <Toaster />
    </>
  );
}
