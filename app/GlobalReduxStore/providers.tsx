"use client";

import { ReduxProviders } from "./rtk-provider";
import { NextThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <NextThemeProvider>
        <ClerkProvider>
          <ReduxProviders>{children}</ReduxProviders>
        </ClerkProvider>
      </NextThemeProvider>
      <Toaster />
    </>
  );
}
