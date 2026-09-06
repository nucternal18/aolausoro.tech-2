'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk, useSession } from '@clerk/nextjs'

export default function Logout() {
  const clerk = useClerk()
  const { session, isSignedIn } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      clerk.signOut()
    }
    router.push('/')
  }, [session])

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center">
      <h1 className="font-mono text-3xl font-medium dark:text-yellow-500">Logging out.......</h1>
    </section>
  )
}
