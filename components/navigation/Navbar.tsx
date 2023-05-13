"use client";
import { useState } from "react";

import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";

import { links, social } from "../../data";

import Nav from "./NavComponents";
import LoginButton from "components/LoginButton";

type NavProps = {
  textColor?: string;
};

export default function Navbar({ textColor }: NavProps) {
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav bgColor="bg-slate-200 dark:bg-slate-900 drop-shadow-sm">
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
              onClick={() =>
                theme == "dark" ? setTheme("light") : setTheme("dark")
              }
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

        <LoginButton />

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
