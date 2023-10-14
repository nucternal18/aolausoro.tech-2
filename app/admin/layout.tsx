import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "app/api/auth/[...nextauth]/route";
import AdminsSidebar from "@components/navigation/AdminsSidebar";

async function getSession() {
  const session = await getServerSession(authOptions);
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
    <section className="flex md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <AdminsSidebar />
      <section className="w-full f-full overflow-y-auto bg-background">
        {children}
      </section>
    </section>
  );
}
