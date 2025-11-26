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
              <Button variant={"ghost"} className="flex items-center p-0">
                <FaUser />
              </Button>
            </Nav.Link>
          </Nav.Item>
        </>
      ) : (
        <>
          <Nav.Item>
            <Nav.Link href="/admin">
              <Button variant={"ghost"} className="flex items-center p-0">
                <RiAdminFill fontSize={18} />
              </Button>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <SignOutButton
              redirectUrl="/"
              signOutOptions={{ sessionId: sessionId as string }}
            >
              <FiLogOut fontSize={18} />
            </SignOutButton>
          </Nav.Item>
        </>
      )}
    </>
  );
};

export default LoginButton;
