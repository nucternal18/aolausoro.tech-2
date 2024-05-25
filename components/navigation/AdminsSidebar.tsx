"use client";

import Link from "next/link";
import { SignOutButton, useAuth } from "@clerk/nextjs";

import {
  FaHome,
  FaUserCircle,
  FaMailBulk,
  FaRegCalendarAlt,
  FaImages,
} from "react-icons/fa";
import { GoIssueOpened } from "react-icons/go";
import { useRouter } from "next/navigation";

// components
import ActiveLink from "../ActiveLink";
import { cn } from "@lib/utils";
import { Separator } from "@components/ui/separator";
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
import { Button } from "@components/ui/button";

export function AdminsSidebar() {
  const { sessionId, isSignedIn } = useAuth();
  return (
    <aside className="z-10  flex flex-initial px-2  bg-background  md:h-full  md:left-0  md:top-0 md:bottom-0   md:overflow-hidden md:w-72 ">
      <nav className="flex flex-wrap items-center justify-between min-w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap md:overflow-y-auto">
        {/* Collapse */}
        <div
          className={cn(
            "md:flex md:flex-col md:items-stretch md:opacity-100  w-full md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto flex-1 rounded ",
          )}
        >
          {/* Divider */}
          <Separator className="my-4 " />

          {/* Navigation */}
          <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 px-1">
            <li>
              <ActiveLink href="/protected/admin">
                <FaHome fontSize={18} className="mr-2 " />
                <span>Admin Home</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink href="/protected/admin/projects">
                <FaUserCircle fontSize={18} className="mr-2 " />
                <span>Manage Projects</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/protected/admin/messages">
                <FaMailBulk fontSize={18} className="mr-2 " />
                <span>Messages</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/protected/admin/issues">
                <GoIssueOpened fontSize={18} className="mr-2 " />
                <span>Issues</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/protected/admin/wiki">
                <FaImages fontSize={18} className="mr-2 " />
                <span>Wiki</span>
              </ActiveLink>
            </li>
          </ul>

          {/* Divider */}
          <Separator className="my-4 " />

          <h2
            className="text-base pl-1
          font-semibold
          tracking-widest
          uppercase
          text-gray-900 dark:text-gray-300 dark:hover:text-yellow-500
          "
          >
            Jobs
          </h2>
          <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 px-1">
            <li>
              <ActiveLink href="/protected/admin/jobs">
                <FaRegCalendarAlt fontSize={18} className="mr-2 " />
                <span>All Jobs</span>
              </ActiveLink>
            </li>
          </ul>

          {/* Divider */}
          <Separator className="my-4 " />
          <ul className="flex flex-col list-none md:min-w-full md:mb-4 px-1">
            {isSignedIn ? (
              <Button className="shadow-md shadow-neutral-500 dark:shadow-orange-500">
                <SignOutButton redirectUrl="/" signOutOptions={{ sessionId }} />
              </Button>
            ) : null}
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export function MobileAdminSidebar({ height }: { height: number }) {
  const { sessionId, isSignedIn } = useAuth();
  const SCROLL_AREA_HEIGHT = height - 100;
  const dispatch = useAppDispatch();
  const { mobileDrawerOpened } = useAppSelector(globalSelector);
  const router = useRouter();

  const handleLogout = async () => {
    router.push(`/auth/logout`);
  };

  const handleOpenChange = (opened: boolean) => {
    dispatch(setMobileDrawerOpened(opened));
  };

  return (
    <header className="flex items-center justify-between">
      <Sheet open={mobileDrawerOpened} onOpenChange={handleOpenChange}>
        <SheetTrigger className="navbar-burger flex items-center p-4 text-primary">
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
            <div className="w-full">
              <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 px-1">
                <li>
                  <ActiveLink href="/admin">
                    <FaHome fontSize={18} className="mr-2 " />
                    <span>Admin Home</span>
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink href="/protected/admin/projects">
                    <FaUserCircle fontSize={18} className="mr-2 " />
                    <span>Manage Projects</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/protected/admin/messages">
                    <FaMailBulk fontSize={18} className="mr-2 " />
                    <span>Messages</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/protected/admin/issues">
                    <GoIssueOpened fontSize={18} className="mr-2 " />
                    <span>Issues</span>
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href="/protected/admin/wiki">
                    <FaImages fontSize={18} className="mr-2 " />
                    <span>Wiki</span>
                  </ActiveLink>
                </li>
              </ul>

              {/* Divider */}
              <Separator className="my-4 " />

              <h2
                className="text-base pl-1
          font-semibold
          tracking-widest
          uppercase
          text-gray-900 dark:text-gray-300 dark:hover:text-yellow-500
          "
              >
                Jobs
              </h2>
              <ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4 px-1">
                <li>
                  <ActiveLink href="/protected/admin/jobs">
                    <FaRegCalendarAlt fontSize={18} className="mr-2 " />
                    <span>All Jobs</span>
                  </ActiveLink>
                </li>
              </ul>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      {isSignedIn ? (
        <Button className="shadow-md shadow-neutral-500 dark:shadow-orange-500">
          <SignOutButton redirectUrl="/" signOutOptions={{ sessionId }} />
        </Button>
      ) : null}
    </header>
  );
}
