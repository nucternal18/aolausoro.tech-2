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
    <main>
      <div className="block md:hidden">
        <MobileNavbar height={windowSize?.innerHeight as number} />
      </div>
      <main>{children}</main>
    </main>
  );
}
