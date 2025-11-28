"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getUser } from "@app/actions/user";

export function useUser() {
  const { sessionId } = useAuth();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUser();
    },
    enabled: !!sessionId,
  });
}
