"use client";
import React from "react";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ProjectProps } from "lib/types";

import { useAppDispatch } from "app/GlobalReduxStore/hooks";
import { setAction } from "app/GlobalReduxStore/features/projects/projectsSlice";
import { useDeleteProjectMutation } from "app/GlobalReduxStore/features/projects/projectApiSlice";
import { toast } from "react-toastify";

function Table({ data }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      const res = await deleteProject(id).unwrap();
      if (res.success) {
        toast.success("Project deleted successfully");
      }
    } catch (error) {
      toast.error("Something went wrong.Unable to delete project");
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="relative w-full rounded-md shadow-xl  table">
        <thead className="bg-gray-50 dark:bg-yellow-500">
          <tr className="table-row  top-auto left-auto  relative">
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
                  table-cell
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
                  table-cell
                "
            >
              Status
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
                  table-cell
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
                  tracking-wider table-cell"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: ProjectProps) => (
            <tr
              key={item.id}
              className="bg-white text-gray-900 dark:text-gray-100 shadow-none dark:bg-gray-700 rounded-none group  mb-0 border-none table-row"
            >
              <td className="p-2 items-center text-left  table-cell">
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
                    <div className="text-sm font-medium ">
                      {item.projectName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4  items-center text-left whitespace-nowrap table-cell">
                <span
                  className={`
                    px-2
                    inline-flex
                    text-xs
                    leading-5
                    font-semibold
                    rounded-full
                    ${
                      item.published
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                    
                  `}
                >
                  {item.published ? "published" : "draft"}
                </span>
              </td>
              <td className="p-2 items-center text-left whitespace-nowrap table-cell">
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
                   items-center
                  p-2
                  whitespace-nowrap
                   text-sm
                  font-medium
                  table-cell
                "
              >
                <div className="flex items-center justify-around">
                  <button
                    type="button"
                    className="text-blue-500 mr-0"
                    onClick={() => {
                      router.push(`/admin/projects/${item.id}`);
                      dispatch(setAction("Update"));
                    }}
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className="text-red-500"
                    onClick={() => handleDelete(item.id as string)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
