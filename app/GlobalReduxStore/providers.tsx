"use client";

import { ReduxProviders } from "./rtk-provider";
import { NextAuthSessionProvider } from "./session-provider";
import { NextThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";

import { Toaster } from "@components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <NextAuthSessionProvider>
        <NextThemeProvider>
          <ReduxProviders>{children}</ReduxProviders>
        </NextThemeProvider>
      </NextAuthSessionProvider>
      <Toaster />
    </>
  );
}
