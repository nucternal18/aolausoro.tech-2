import { Button } from "@components/ui/button";
import Link from "next/link";
export default function NotFound() {
  return (
    <section className="max-w-screen-lg h-screen mx-0 md:mx-auto flex-grow px-4 lg:px-0">
      <h1 className="p-5 text-5xl font-thin border-b border-current lg:mt-6 dark:border-yellow-500 dark:text-yellow-500">
        The requested blog does not exist.
      </h1>
      <Button asChild>
        <Link href="/blog" className="text-lg font-bold ">
          Go Back
        </Link>
      </Button>
    </section>
  );
}
