"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

import { links, social } from "../../data";

// context
import { useAppSelector } from "app/GlobalReduxStore/hooks";
import { currentUserSelector } from "app/GlobalReduxStore/features/users/usersSlice";
import Nav from "./NavComponents";
import LoginButton from "components/LoginButton";

type NavProps = {
  textColor?: string;
};

export default function Navbar({ textColor }: NavProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentUser = useAppSelector(currentUserSelector);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    signOut();
    // dispatch({ type: ActionType.USER_LOGOUT_SUCCESS });
    router.push("/");
  };

  return (
    <Nav bgColor="bg-white dark:bg-gray-900 drop-shadow-sm">
      <Nav.Toggler
        toggle={toggle}
        isOpen={isOpen}
        color={textColor as string}
      />
      {/* Main navigation */}
      <Nav.Container textColor={`${textColor} dark:text-yellow-500`}>
        <Nav.Brand href="/">
          <img
            src={"/android-chrome-512x512.png"}
            alt="logo"
            className="h-8 w-8"
          />
        </Nav.Brand>
        <Nav.NavLinks left>
          {links.map((link) => {
            const { id, url, text } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{text}</Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav.NavLinks>
        <Nav.NavLinks right>
          <Nav.Item>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex p-1 ml-4 font-medium list-none border-2 border-current rounded-full cursor-pointer md:block lg:ml-0 lg:mb-0 lg:p-1 lg:px-1 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent"
            >
              {theme === "light" ? (
                <FiSun className="text-lg font-bold " />
              ) : (
                <FiMoon className="font-semibold " />
              )}
            </button>
          </Nav.Item>
          {social.map((link) => {
            const { id, url, icon } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{icon}</Nav.Link>
              </Nav.Item>
            );
          })}
          <LoginButton />
        </Nav.NavLinks>
      </Nav.Container>
      {/* Mobile Nav */}
      <Nav.SideNav isOpen={isOpen} toggle={toggle}>
        {links.map((link) => {
          const { id, url, text } = link;
          return (
            <Nav.Item key={id}>
              <Nav.Link href={url}>{text}</Nav.Link>
            </Nav.Item>
          );
        })}
        {currentUser && currentUser?.isAdmin && (
          <>
            <Nav.Item>
              <Nav.Link href="/admin">ADMIN</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <button
                type="button"
                className="flex items-center text-gray-900 uppercase  hover:text-gray-500 ml-2 dark:hover:text-yellow-500 dark:text-yellow-500"
                onClick={logout}
              >
                <p className="flex flex-row py-3 text-lg mr-1">Logout</p>
                <FiLogOut fontSize={18} className="mr-2" />
              </button>
            </Nav.Item>
          </>
        )}

        {currentUser ? (
          <Nav.Item>
            <button
              type="button"
              className="flex items-center bg-gray-800 dark:bg-yellow-500 px-4 ml-2 py-2 rounded-3xl text-gray-200 shadow-xl"
              onClick={() => router.push(`/user-profile/${currentUser?.id}`)}
            >
              <p className="mr-2 capitalize text-base">{currentUser.name}</p>
              <img
                src={currentUser.image}
                alt="user-profile"
                className="w-8 h-8 rounded-full"
              />
            </button>
          </Nav.Item>
        ) : (
          <Nav.Item>
            <Nav.Link href="/login">
              <FaUser />
            </Nav.Link>
          </Nav.Item>
        )}

        <div
          className={`absolute flex bottom-0 items-center justify-center mb-2`}
        >
          {social.map((link) => {
            const { id, url, icon } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{icon}</Nav.Link>
              </Nav.Item>
            );
          })}
        </div>
      </Nav.SideNav>
    </Nav>
  );
}
