"use client";

import Link from "next/link";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import type { IconType } from "react-icons/lib";

import {
  FaHome,
  FaUserCircle,
  FaMailBulk,
  FaRegCalendarAlt,
  FaImages,
} from "react-icons/fa";
import { GoIssueOpened } from "react-icons/go";
import {
  Home,
  Settings,
  LogOutIcon,
  PanelLeft,
  Search,
  User,
  type LucideProps,
} from "lucide-react";

// components
import ActiveLink from "../active-link";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { ModeToggle } from "@components/mode-toggle";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

// redux global state
import { useAppDispatch, useAppSelector } from "@app/GlobalReduxStore/hooks";
import {
  globalSelector,
  setMobileDrawerOpened,
} from "@app/GlobalReduxStore/features/globalSlice";
import useUserController from "@app/protected/admin/user-profile/useUserController";

type AdminLink = {
  id: number;
  url: string;
  text: string;
  Icon: IconType;
};

const adminLinks: Array<AdminLink> = [
  {
    id: 1,
    url: "/protected/admin",
    text: "Dashboard",
    Icon: FaHome,
  },
  {
    id: 2,
    url: "/protected/admin/jobs",
    text: "Jobs",
    Icon: FaRegCalendarAlt,
  },
  {
    id: 3,
    url: "/protected/admin/projects",
    text: "Projects",
    Icon: FaUserCircle,
  },
  {
    id: 4,
    url: "/protected/admin/messages",
    text: "Messages",
    Icon: FaMailBulk,
  },
  {
    id: 5,
    url: "/protected/admin/issues",
    text: "Issues",
    Icon: GoIssueOpened,
  },
  {
    id: 6,
    url: "/protected/admin/wiki",
    text: "Scrap Book",
    Icon: FaImages,
  },
];

export function AdminsSidebar() {
  const { sessionId, isSignedIn } = useAuth();
  const [currentHref, setCurrentHref] = useState<string>("");
  const { userData } = useUserController();
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <ActiveLink
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-foreground text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            currentHref={currentHref}
          >
            <img
              src={"/android-chrome-512x512.png"}
              alt="logo"
              className="h-4 w-4 transition-all group-hover:scale-110"
            />
            <span className="sr-only">Aolausoro.tech</span>
          </ActiveLink>
          {adminLinks.map((link) => {
            const { Icon } = link;
            return (
              <Tooltip key={`${link.id}-${link.text}`}>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="p-0"
                    onClick={() => setCurrentHref(link.url)}
                  >
                    <ActiveLink
                      href={link.url}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      currentHref={currentHref}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{link.text}</span>
                    </ActiveLink>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{link.text}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} className="p-0">
                <ActiveLink
                  href={`/protected/admin/user-profile/${userData?.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  currentHref={currentHref}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">User Profile</span>
                </ActiveLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">User Profile</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} className="p-0">
                <ActiveLink
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  currentHref={currentHref}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </ActiveLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {isSignedIn ? (
                <Button
                  variant={"ghost"}
                  className="shadow-md shadow-neutral-500 dark:shadow-orange-500 flex h-9 w-9 items-center p-0 justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <SignOutButton redirectUrl="/" signOutOptions={{ sessionId }}>
                    <LogOutIcon className="w-4 h-4" />
                  </SignOutButton>
                </Button>
              ) : null}
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}

export function MobileAdminSidebar({ height }: { height: number }) {
  const [currentHref, setCurrentHref] = useState<string>("");
  const { sessionId, isSignedIn } = useAuth();
  const { userData } = useUserController();
  const SCROLL_AREA_HEIGHT = height - 100;
  const dispatch = useAppDispatch();
  const { mobileDrawerOpened } = useAppSelector(globalSelector);

  const handleOpenChange = (opened: boolean) => {
    dispatch(setMobileDrawerOpened(opened));
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={mobileDrawerOpened} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <ActiveLink
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              currentHref={currentHref}
            >
              <img
                src={"/android-chrome-512x512.png"}
                alt="logo"
                className="h-5 w-5 transition-all group-hover:scale-110"
              />
              <span className="sr-only">Aolausoro.tech</span>
            </ActiveLink>
            {adminLinks.map((link) => {
              const { Icon } = link;
              return (
                <Button
                  key={`${link.id}-${link.text}`}
                  variant={"ghost"}
                  className="p-0 justify-start"
                  onClick={() => setCurrentHref(link.url)}
                  asChild
                >
                  <ActiveLink
                    key={`${link.id}-${link.text}`}
                    href={link.url}
                    className="group flex items-center gap-4  text-muted-foreground hover:text-foreground"
                    currentHref={currentHref}
                  >
                    <Icon className="h-5 w-5 transition-all group-hover:scale-110" />
                    {link.text}
                  </ActiveLink>
                </Button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recent Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/android-chrome-512x512.png"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <ActiveLink
              href={`/protected/admin/user-profile/${userData?.id}`}
              currentHref={currentHref}
            >
              User Profile
            </ActiveLink>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {isSignedIn ? (
              <Button variant={"ghost"} className="items-start p-0">
                <SignOutButton redirectUrl="/" signOutOptions={{ sessionId }} />
              </Button>
            ) : null}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
