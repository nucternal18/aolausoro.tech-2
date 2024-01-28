import { redirect } from "next/navigation";
import { auth } from "auth";

async function getSession() {
  const session = await auth();
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
