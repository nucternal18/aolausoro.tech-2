"use client";
import { useState } from "react";
import Link from "next/link";

import { links, social } from "../../data";

// components
import Nav from "./nav-components";
import LoginButton from "@components/login-button";
import { ModeToggle } from "@components/mode-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { ScrollArea } from "@components/ui/scroll-area";

type NavProps = {
  textColor?: string;
};

export function Navbar({ textColor = "text-primary" }: NavProps) {
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
            className="w-8 h-8"
          />
        </Nav.Brand>
        <Nav.NavLinks right>
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
    </Nav>
  );
}

export function MobileNavbar({ height }: { height: number }) {
  const SHEET_HEIGHT = height - 200;
  const SCROLL_AREA_HEIGHT = height - 400;

  return (
    <header>
      <Sheet>
        <SheetTrigger className="flex items-center p-4 navbar-burger text-primary">
          <svg
            className="block w-6 h-6 fill-current text-primary"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
          <span hidden>Mobile Menu</span>
        </SheetTrigger>

        <SheetContent
          side={"bottom"}
          className={`shadow h-[${SHEET_HEIGHT}] shadow-neutral-400`}
        >
          <SheetHeader>
            <SheetTitle>
              <div className="flex justify-between w-full">
                <div className="flex items-center text-primary">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="flex items-center text-xs font-bold text-left uppercase whitespace-no-wrap md:pb-2"
                    >
                      <img
                        src={"/android-chrome-512x512.png"}
                        alt="logo"
                        className="w-8 h-8"
                      />
                      <span className="ml-1">aolausoro.tech</span>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea
            className={`py-12 text-primary`}
            style={{ height: SCROLL_AREA_HEIGHT }}
          >
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <Nav.Item key={id}>
                  <SheetClose asChild>
                    <Link
                      href={url}
                      className="flex z-50 px-2 mb-1 font-mono text-lg font-medium list-none cursor-pointer sm:block md:ml-0 md:mb-0 md:py-1 md:px-1"
                    >
                      {text}
                    </Link>
                  </SheetClose>
                </Nav.Item>
              );
            })}
            <div
              className={`flex absolute bottom-0 justify-center items-center mb-2`}
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

            <LoginButton />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}
