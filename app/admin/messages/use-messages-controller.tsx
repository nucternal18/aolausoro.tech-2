"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

// redux
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
  useGetMessageQuery,
} from "@app/GlobalReduxStore/features/messages/messagesApiSlice";

// components
import { useToast } from "@components/ui/use-toast";

export default function useMessagesController() {
  const router = useRouter();
  const { toast } = useToast();

  // get messages
  const { data: messages, isLoading: isLoadingMessages } =
    useGetMessagesQuery();

  // delete message
  const [deleteMessage, { isLoading: isDeletingMessages }] =
    useDeleteMessageMutation();

  const deleteMessageHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteMessage(id).unwrap();
      if (response.success) {
        toast({
          title: "Message deleted",
          description: response.message,
        });
        router.push("/admin/messages");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting message. Please try again.",
      });
    }
  }, []);

  return {
    messages,
    isLoadingMessages,
    isDeletingMessages,
    deleteMessageHandler,
  };
}
