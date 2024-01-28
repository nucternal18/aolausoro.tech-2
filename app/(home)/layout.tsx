import { Providers } from "@app/GlobalReduxStore/providers";
import "../globals.css";
import "highlight.js/styles/github-dark.css";

import Footer from "@components/Footer";
import LayoutWrapper from "./layout-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-background">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
