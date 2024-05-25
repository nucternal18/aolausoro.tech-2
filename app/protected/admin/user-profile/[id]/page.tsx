import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import UserProfileComponent from "../UserProfile";

import { redirect } from "next/navigation";
import type { PartialUserProps } from "schema/User";
import { getUser } from "@lib/actions/user";

const randomImage =
  "https://source.unsplash.com/random/1600x900/?coder-setup,code";

async function getSignedInUser() {
  const { userId } = auth();
  try {
    const user = await getUser(userId as string);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function UserProfile() {
  const user = await getSignedInUser();

  return (
    <section className="min-h-screen w-full">
      <UserProfileComponent
        randomImage={randomImage}
        user={user as PartialUserProps}
      />
    </section>
  );
}

export default UserProfile;
