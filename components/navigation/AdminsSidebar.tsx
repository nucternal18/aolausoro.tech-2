import { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaHome,
  FaTimes,
  FaUserCircle,
  FaMailBulk,
  FaRegCalendarAlt,
  FaRegCalendarPlus,
} from "react-icons/fa";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import ActiveLink from "../ActiveLink";

import { ActionType, useAuth } from "../../context/authContext";
import { useRouter } from "next/router";

function AdminsSidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useAuth();
  const [collapseShow, setCollapseShow] = useState("hidden");

  const handleLogout = () => {
    signOut();
    dispatch({ type: ActionType.USER_LOGOUT_SUCCESS });
    router.push("/");
  };

  const handleCloseSidebar = () => {};
  return (
    <aside className="z-10  flex flex-initial px-2 py-4 bg-white md:h-full dark:bg-gray-900  shadow-xl md:shadow-none md:left-0  md:top-0 md:bottom-0 md:overflow-y-scroll  md:overflow-hidden md:w-64 ">
      <nav className="flex flex-wrap items-center justify-between min-w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap">
        {/* Toggler */}
        <div className="flex justify-between items-center w-full">
          <button
            className="px-3 py-1 text-xl leading-none text-gray-900 dark:text-gray-100 dark:hover:text-yellow-500 bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <FaBars fontSize={21} />
          </button>
          <div className=" p-2   text-gray-900 uppercase dark:text-gray-200 dark:hover:text-yellow-500">
            <Link href="/">
              <a
                href="#pablo"
                className="flex items-center justify-between text-xl capitalize whitespace-no-wrap font-bold text-left "
              >
                <img
                  src={"/android-chrome-512x512.png"}
                  alt="logo"
                  className="h-8 w-8"
                />
                <span className="ml-1">aolausoro.tech</span>
              </a>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1 ml-4 font-medium list-none border-2 border-current rounded-full cursor-pointer text-gray-900 dark:text-gray-200 dark:hover:text-yellow-500 md:block lg:ml-0 lg:mb-0 lg:p-1 lg:px-1 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent"
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
            "md:flex md:flex-col md:items-stretch md:opacity-100 dark:bg-gray-900 w-full md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto flex-1 rounded " +
            collapseShow
          }
        >
          {/* Collapse header */}
          <div className="block pb-4 mb-4 border-b  border-gray-300 border-solid md:min-w-full md:hidden">
            <div className="flex justify-between w-full">
              <div className="flex items-center text-gray-900 dark:text-gray-200 hover:text-yellow-500">
                <Link href="/">
                  <a
                    href="#pablo"
                    className="flex items-center text-xl uppercase whitespace-no-wrap font-bold text-left  md:pb-2"
                  >
                    <img
                      src={"/android-chrome-512x512.png"}
                      alt="logo"
                      className="h-8 w-8"
                    />
                    <span className="ml-1">aolausoro.tech</span>
                  </a>
                </Link>
              </div>
              <div className="flex items-center justify-end w-full md:hidden">
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 list-none border-2 mr-4 border-current rounded-full cursor-pointer  focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent text-gray-900 dark:text-gray-200 hover:text-yellow-500"
                >
                  {theme === "light" ? (
                    <FiSun fontSize={18} />
                  ) : (
                    <FiMoon fontSize={18} />
                  )}
                </button>
                <button
                  type="button"
                  className=" text-xl leading-none  bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer "
                  onClick={() => setCollapseShow("hidden")}
                >
                  <FaTimes className="text-gray-900 dark:text-gray-100 dark:hover:text-yellow-500" />
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
          <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 px-1">
            <li>
              <ActiveLink href="/admin">
                <FaHome fontSize={18} className="mr-2 " />
                <span>Admin Home</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink href="/admin/projects">
                <FaUserCircle fontSize={18} className="mr-2 " />
                <span>Manage Projects</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/admin/messages">
                <FaMailBulk fontSize={18} className="mr-2 " />
                <span>Messages</span>
              </ActiveLink>
            </li>
          </ul>

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />

          <h2
            className="text-base pl-1
          font-semibold
          tracking-widest
          uppercase
          text-gray-900 dark:text-gray-300 dark:hover:text-yellow-500
          "
          >
            Jobs
          </h2>
          <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 px-1">
            <li>
              <ActiveLink href="/admin/jobs">
                <FaRegCalendarAlt fontSize={18} className="mr-2 " />
                <span>All Jobs</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/admin/jobs/add-job">
                <FaRegCalendarPlus fontSize={18} className="mr-2 " />
                <span>Add Jobs</span>
              </ActiveLink>
            </li>
          </ul>

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />
          <ul className="flex flex-col list-none md:min-w-full md:mb-4 px-1">
            <li>
              <button
                type="button"
                className="flex items-center text-gray-900 uppercase  hover:text-gray-500 dark:hover:text-yellow-500 dark:text-gray-200"
                onClick={handleLogout}
              >
                <FiLogOut fontSize={18} className="mr-2" />
                <p className="flex flex-row py-3 text-lg ">Logout</p>
              </button>
            </li>
            <li className="px-1 content-end flex md:hidden">
              {state.userData && (
                <Link href={`/user-profile/${state.userData.id}`}>
                  <a
                    className="flex flex-end my-5 mb-3 gap-2 p-1 items-center  bg-gray-900 dark:bg-yellow-500 rounded-3xl w-full shadow-xl px-2 text-gray-200 uppercase hover:text-gray-300 "
                    onClick={handleCloseSidebar}
                  >
                    <img
                      src={state.userData.image}
                      alt="user-profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <p>{state.userData.name}</p>
                  </a>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default AdminsSidebar;
