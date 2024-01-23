"use client";

// components
import MessageTable from "@app/admin/messages/message-table";
import Loader from "@components/Loader";

// controller
import useMessagesController from "./use-messages-controller";

// zod schemas
import type { PartialMessageProps } from "schema/Message";

function Messages() {
  const { messages, isLoadingMessages } = useMessagesController();

  if (isLoadingMessages) {
    return (
      <section className=" container max-w-screen-xl flex-grow w-full h-screen px-2 mx-auto">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className=" container max-w-screen-xl flex-grow w-full h-screen px-2 mx-auto">
      <div className="items-center  w-full p-6 my-4 overflow-hidden rounded  md:w-2/4 md:mx-auto">
        <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
          Messages
        </p>
      </div>
      <MessageTable messages={messages as PartialMessageProps[]} />
    </section>
  );
}

export default Messages;
