"use client";
import React, { Suspense } from "react";
import { isServer, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { ProfileComponent } from "../profile";
import { getUser } from "@app/actions/user";
import Loader from "@components/Loader";
import type { PartialUserProps } from "@src/entities/models/User";

export async function User({
  userData,
}: {
  userData: Pick<PartialUserProps, "id" | "name" | "email" | "image">;
}) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    initialData: userData,
    refetchOnMount: false,
  });

  if (error) {
    // Handle error case
    return (
      <section className="min-h-screen w-full">
        <div>Error: {error?.message}</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full">
      <ProfileComponent user={user} />
    </section>
  );
}
