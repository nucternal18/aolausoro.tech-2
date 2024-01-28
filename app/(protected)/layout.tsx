import { redirect } from "next/navigation";
import { auth } from "auth";
import "../globals.css";
import "highlight.js/styles/github-dark.css";

// components
import { AdminLayoutWrapper } from "./admin-layout-wrapper";

// redux global state
import { Providers } from "@app/GlobalReduxStore/providers";

async function getSession() {
  const session = await auth();
  return session;
}

export default async function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return redirect("/auth/login");
  }
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
