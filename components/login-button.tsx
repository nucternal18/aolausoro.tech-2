"use client";
import React from "react";
import { useUser, SignOutButton, useAuth } from "@clerk/nextjs";
import Nav from "./navigation/nav-components";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { Button } from "./ui/button";

const LoginButton = () => {
  const { isLoaded, isSignedIn } = useUser();
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
            <Nav.Link href="/protected/admin">
              <Button
                variant={"outline"}
                className="text-primary shadow shadow-neutral-500 flex items-center"
              >
                <RiAdminFill fontSize={18} />
                <span className="block text-sm ml-2">Admin</span>
              </Button>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Button
              variant={"outline"}
              className="text-primary shadow shadow-neutral-500"
            >
              <SignOutButton
                redirectUrl="/"
                signOutOptions={{ sessionId: sessionId as string }}
              >
                <>
                  <FiLogOut fontSize={18} />
                  <span className="block text-sm ml-2">Sign Out</span>
                </>
              </SignOutButton>
            </Button>
          </Nav.Item>
        </>
      )}
    </>
  );
};

export default LoginButton;
