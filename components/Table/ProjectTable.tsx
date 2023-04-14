"use client";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

function Table({ data }) {
  const router = useRouter();

  return (
    <table className="w-full md:min-w-full rounded-md shadow-xl  md:table">
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
            Project Name
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
            Github
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
          {/* <th
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
                    Status
                  </th> */}

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
        {data.map((item) => (
          <tr
            key={item._id}
            className="bg-white text-gray-900 dark:text-gray-100 shadow-2xl md:shadow-none dark:bg-gray-700 rounded md:rounded-none overflow-x-hidden mb-2 md:mb-0 md:border-none block md:table-row"
          >
            <td className="p-2 flex items-center text-left  md:table-cell">
              <span className="inline-block w-1/3 md:hidden font-bold dark:text-yellow-500">
                Project Name
              </span>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <Image
                    src={item.url}
                    alt={""}
                    width={70}
                    height={70}
                    className="rounded-lg"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium ">{item.projectName}</div>
                </div>
              </div>
            </td>
            <td className=" p-2 flex items-center text-left whitespace-nowrap  md:table-cell">
              <span className="inline-block w-1/3 md:hidden dark:text-yellow-500 font-bold">
                Github
              </span>
              <div className="text-sm truncate w-2/4">{item.github}</div>
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
                {new Date(item.createdAt).toDateString()}
              </span>
            </td>
            {/* <td className="px-6 py-4  flex items-center text-left whitespace-nowrap md:table-cell">
                      <span className="inline-block w-1/3 md:hidden uppercase font-bold dark:text-yellow-500">
                        status
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
                        Active
                      </span>
                    </td> */}

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
              <div className="flex items-center md:justify-around">
                <button
                  type="button"
                  className="text-blue-500 mr-4 md:mr-0"
                  onClick={() => router.push(`/admin/projects/${item._id}`)}
                >
                  <FaEdit className="text-lg" />
                </button>
                <button type="button" className="text-red-500">
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

export default Table;
