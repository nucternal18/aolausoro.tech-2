import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { AdminNavBar, AdminsSidebar } from "components";
import { authOptions } from "app/api/auth/[...nextauth]/route";

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
      <section className="w-full f-full overflow-y-auto bg-slate-100 dark:bg-slate-800">
        {children}
      </section>
    </section>
  );
}
