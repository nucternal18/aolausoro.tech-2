"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";

type NavLinkProps = {
  children: ReactNode;
  left?: boolean;
  right?: boolean;
  center?: boolean;
};

const Nav = ({
  bgColor,
  children,
}: {
  bgColor: string;
  children: ReactNode;
}) => <nav className={`${bgColor} md:px-6 md:py-1 z-50`}>{children}</nav>;

Nav.Container = ({
  children,
  textColor,
}: {
  textColor: string;
  children: ReactNode;
}) => (
  <div
    className={` ${textColor} container mx-auto font-semibold md:relative md:flex m-0  md:items-center sm:px-1 md:px-0 md:flex-row md:justify-between sm:max-w-screen-xl z-50`}
  >
    {children}
  </div>
);
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Brand = ({ children, href }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="hidden md:block  p-0 m-0 py-1.5 mr-2 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400"
  >
    {children}
  </Link>
);

Nav.Toggler = ({
  toggle,
  isOpen,
  color,
}: {
  toggle(): void;
  isOpen: boolean;
  color: string;
}) => (
  <div className="text-current ">
    <button
      type="button"
      aria-expanded="false"
      aria-disabled={isOpen}
      disabled={isOpen}
      aria-label="Toggle navigation"
      className={` font-semibold m-0 items-center ml-3  text-4xl text-current md:hidden focus:outline-none focus:shadow-none ${color} text-slate-800 dark:text-yellow-500`}
      onClick={toggle}
    >
      <span>&#8801;</span>
    </button>
  </div>
);

Nav.SideNav = ({
  isOpen,
  toggle,
  children,
}: {
  toggle(arg?: boolean): void;
  isOpen: boolean;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (!isOpen) return;
        toggle(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, ref]);
  return (
    <aside
      className={
        isOpen
          ? `${className.default} ${className.enabled}`
          : `${className.default} ${className.disabled}`
      }
      ref={ref}
    >
      <div className="flex flex-row items-center justify-between px-4 mb-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className=" p-1 mt-2 ml-4 font-medium list-none border-2 rounded-full cursor-pointer dark:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent focus:shadow-none"
        >
          {theme === "light" ? (
            <FiSun className="font-semibold text-white" />
          ) : (
            <FiMoon className="font-semibold text-yellow-500" />
          )}
        </button>
        <button
          aria-label="Close"
          className="z-50 p-1 text-4xl cursor-pointer top-3 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent focus:shadow-none"
          onClick={() => toggle(false)}
        >
          &times;
        </button>
      </div>
      <div className=" px-4 mb-2 space-y-2">{children}</div>
    </aside>
  );
};

Nav.NavLinks = ({ children, left, right, center }: NavLinkProps) => {
  const className = left
    ? "hidden  pl-0 mb-0 mr-auto md:flex md:items-center md:pl-0 md:mb-0"
    : right
    ? "hidden  pl-0 mb-0 ml-auto md:flex md:items-center md:pl-0 md:mb-0 "
    : center
    ? "hidden  pl-0 mb-0 ml-auto md:flex md:pl-0 md:mb-0 md:mx-auto "
    : "hidden  pl-0 mb-0 mr-auto md:flex md:pl-0 md:mb-0";
  return <ul className={className}>{children}</ul>;
};

Nav.Item = ({ children }: { children: ReactNode }) => (
  <li className="z-50 flex px-2 py-1 mb-1 text-lg font-medium list-none cursor-pointer sm:block md:ml-0 md:mb-0 md:py-1 md:px-1">
    {children}
  </li>
);
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Link = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link
    href={href}
    className="z-50 flex px-2 py-1 mb-1 text-lg font-medium list-none cursor-pointer sm:block md:ml-0 md:mb-0 md:py-1 md:px-1"
  >
    {children}
  </Link>
);

const className = {
  default: `lg:hidden flex flex-col h-screen fixed top-0 right-0 transition-all ease-in-out duration-300 text-gray-100 dark:text-yellow-500`,
  enabled: `w-8/12  bg-gray-800 overflow-y-hidden translate-y-0   text-lg  py-4`,
  disabled: `w-0  bg-gray-800 text-white overflow-x-hidden translate-x-full`,
};

export default Nav;
