import React from "react";

import UserProfileComponent from "../UserProfile";

import { redirect } from "next/navigation";
import type { PartialUserProps } from "schema/User";
import { auth } from "auth";

const randomImage =
  "https://source.unsplash.com/random/1600x900/?coder-setup,code";

async function getSession() {
  const session = await auth();
  return session;
}

async function UserProfile() {
  const session = await getSession();

  if (!session) {
    return redirect("/auth/login");
  }
  return (
    <section className="min-h-screen w-full">
      <UserProfileComponent
        randomImage={randomImage}
        user={session?.user as PartialUserProps}
      />
    </section>
  );
}

export default UserProfile;
