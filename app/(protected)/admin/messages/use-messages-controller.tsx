"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

// components
import { useToast } from "@components/ui/use-toast";
import { deleteMessage } from "@app/actions/messages";

export function useMessagesController() {
  const router = useRouter();
  const { toast } = useToast();

  const deleteMessageHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteMessage(id);
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
    deleteMessageHandler,
  };
}
