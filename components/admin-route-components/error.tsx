"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col items-center space-y-4 h-full">
        <Image
          src={"/android-chrome-512x512.png"}
          alt="My Logo"
          width={200}
          height={200}
        />
        <h1 className="my-5 text-6xl">Whoops!</h1>
        <h2 className="mb-3 text-3xl">Something went wrong!</h2>
        <p>{JSON.stringify(error.message)}</p>
        <div className="flex gap-4 justify-center items-center">
          <div className="flex justify-center">
            <Button type="button" onClick={() => reset()}>
              Try again
            </Button>
          </div>
          <div className="flex justify-center">
            <Button type="button" onClick={() => router.back()}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
