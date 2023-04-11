"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./navigation/NavComponents";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

const LoginButton = () => {
  const { data: session } = useSession();
  return (
    <>
      {session?.user && session.user?.isAdmin ? (
        <>
          <Nav.Item>
            <Nav.Link href="/admin">ADMIN</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/auth/logout">
              <FiLogOut />
            </Nav.Link>
          </Nav.Item>
        </>
      ) : (
        <Nav.Item>
          <Nav.Link href="/auth/login">
            <FaUser />
          </Nav.Link>
        </Nav.Item>
      )}
    </>
  );
};

export default LoginButton;
