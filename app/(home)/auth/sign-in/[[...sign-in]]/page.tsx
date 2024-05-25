import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex items-center justify-center w-screen h-screen bg-background px-2 sm:px-0 ">
      <SignIn path="/auth/sign-in" />
    </section>
  );
}
