"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="overflow-y-auto relative px-4 py-1 max-w-lg min-h-screen grow">
      <h2 className="my-4 text-2xl font-bold">Something went wrong!</h2>
      <Button
        onClick={() => reset()}
        className="mb-4 text-white bg-red-500 hover:bg-red-600"
      >
        Try again
      </Button>
      <p className="text-xl">
        Or go back to{" "}
        <Link href="/" className="underline">
          Home 🏠
        </Link>
      </p>
    </main>
  );
}
