"use client";

// components
import MessageTable from "@components/admin-route-components/messages/message-table";

// zod schemas
import type { PartialMessageProps } from "@src/entities/models/Message";

export function MessagesComponent({
  messages,
}: {
  messages: PartialMessageProps[];
}) {
  return (
    <>
      <MessageTable messages={messages} />
    </>
  );
}
