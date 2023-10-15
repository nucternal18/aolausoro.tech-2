"use client";
import React from "react";
import { useSession, signIn } from "next-auth/react";
import Nav from "./navigation/NavComponents";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import Image from "next/image";

const LoginButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user && session.user?.isAdmin ? (
        <>
          <Nav.Item>
            <Nav.Link href={`/auth/user-profile/${session.user?.id}`}>
              <div className="flex flex-row-reverse md:flex-row gap-2 items-center">
                <p className="mr-2 capitalize text-base block">
                  {session.user.name}
                </p>
                <Image
                  src={
                    (session.user.image as string) ||
                    "/android-chrome-192x192.png"
                  }
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
            <Nav.Link href="/admin">
              <RiAdminFill fontSize={24} />
              <span className="block md:hidden text-base ml-2">Admin</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/auth/logout">
              <FiLogOut />
              <span className="block md:hidden text-base ml-2">Logout</span>
            </Nav.Link>
          </Nav.Item>
        </>
      ) : (
        <Nav.Item>
          <button
            type="button"
            className="z-50 flex px-2 py-1 mb-1 text-lg font-medium list-none cursor-pointer sm:block md:ml-0 md:mb-0 md:py-1 md:px-1"
            onClick={() => signIn()}
          >
            <FaUser />
          </button>
        </Nav.Item>
      )}
    </>
  );
};

export default LoginButton;
