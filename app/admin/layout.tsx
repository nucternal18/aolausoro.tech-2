import { AdminNavBar, AdminsSidebar } from "components";

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <AdminsSidebar />

      <section className="pb-2 flex-1 h-screen overflow-y-scroll ">
        <AdminNavBar />
        <section className="w-full">{children}</section>
      </section>
    </section>
  );
}
