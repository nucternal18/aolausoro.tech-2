"use client";

import React from "react";
import {
  AdminsSidebar,
  MobileAdminSidebar,
} from "@components/navigation/AdminsSidebar";

import { useWindowSize } from "@hooks/useWindowSize";
import { Navbar } from "@components/navigation/Navbar";

export function AdminLayoutWrapper({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { windowSize } = useWindowSize();
  return (
    <main className="relative h-full flex-grow p-0 overflow-y-auto">
      <section className="min-h-screen transition-height duration-75 ease-out">
        <div>
          <div className="hidden md:block">
            <Navbar />
          </div>
        </div>
        <section className="flex md:flex-row flex-col ">
          <div className="block bg-background px-2 md:hidden ">
            <MobileAdminSidebar height={windowSize?.innerHeight as number} />
          </div>
          <aside className="hidden md:block">
            <AdminsSidebar />
          </aside>
          <section className="w-full h-full flex-grow overflow-y-auto bg-background">
            {children}
          </section>
        </section>
      </section>
    </main>
  );
}
