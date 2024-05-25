import { auth } from "@clerk/nextjs/server";
import "../globals.css";
import "highlight.js/styles/github-dark.css";

// components
import { AdminLayoutWrapper } from "./admin-layout-wrapper";

// redux global state
import { Providers } from "@app/GlobalReduxStore/providers";

export default async function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  auth().protect();
  return (
    <html lang="en">
      <body className="border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-background">
        <Providers>
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
