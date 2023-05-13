"use client";

import { ReduxProviders } from "./rtk-provider";
import { NextAuthSessionProvider } from "./session-provider";
import { NextThemeProvider } from "./theme-provider";
import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <NextAuthSessionProvider>
        <NextThemeProvider>
          <ReduxProviders>{children}</ReduxProviders>
        </NextThemeProvider>
      </NextAuthSessionProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  );
}
