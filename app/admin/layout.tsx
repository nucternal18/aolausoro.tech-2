import { AdminNavBar, AdminsSidebar } from "components";

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex md:flex-row flex-col h-full transition-height duration-75 ease-out">
      <AdminsSidebar />

      <section className=" flex-1 h-full overflow-y-scroll ">
        <section className="w-full">{children}</section>
      </section>
    </section>
  );
}
