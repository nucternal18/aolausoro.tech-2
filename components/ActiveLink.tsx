"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

function ActiveLink({ children, href }) {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <Link
      href={href}
      className={`${
        pathName === href
          ? "text-yellow-500"
          : "text-gray-900 hover:text-yellow-500 dark:text-gray-100"
      } flex items-center flex-row py-3 text-lg font-thin text-gray-800 capitalize hover:text-gray-600`}
    >
      {children}
    </Link>
  );
}

export default ActiveLink;
