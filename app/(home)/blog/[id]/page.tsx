import Link from "next/link";
import CategoryLabel from "../../../../components/CategoryLabel";
import { getPostsMeta, getPostByName } from "../../../../lib/posts";
import Date from "../../../../components/date";
import { notFound } from "next/navigation";

import Image from "next/image";
import "highlight.js/styles/github-dark.css";
import { Button } from "@components/ui/button";

export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await getPostsMeta();

  if (!posts) return [];

  return posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = await getPostByName(`${id}.mdx`);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: `${post.meta.title} | aolausoro.tech`,
  };
}

export default async function Post({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = await getPostByName(`${id}.mdx`);

  if (!post) notFound();

  const { contentHtml, meta } = post;

  return (
    <section className="flex-grow md:container h-full md:max-w-screen-lg mx-auto text-primary px-4 md:px-10 py-4">
      <Button asChild>
        <Link href="/blog" className="text-lg font-bold ">
          Go Back
        </Link>
      </Button>
      <section className="w-full  py-6 mt-6 rounded-lg shadow-ld dark:shadow-lg ">
        <div className="flex flex-col mt-4 w-full">
          <h1 className="text-3xl mb-7 ">{meta.title}</h1>
          <CategoryLabel variant={meta.category} />
        </div>
        <div className="flex items-center justify-between p-2 my-8 rounded-sm bg-zinc-800 dark:bg-zinc-100">
          <div className="flex items-center relative">
            <Image
              src={meta.author_image}
              alt="author image"
              width={40}
              height={40}
              className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
            />
            <h4 className="text-zinc-100 dark:text-zinc-800">{meta.author}</h4>
          </div>
          <div className="mr-4 text-zinc-100 dark:text-zinc-800-800">
            <Date dateString={meta.date} />
          </div>
        </div>
        <article className="mt-2 w-full  blog-text text-primary prose lg:prose-2xl">
          {contentHtml}
        </article>
      </section>
    </section>
  );
}
