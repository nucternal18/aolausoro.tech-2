"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

import LoginForm from "components/forms/Login";

export function getMetaDat() {
  return {
    title: "aolausoro.tech - Login",
    description: "Login to your account",
    openGraph: {
      title: "aolausoro.tech - Login",
      description: "Login to your account",
    },
  };
}

type Inputs = {
  email: string;
  password: string;
};

export default function Login(props) {
  const router = useRouter();

  const submitHandler = async ({ email, password }: Inputs) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      toast.error(result?.error);
    }
    if (result?.ok) {
      router.push("/");
    }
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <LoginForm handleLogin={submitHandler} />
    </section>
  );
}
