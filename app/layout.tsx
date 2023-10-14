import { Providers } from "./GlobalReduxStore/providers";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "highlight.js/styles/github-dark.css";

import Footer from "@components/Footer";
import Navbar from "@components/navigation/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-background">
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
