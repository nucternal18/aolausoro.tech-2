"use client";

import { useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// components
import { useToast } from "@components/ui/use-toast";
import { type PartialUserProps, partialUserSchema } from "schema/User";
import { DEFAULT_LOGIN_REDIRECT_URL } from "routes";
import { AuthError } from "next-auth";

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
          email: data.email,
          password: data.password,
          redirectTo: DEFAULT_LOGIN_REDIRECT_URL,
        });
        console.log(result);
        if (!result?.ok) {
          toast({
            title: "Error",
            description: "Unable to login. Please try again.",
            variant: "destructive",
          });
        }
        if (result?.ok) {
          toast({
            title: "Success",
            description: "Login successful. Redirecting to dashboard.",
          });
        }

        form.reset();
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              return toast({
                title: "Error",
                description: "Invalid email or password.",
                variant: "destructive",
              });
            default:
              return toast({
                title: "Error",
                description: "Unable to login. Please try again.",
                variant: "destructive",
              });
          }
        }

        console.error(error);
        toast({
          title: "Error",
          description: "Something Went wrong.",
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
