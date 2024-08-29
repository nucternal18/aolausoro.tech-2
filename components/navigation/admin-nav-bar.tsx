"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineDashboard } from "react-icons/md";

import { currentUserSelector } from "app/global-redux-store/features/users/usersSlice";
import { useAppSelector } from "app/global-redux-store/hooks";

const AdminNavBar = () => {
  const router = useRouter();
  const currenUser = useAppSelector(currentUserSelector);
  const [pos, setPos] = useState("top");

  // Check the top position of the navigation in the window
  useEffect(() => {
    document.addEventListener("scroll", (e) => {
      const scrolled = document.scrollingElement?.scrollTop;
      if ((scrolled as number) >= 1) {
        setPos("moved");
      } else {
        setPos("top");
      }
    });
  }, []);
  return (
    <nav className=" p-6 md:flex gap-2 md:gap-5 w-full font-mono hidden shadow-xl">
      <div className="flex items-center justify-center text-gray-800 dark:text-gray-200 dark:hover:text-yellow-500 ">
        <MdOutlineDashboard fontSize={28} className="mr-2" />
        <h1 className="text-2xl font font-semibold">Dashboard</h1>
      </div>
      <div className="flex justify-end items-center w-full px-2 rounded-md text-gray-800 dark:text-gray-200 dark:hover:text-yellow-500 border-none outline-none focus-within:shadow-sm">
        {currenUser && (
          <button
            type="button"
            className="flex items-center bg-gray-800 dark:bg-yellow-500 px-4 py-2 rounded-3xl text-gray-200 shadow-xl"
            onClick={() => router.push(`/user-profile/${currenUser?.id}`)}
          >
            <p className="mr-2 capitalize text-base">{currenUser.name}</p>
            <img
              src={currenUser.image}
              alt="user-profile"
              className="w-8 h-8 rounded-full"
            />
          </button>
        )}
      </div>
    </nav>
  );
};

export default AdminNavBar;
