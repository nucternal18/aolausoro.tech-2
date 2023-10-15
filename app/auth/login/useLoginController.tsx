"use client";

import { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// components
import { useToast } from "@components/ui/use-toast";
import { type PartialUserProps, partialUserSchema } from "schema/User";

export default function useLoginController() {
  const { toast } = useToast();
  const form = useForm<PartialUserProps>({
    resolver: zodResolver(partialUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleLogin: SubmitHandler<PartialUserProps> = useCallback(
    async (data) => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          toast({
            title: "Error",
            description: "Unable to login. Please try again.",
          });
        }
        if (result?.ok) {
          router.push("/admin");
        }
        form.reset();
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Unable to login. Please try again.",
        });
      }
    },
    [],
  );

  return {
    form,
    handleLogin,
  };
}
