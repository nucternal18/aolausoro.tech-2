import { Providers } from "@app/GlobalReduxStore/providers";
import "../globals.css";
import "highlight.js/styles/github-dark.css";

import { cn } from "../../lib/utils";

import Footer from "@components/footer";
import LayoutWrapper from "./layout-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-background font-mono antialiased min-h-[100dvh]",
        )}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
