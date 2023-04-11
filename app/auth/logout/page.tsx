"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Logout() {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      signOut();
    }
    router.push("/");
  }, [session]);

  return (
    <section className="relative flex justify-center items-center w-full h-full">
      <h1>Logging out.......</h1>
    </section>
  );
}
