import { redirect } from 'next/navigation'

export default async function SignInLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className="bg-background transition-height h-screen w-full overflow-y-auto duration-75 ease-out">
      {children}
    </section>
  )
}
