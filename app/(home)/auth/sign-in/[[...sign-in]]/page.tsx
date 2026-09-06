import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className="bg-background flex h-screen w-screen items-center justify-center px-2 sm:px-0">
      <SignIn path="/auth/sign-in" />
    </section>
  )
}
