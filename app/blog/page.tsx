import { getPostsMeta } from "../../lib/posts";

import BlogItem from "../../components/Blog";

export const revalidate = 86400;

export default async function BlogPage() {
  const posts = await getPostsMeta();

  if (!posts) {
    return (
      <section className="max-w-screen-lg h-screen mx-0 md:mx-auto flex-grow px-4 lg:px-0">
        <h1 className="p-5 text-5xl font-thin border-b border-current lg:mt-6 dark:border-yellow-500 dark:text-yellow-500">
          BLOG
        </h1>

        <p className="mt-10 text-center text-xl">Sorry, no blogs available.</p>
      </section>
    );
  }

  return (
    <section className="max-w-screen-lg h-screen mx-0 md:mx-auto flex-grow px-4 lg:px-0">
      <h1 className="p-5 text-5xl font-thin border-b border-current lg:mt-6 dark:border-yellow-500 dark:text-yellow-500">
        BLOG
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogItem key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
