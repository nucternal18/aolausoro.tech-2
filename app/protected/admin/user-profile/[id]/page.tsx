import React from "react";
import { auth } from "@clerk/nextjs/server";
import UserProfileComponent from "../user-profile";

import type { PartialUserProps } from "schema/User";
import { getUser } from "@app/actions/user";

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
