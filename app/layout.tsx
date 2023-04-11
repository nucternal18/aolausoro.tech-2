import { Navbar } from "components";
import Footer from "components/Footer";
import { Providers } from "app/GlobalReduxStore/provider";
import "./globals.css";
import NextAuthSessionProvider from "./GlobalReduxStore/session-provider";
import NextThemeProvider from "./GlobalReduxStore/theme-provider";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="border-box h-screen flex flex-col p-0 m-0 text-gray-800 bg-white dark:bg-gray-900">
        <NextAuthSessionProvider>
          <NextThemeProvider>
            <Providers>
              <Navbar textColor="dark:text-yellow-500" />
              <main className="h-full flex-grow ">{children}</main>
            </Providers>
            <Footer />
          </NextThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
