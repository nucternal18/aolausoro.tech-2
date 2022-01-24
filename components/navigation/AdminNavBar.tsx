import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { MdOutlineDashboard } from "react-icons/md";

// context
import { useGlobalApp } from "context/appContext";

const AdminNavBar = () => {
  const router = useRouter();
  const { state } = useGlobalApp();
  return (
    <nav className="p-6 md:flex gap-2 md:gap-5 w-full hidden shadow-xl bg-white dark:bg-gray-900 ">
      <div className="flex items-center justify-center text-gray-800 dark:text-gray-200 dark:hover:text-yellow-500 ">
        <MdOutlineDashboard fontSize={28} className="mr-2" />
        <h1 className="text-2xl font font-semibold">Dashboard</h1>
      </div>
      <div className="flex justify-end items-center w-full px-2 rounded-md text-gray-800 dark:text-gray-200 dark:hover:text-yellow-500 border-none outline-none focus-within:shadow-sm">
        {state.userData && (
          <button
            type="button"
            className="flex items-center bg-gray-800 dark:bg-yellow-500 px-4 py-2 rounded-3xl text-gray-200 shadow-xl"
            onClick={() => router.push(`/user-profile/${state.userData.id}`)}
          >
            <p className="mr-2 capitalize text-base">{state.userData.name}</p>
            <img
              src={state.userData.image}
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
