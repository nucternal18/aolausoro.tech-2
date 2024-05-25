import { redirect } from "next/navigation";

export default async function SignInLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full overflow-y-auto bg-background h-screen transition-height duration-75 ease-out">
      {children}
    </section>
  );
}
