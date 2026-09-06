'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="relative min-h-screen max-w-lg grow overflow-y-auto px-4 py-1">
      <h2 className="my-4 text-2xl font-bold">Something went wrong!</h2>
      <Button onClick={() => reset()} className="mb-4 bg-red-500 text-white hover:bg-red-600">
        Try again
      </Button>
      <p className="text-xl">
        Or go back to{' '}
        <Link href="/" className="underline">
          Home 🏠
        </Link>
      </p>
    </main>
  )
}
