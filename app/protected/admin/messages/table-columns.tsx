"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

// components
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";

import HandleDeleteModal from "@components/handle-delete-modal/HandleDeleteModal";

// hooks (Controller)
import { useMessagesController } from "./use-messages-controller";
import { DataTableRowActions } from "@components/data-table/data-table-row-actions";
import type { PartialMessageProps } from "schema/Message";
import ViewMessageComponents from "./view-message";

export const columns: ColumnDef<PartialMessageProps>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "from",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            from
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "subject",
    cell: ({ row }) => {
      const message = row.original;
      return (
        <ViewMessageComponents message={message}>
          <div className="space-y-1">
            <p
              className={`font-medium text-gray-600 dark:text-gray-500 text-left text-base md:text-lg`}
            >
              {message?.subject}
            </p>

            <p
              className={`text-gray-700 whitespace-wrap text-ellipsis text-left text-xs md:text-sm`}
            >
              {message?.message}
            </p>
          </div>
        </ViewMessageComponents>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <div className="flex items-center justify-start">
          <div className="flex items-center justify-center rounded-lg bg-primary-dark-200 px-2 py-1 text-xs text-white shadow-lg">
            <p>
              {format(new Date(createdAt as unknown as string), "PPP", {
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
      const { deleteMessageHandler } = useMessagesController();

      return (
        <DataTableRowActions
          row={row}
          enableDeleteItem
          deleteItem={
            <HandleDeleteModal
              deleteHandler={deleteMessageHandler}
              id={project.id as string}
            />
          }
        />
      );
    },
  },
];
