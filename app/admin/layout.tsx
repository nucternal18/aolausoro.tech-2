import { AdminNavBar, AdminsSidebar } from "components";

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex md:flex-row flex-col h-screen bg-gray-100 dark:bg-gray-800 transition-height duration-75 ease-out">
      <AdminsSidebar />
      <section className="w-full f-full overflow-y-auto">{children}</section>
    </section>
  );
}
