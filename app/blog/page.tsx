import { getSortedPostsData } from "../../lib/posts";

import BlogItem from "../../components/Blog";
import Pagination from "../../components/Pagination";
import { POSTS_PER_PAGE } from "../../config";

export default function BlogPage() {
  const currentPage = 1;
  const { orderedPost, numPages } = getSortedPostsData(1);
  return (
    <section className="max-w-screen-lg mx-0 md:mx-auto flex-grow px-4 lg:px-0">
      <h1 className="p-5 text-5xl font-thin border-b border-current lg:mt-6 dark:border-yellow-500 dark:text-yellow-500">
        BLOG
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orderedPost.map((post) => (
          <BlogItem key={post.id} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} numPages={numPages} />
    </section>
  );
}
