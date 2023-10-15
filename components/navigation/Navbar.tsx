"use client";
import { useState } from "react";
import { useTheme } from "next-themes";

import { links, social } from "../../data";

import Nav from "./NavComponents";
import LoginButton from "components/LoginButton";
import { ModeToggle } from "@components/ModeToggle";

type NavProps = {
  textColor?: string;
};

export default function Navbar({ textColor = "text-primary" }: NavProps) {
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav bgColor=" drop-shadow-sm">
      <Nav.Toggler toggle={toggle} isOpen={isOpen} color={textColor} />
      {/* Main navigation */}
      <Nav.Container textColor={`${textColor} `}>
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
            <ModeToggle />
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
