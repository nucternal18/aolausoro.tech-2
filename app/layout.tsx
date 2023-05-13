import { Navbar } from "components";
import Footer from "components/Footer";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./GlobalReduxStore/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-slate-100 dark:bg-slate-900">
        <Providers>
          <Navbar textColor="dark:text-yellow-500" />
          <main className="relative h-full flex-grow p-0 overflow-y-auto">
            {children}
          </main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
