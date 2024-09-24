import React from "react";
import {
  AdminsSidebar,
  MobileAdminSidebar,
} from "@components/navigation/admin-sidebar";

import { getUser } from "@app/actions/user";
import type { PartialUserProps } from "@src/entities/models/User";

export async function AdminLayoutWrapper({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <main className="relative h-full flex min-h-screen w-full flex-col bg-muted/40 p-0 overflow-y-auto">
      <section className="min-h-screen transition-height duration-75 ease-out">
        <section className="flex md:flex-row flex-col ">
          <div className="block bg-background px-2 md:hidden ">
            <MobileAdminSidebar user={user as PartialUserProps} />
          </div>
          <aside className="hidden md:block">
            <AdminsSidebar user={user as PartialUserProps} />
          </aside>
          <section className="w-full h-full flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 flex-grow overflow-y-auto bg-background">
            {children}
          </section>
        </section>
      </section>
    </main>
  );
}
