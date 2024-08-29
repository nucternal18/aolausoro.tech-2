"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { FaCheck, FaTimes } from "react-icons/fa";
import { ArrowUpDown, Pen } from "lucide-react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";

// components
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";

import HandleDeleteModal from "@components/handle-delete-modal/HandleDeleteModal";

// hooks (Controller)
import useProjectController from "./use-project-controller";
import type { PartialProjectProps } from "schema/Project";
import { DataTableRowActions } from "@components/data-table/data-table-row-actions";

export const columns: ColumnDef<PartialProjectProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center justify-start space-x-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-sm border-2 border-primary-dark-200 p-1">
            <Image
              src={project.url as string}
              alt={project.projectName as string}
              fill
              sizes="(min-width: 640px) 100px, 50px"
            />
          </div>
          <div className="text-xs font-semibold sm:text-base ">
            <p>{project?.projectName}</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "published",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const published = row.getValue("published");
      return (
        <div className="flex items-center justify-center">
          {published ? (
            <FaCheck className="text-green-400" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <h3>Last Updated</h3>
        </div>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt");
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-lg bg-primary-dark-200 px-2 py-1 text-xs text-primary shadow-lg">
            <p>
              {format(new Date(updatedAt as string), "MM/dd/yyyy HH:mm:ss", {
                locale: enGB,
              })}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const project = row.original;
      const router = useRouter();
      const { deleteProjectHandler } = useProjectController();

      return (
        <DataTableRowActions
          row={row}
          enableEditItem
          editItem={
            <Button
              variant="ghost"
              onClick={() => router.push(`admin/projects/${project.id}`)}
            >
              <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit
            </Button>
          }
          enableDeleteItem
          deleteItem={
            <HandleDeleteModal
              deleteHandler={deleteProjectHandler}
              id={project.id as string}
            />
          }
        />
      );
    },
  },
];
