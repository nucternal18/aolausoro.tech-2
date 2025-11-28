import { auth } from "@clerk/nextjs/server";
import "../../globals.css";
import "highlight.js/styles/github-dark.css";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// components
import { AdminLayoutWrapper } from "./admin-layout-wrapper";

// redux global state
import { Providers } from "@app/global-redux-store/providers";
import { getUser } from "@app/actions/user";

export default async function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const { isAuthenticated } = await auth();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUser();
    },
  });

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <html lang="en">
      <body className="flex flex-col p-0 m-0 text-gray-800 border-box scroll-smooth bg-background">
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
