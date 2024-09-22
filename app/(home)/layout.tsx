import { Providers } from "@app/global-redux-store/providers";
import "../globals.css";
import "highlight.js/styles/github-dark.css";

import { cn } from "../../lib/utils";

import Footer from "@components/Footer";
import LayoutWrapper from "./layout-wrapper";
import { Navbar } from "@components/navigation/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-background font-mono antialiased",
        )}
      >
        <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
          <Providers>
            <Navbar />
            <LayoutWrapper>{children}</LayoutWrapper>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
