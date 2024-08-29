"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSession } from "@clerk/clerk-react";

export default function Logout() {
  const clerk = useClerk();
  const { session, isSignedIn } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      clerk.signOut();
    }
    router.push("/");
  }, [session]);

  return (
    <section className="relative flex justify-center items-center w-full min-h-screen">
      <h1 className="text-3xl font-mono font-medium dark:text-yellow-500">
        Logging out.......
      </h1>
    </section>
  );
}
