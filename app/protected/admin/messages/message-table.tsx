import { DataTable } from "@components/data-table/data-table";
import type { PartialMessageProps } from "@src/entities/models/Message";
import { columns } from "./table-columns";

interface MessageTableProps {
  messages: PartialMessageProps[];
}

export default function MessageTable({ messages }: MessageTableProps) {
  return (
    <>
      <DataTable columns={columns} data={messages} name="messages" />
    </>
  );
}
