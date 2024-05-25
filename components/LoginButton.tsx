"use client";
import React from "react";
import { useUser, SignOutButton, useAuth } from "@clerk/nextjs";
import Nav from "./navigation/NavComponents";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import Image from "next/image";
import { Button } from "./ui/button";

const LoginButton = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { sessionId } = useAuth();

  return (
    <>
      {!isLoaded || !isSignedIn ? (
        <>
          <Nav.Item>
            <Nav.Link href="/auth/sign-in">
              <Button variant={"ghost"}>
                <FaUser />
              </Button>
            </Nav.Link>
          </Nav.Item>
        </>
      ) : (
        <>
          <Nav.Item>
            <Nav.Link href={`/protected/admin/user-profile/${user?.id}`}>
              <div className="flex flex-row-reverse md:flex-row gap-2 items-center">
                <p className="mr-2 capitalize text-base block">
                  {user.firstName}
                </p>
                <Image
                  src={user.imageUrl || "/android-chrome-192x192.png"}
                  alt="user-profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/protected/admin">
              <RiAdminFill fontSize={24} />
              <span className="block md:hidden text-base ml-2">Admin</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Button variant={"ghost"}>
              <SignOutButton
                redirectUrl="/"
                signOutOptions={{ sessionId: sessionId as string }}
              >
                <FiLogOut className="shadow-md shadow-neutral-500 dark:shadow-orange-500" />
              </SignOutButton>
            </Button>
          </Nav.Item>
        </>
      )}
    </>
  );
};

export default LoginButton;
