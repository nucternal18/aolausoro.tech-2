import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "app/api/auth/[...nextauth]/route";

async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    return redirect("/");
  }
  return (
    <section className="w-full overflow-y-auto bg-background h-screen transition-height duration-75 ease-out">
      {children}
    </section>
  );
}
