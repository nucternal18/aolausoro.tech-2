"use client";

// components
import MessageTable from "@app/protected/admin/messages/message-table";
import Loader from "../../../../components/loader";

// controller
import { useMessagesController } from "./use-messages-controller";

// zod schemas
import type { PartialMessageProps } from "schema/Message";

export function MessagesComponent() {
  const { messages, isLoadingMessages } = useMessagesController();
  console.log("🚀 ~ Messages ~ messages:", messages);

  if (isLoadingMessages) {
    return (
      <section className="flex container max-w-screen-xl flex-grow w-full h-full items-center justify-center px-2 mx-auto">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <>
      <MessageTable messages={messages as PartialMessageProps[]} />
    </>
  );
}
