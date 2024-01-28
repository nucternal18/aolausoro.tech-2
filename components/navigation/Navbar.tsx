"use client";
import { useState } from "react";
import Link from "next/link";

import { links, social } from "../../data";

// components
import Nav from "./NavComponents";
import LoginButton from "components/LoginButton";
import { ModeToggle } from "@components/ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { ScrollArea } from "@components/ui/scroll-area";

// redux global state
import { useAppDispatch, useAppSelector } from "@app/GlobalReduxStore/hooks";
import {
  globalSelector,
  setMobileDrawerOpened,
} from "@app/GlobalReduxStore/features/globalSlice";

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
    </Nav>
  );
}

export function MobileNavbar({ height }: { height: number }) {
  const SCROLL_AREA_HEIGHT = height - 100;
  const dispatch = useAppDispatch();
  const { mobileDrawerOpened } = useAppSelector(globalSelector);

  const handleOpenChange = (opened: boolean) => {
    dispatch(setMobileDrawerOpened(opened));
  };

  return (
    <header>
      <Sheet open={mobileDrawerOpened} onOpenChange={handleOpenChange}>
        <SheetTrigger className="navbar-burger flex items-center p-4 text-blue-600">
          <svg
            className="block h-6 w-6 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
          <span hidden>Mobile Menu</span>
        </SheetTrigger>
        <SheetContent side={"left"} className="w-[240px]">
          <SheetHeader>
            <SheetTitle>
              <div className="flex justify-between w-full">
                <div className="flex items-center text-gray-900 dark:text-gray-200 hover:text-yellow-500">
                  <Link
                    href="/"
                    className="flex items-center text-xs uppercase whitespace-no-wrap font-bold text-left  md:pb-2"
                  >
                    <img
                      src={"/android-chrome-512x512.png"}
                      alt="logo"
                      className="h-8 w-8"
                    />
                    <span className="ml-1">aolausoro.tech</span>
                  </Link>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea
            className={`  py-12`}
            style={{ height: SCROLL_AREA_HEIGHT }}
          >
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <Nav.Item key={id}>
                  <Nav.Link href={url}>{text}</Nav.Link>
                </Nav.Item>
              );
            })}
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

            <LoginButton />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}
