"use client";
import { useCallback } from "react";
import { useRouter, redirect } from "next/navigation";
import { toast } from "react-toastify";

// components
import MessageTable from "components/Table/MessageTable";
import Loader from "components/Loader";

// redux
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
} from "app/GlobalReduxStore/features/messages/messagesApiSlice";
import { IMessageData } from "types/types";

function Messages() {
  const router = useRouter();
  const { data: messages, isLoading } = useGetMessagesQuery();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const messageDeleteHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteMessage(id).unwrap();
      if (response.success) {
        toast.success("Message deleted successfully");
        router.push("/admin/messages");
      }
    } catch (error) {
      toast.error("Error deleting message");
    }
  }, []);

  if (isLoading) {
    return (
      <section className=" items-center  flex-grow w-full h-screen px-4 mx-auto  md:px-10">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className=" items-center  flex-grow w-full h-screen px-4 mx-auto  md:px-10">
      <div className="items-center  w-full p-6 my-4 overflow-hidden rounded  md:w-2/4 md:mx-auto">
        <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
          Messages
        </p>
      </div>
      <MessageTable
        messages={messages as IMessageData[]}
        router={router}
        isLoading={isDeleting}
        deleteMessage={messageDeleteHandler}
      />
    </section>
  );
}

export default Messages;
