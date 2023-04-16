import { Navbar } from "components";
import Footer from "components/Footer";
import { Providers } from "app/GlobalReduxStore/provider";
import NextAuthSessionProvider from "./GlobalReduxStore/session-provider";
import NextThemeProvider from "./GlobalReduxStore/theme-provider";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-gray-100 dark:bg-gray-900">
        <NextAuthSessionProvider>
          <NextThemeProvider>
            <Navbar textColor="dark:text-yellow-500" />
            <Providers>
              <main className="relative h-screen flex-grow p-2 md:p-0 overflow-y-auto">
                {children}
              </main>
            </Providers>
            <Footer />
          </NextThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
