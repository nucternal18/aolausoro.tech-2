"use client";
import React, { Suspense } from "react";
import { isServer, useSuspenseQuery } from "@tanstack/react-query";
import { ProfileComponent } from "../profile";
import { getUser } from "@app/actions/user";
import Loader from "@components/Loader";

function useUser() {
  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return { data, isLoading, error };
}

export async function User() {
  const user = useUser();

  if ("error" in user) {
    // Handle error case
    return (
      <section className="min-h-screen w-full">
        <div>Error: {user.error?.message}</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full">
      <Suspense fallback={<Loader classes="w-8 h-8" />}>
        <ProfileComponent user={user} />
      </Suspense>
    </section>
  );
}
