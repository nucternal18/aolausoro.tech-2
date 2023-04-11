import React from "react";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../api/auth/[...nextauth]";

import UserProfileComponent from "components/UserProfile";
import { UserInfoProps } from "lib/types";

const randomImage =
  "https://source.unsplash.com/random/1600x900/?coder-setup,code";

async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

async function UserProfile() {
  const session = await getSession();
  return (
    <>
      <UserProfileComponent
        randomImage={randomImage}
        user={session?.user as UserInfoProps}
      />
    </>
  );
}

export default UserProfile;
