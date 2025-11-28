import React from "react";

import { getUser } from "@app/actions/user";
import type { PartialUserProps } from "@src/entities/models/User";
import { captureException } from "@sentry/nextjs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@components/ui/sidebar";
import { AppSidebar } from "@components/navigation/app-sidebar";
import { Separator } from "@components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbLink,
} from "@components/ui/breadcrumb";

export async function AdminLayoutWrapper({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  let user: PartialUserProps | null = null;

  try {
    user = await getUser();
  } catch (error) {
    console.error("Failed to get user:", error);
    captureException(error);
  }

  if (!user) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex justify-center items-center min-h-screen">
          <SidebarTrigger />
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">User not found</h1>
            <p>Please contact support if this issue persists.</p>
          </div>
        </main>
      </SidebarProvider>
    );
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex gap-2 items-center px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
