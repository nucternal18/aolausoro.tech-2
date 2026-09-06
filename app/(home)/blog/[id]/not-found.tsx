import { Button } from '@components/ui/button'
import Link from 'next/link'
export default function NotFound() {
  return (
    <section className="mx-0 h-screen max-w-5xl grow px-4 md:mx-auto lg:px-0">
      <h1 className="border-b border-current p-5 text-5xl font-thin lg:mt-6 dark:border-yellow-500 dark:text-yellow-500">
        The requested blog does not exist.
      </h1>
      <Button asChild>
        <Link href="/blog" className="text-lg font-bold">
          Go Back
        </Link>
      </Button>
    </section>
  )
}
