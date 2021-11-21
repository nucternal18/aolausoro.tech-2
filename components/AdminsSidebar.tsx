import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaNewspaper, FaTimes, FaUserCircle } from "react-icons/fa";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";
import ActiveLink from "./ActiveLink";

import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";

function AdminsSidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [collapseShow, setCollapseShow] = useState("hidden");

  const { logoutHandler } = useAuth();

  const handleLogout = () => {
    logoutHandler();
    router.push("/");
  };
  return (
    <aside className="relative z-10 flex flex-wrap items-center justify-between px-6 py-4 bg-white dark:bg-gray-900  shadow-xl md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden md:w-64">
      <nav className="flex flex-wrap items-center justify-between w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap">
        {/* Toggler */}
        <button
          className="px-3 py-1 text-xl leading-none text-gray-900 dark:text-yellow-500 bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
          type="button"
          onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
        >
          <FaBars />
        </button>
        {/* Brand */}
        <div className="flex items-center justify-between p-2   text-gray-900 uppercase dark:text-yellow-500">
          <Link href="/">
            <a
              href="#pablo"
              className="text-xl uppercase whitespace-no-wrap font-bold text-left "
            >
              DashBoard
            </a>
          </Link>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1 ml-4 font-medium list-none border-2 border-current rounded-full cursor-pointer md:block lg:ml-0 lg:mb-0 lg:p-1 lg:px-1 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent"
          >
            {theme === "light" ? (
              <FiSun className="text-lg font-bold " />
            ) : (
              <FiMoon className="font-semibold " />
            )}
          </button>
        </div>

        {/* Collapse */}
        <div
          className={
            "md:flex md:flex-col md:items-stretch md:opacity-100 dark:bg-gray-900  md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
            collapseShow
          }
        >
          {/* Collapse header */}
          <div className="block pb-4 mb-4 border-b  border-gray-300 border-solid md:min-w-full md:hidden">
            <div className="flex ">
              <div className="flex items-center justify-between w-6/12  p-2   text-gray-900 dark:text-yellow-500">
                <Link href="/">
                  <a
                    href="#pablo"
                    className="text-xl uppercase whitespace-no-wrap font-bold text-left  md:pb-2"
                  >
                    DashBoard
                  </a>
                </Link>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-1 ml-4 font-medium list-none border-2 border-current rounded-full cursor-pointer md:block lg:ml-0 lg:mb-0 lg:p-1 lg:px-1 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent"
                >
                  {theme === "light" ? (
                    <FiSun className="text-lg font-bold " />
                  ) : (
                    <FiMoon className="font-semibold " />
                  )}
                </button>
              </div>
              <div className="flex justify-end w-6/12">
                <button
                  type="button"
                  className="px-3 py-1 text-xl leading-none  bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
                  onClick={() => setCollapseShow("hidden")}
                >
                  <FaTimes className="text-gray-900 dark:text-yellow-500" />
                </button>
              </div>
            </div>
          </div>
          {/* Form */}
          <form className="mt-6 mb-4 md:hidden">
            <div className="pt-0 mb-3">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-12 px-3 py-2 text-base font-normal leading-snug text-gray-200 placeholder-gray-400 bg-gray-200 border border-gray-600 border-solid rounded shadow-none outline-none focus:outline-none"
              />
            </div>
          </form>

          {/* Divider */}
          <hr className="my-4 md:min-w-full " />
          {/* Navigation */}

          <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 ">
            <li className="items-center justify-center">
              <ActiveLink href="/admin">
                <FaNewspaper className="mr-2 text-sm" />
                Admin Home
              </ActiveLink>
            </li>

            <li className="flex flex-row items-center">
              <ActiveLink href="/admin/projects">
                <FaUserCircle className="mr-2 text-sm" />
                Manage Projects
              </ActiveLink>
            </li>
          </ul>

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />
          <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4">
            <li className="items-center">
              <button type="button" className="" onClick={handleLogout}>
                <p className="flex flex-row py-3 text-xs font-bold text-gray-900 uppercase hover:text-yellow-500 dark:text-gray-100">
                  <FiLogOut className="mr-2 text-sm" /> Logout
                </p>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default AdminsSidebar;
