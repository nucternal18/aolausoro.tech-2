import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IMessageData } from "types/types";

interface MessageTableProps {
  messages: IMessageData[];
  router: AppRouterInstance;
  deleteMessage: (id: string) => void;
  isLoading: boolean;
}

export default function MessageTable({
  messages,
  router,
  deleteMessage,
  isLoading,
}: MessageTableProps) {
  return (
    <table className="w-full md:min-w-full rounded-md shadow-2xl  md:table">
      <thead className="bg-gray-50 dark:bg-yellow-500  hidden md:table-header-group">
        <tr className="md:table-row absolute  -top-full md:top-auto -left-full md:left-auto  md:relative">
          <th
            scope="col"
            className="
                  px-6
                  py-3
   
                  text-left text-xs
                  font-medium
                  text-gray-800
                  dark:text-gray-100
                  uppercase
                  tracking-wider
                  md:table-cell
                "
          >
            Subject
          </th>
          <th
            scope="col"
            className="
                  px-6
                  py-3
 
                  text-left text-xs
                  font-medium
                  text-gray-800
                  dark:text-gray-100
                  uppercase
                  tracking-wider
                  md:table-cell
                "
          >
            Name
          </th>
          <th
            scope="col"
            className="
                  px-6
                  py-3
 
                  text-left text-xs
                  font-medium
                  text-gray-800
                  dark:text-gray-100
                  uppercase
                  tracking-wider
                  md:table-cell
                "
          >
            Email
          </th>
          <th
            scope="col"
            className="
                  px-6
                  py-3
                  text-left text-xs
                  font-medium
                  text-gray-800
                  dark:text-gray-100
                  uppercase
                  tracking-wider
                  md:table-cell
                "
          >
            created at
          </th>

          <th
            scope="col"
            className="relative px-6 py-3  text-left text-xs
                  font-medium
                  text-gray-800
                  dark:text-gray-100
                  uppercase
                  tracking-wider md:table-cell"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className=" block px-1 md:px-0 md:table-row-group">
        {messages.map((item) => (
          <tr
            key={item.id}
            className="bg-white text-gray-900 dark:text-gray-100 shadow-2xl md:shadow-none dark:bg-gray-700 rounded md:rounded-none overflow-x-hidden mb-2 md:mb-0 md:border-none block md:table-row"
          >
            <td className="p-2 flex items-center text-left  md:table-cell">
              <span className="inline-block w-1/3 md:hidden font-bold dark:text-yellow-500">
                Subject
              </span>

              <div className="text-sm md:ml-4 w-2/4">{item.subject}</div>
            </td>
            <td className=" p-2 flex items-center text-left whitespace-nowrap  md:table-cell">
              <span className="inline-block w-1/3 md:hidden dark:text-yellow-500 font-bold">
                Name
              </span>
              <div className="text-sm  w-2/4">{item.name}</div>
            </td>
            <td className=" p-2 flex items-center text-left whitespace-nowrap  md:table-cell">
              <span className="inline-block w-1/3 md:hidden dark:text-yellow-500 font-bold">
                Email
              </span>
              <div className="text-sm  w-2/4">{item.email}</div>
            </td>
            <td className="p-2 flex items-center text-left whitespace-nowrap md:table-cell">
              <span className="inline-block w-1/3 md:hidden uppercase font-bold dark:text-yellow-500">
                created at
              </span>
              <span
                className="
                    px-2
                    inline-flex
                    text-xs
                    leading-5
                    font-semibold
                    rounded-full
                    bg-green-100
                    text-green-800
                  "
              >
                {new Date(item.createdAt as string).toDateString()}
              </span>
            </td>

            <td
              className="
                      flex items-center
                  p-2
                    text-left 
                  whitespace-nowrap
                   text-sm
                  font-medium
                  md:table-cell
                "
            >
              <span className="inline-block w-1/3 md:hidden font-bold dark:text-yellow-500">
                Action
              </span>
              <div className="flex items-center ml-4">
                <button
                  type="button"
                  className="text-blue-500 mr-4 "
                  onClick={() => router.push(`/admin/messages/${item.id}`)}
                >
                  <FaEdit className="text-lg" />
                </button>
                <button
                  type="button"
                  className="text-red-500"
                  disabled={isLoading}
                  onClick={() => deleteMessage(item.id as string)}
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
