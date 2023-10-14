"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <main className="relative min-h-scree max-w-lg py-1 px-4 flex-grow overflow-y-auto">
      <h2 className="my-4 text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="mb-4 p-4 bg-red-500 text-white rounded-xl"
      >
        Try again
      </button>
      <p className="text-xl">
        Or go back to{" "}
        <Link href="/" className="underline">
          Home 🏠
        </Link>
      </p>
    </main>
  );
}
