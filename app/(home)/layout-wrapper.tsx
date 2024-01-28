"use client";

import React from "react";
import { Navbar, MobileNavbar } from "@components/navigation/Navbar";
import { useWindowSize } from "@hooks/useWindowSize";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { windowSize } = useWindowSize();
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar height={windowSize?.innerHeight as number} />
      </div>
      <main className="relative h-full flex-grow p-0 overflow-y-auto">
        {children}
      </main>
    </>
  );
}
