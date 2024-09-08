"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: string;
  reset: () => void;
}) {
  const serializedError = JSON.stringify(error);
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src={"/android-chrome-512x512.png"}
          alt="My Logo"
          width={200}
          height={200}
        />
        <h1 className="my-5 text-6xl">500</h1>
        <h2 className="mb-3 text-3xl">internal Server Error!</h2>
        <div className="flex gap-4 items-center justify-center">
          <div className="flex justify-center">
            <Button type="button" asChild>
              <Link href={"/"}>Home</Link>
            </Button>
          </div>
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
