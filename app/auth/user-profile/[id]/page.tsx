import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

import UserProfileComponent from "components/UserProfile";
import { UserInfoProps } from "lib/types";
import { redirect } from "next/navigation";

const randomImage =
  "https://source.unsplash.com/random/1600x900/?coder-setup,code";

async function getSession() {
  const session = await getServerSession(authOptions);
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
        user={session?.user as UserInfoProps}
      />
    </section>
  );
}

export default UserProfile;
