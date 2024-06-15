"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type React from "react";
import { cn } from "@lib/utils";

function ActiveLink({
  children,
  href,
  className,
  currentHref,
}: {
  children: React.ReactNode;
  href: string;
  currentHref: string;
  className?: string;
}) {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center flex-row py-3 text-sm font-thin  capitalize",
        pathName === currentHref
          ? "text-yellow-500"
          : "text-primary hover:text-yellow-500",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export default ActiveLink;
