"use client";
import { ThemeProvider, useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export default function NextThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <ThemeProvider attribute="class">
      {children}
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
    </ThemeProvider>
  );
}
