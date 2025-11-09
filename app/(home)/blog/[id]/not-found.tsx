import { Button } from "@components/ui/button";
import Link from "next/link";
export default function NotFound() {
  return (
    <section className="px-4 mx-0 max-w-5xl h-screen grow md:mx-auto lg:px-0">
      <h1 className="p-5 text-5xl font-thin border-b border-current lg:mt-6 dark:border-yellow-500 dark:text-yellow-500">
        The requested blog does not exist.
      </h1>
      <Button asChild>
        <Link href="/blog" className="text-lg font-bold">
          Go Back
        </Link>
      </Button>
    </section>
  );
}
