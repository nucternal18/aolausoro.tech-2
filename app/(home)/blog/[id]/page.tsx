import Link from "next/link";
import { Clock } from "lucide-react";
import CategoryLabel from "../../../../components/category-label";
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
    <section className="px-4 py-4 mx-auto h-full grow md:container md:max-w-5xl text-primary md:px-10">
      <Button asChild>
        <Link href="/blog" className="text-lg font-bold">
          Go Back
        </Link>
      </Button>
      <section className="py-6 mt-6 w-full rounded-lg shadow-ld dark:shadow-lg">
        <div className="flex flex-col mt-4 w-full">
          <h1 className="mb-7 text-3xl">{meta.title}</h1>
          <CategoryLabel variant={meta.category} />
        </div>
        <div className="flex justify-between items-center p-2 my-8 rounded-sm bg-zinc-800 dark:bg-zinc-100">
          <div className="flex relative items-center">
            <Image
              src={meta.author_image}
              alt="author image"
              width={40}
              height={40}
              className="hidden object-cover mx-4 w-10 h-10 rounded-full sm:block"
            />
            <h4 className="text-zinc-100 dark:text-zinc-800">{meta.author}</h4>
          </div>
          <div className="flex gap-4 items-center mr-4 text-zinc-100 dark:text-zinc-800">
            {meta.readTime && (
              <div className="flex gap-1 items-center">
                <Clock className="w-4 h-4" />
                <span>{meta.readTime}</span>
              </div>
            )}
            <Date dateString={meta.date} />
          </div>
        </div>
        <article className="mt-2 w-full blog-text text-primary prose lg:prose-2xl">
          {contentHtml}
        </article>
      </section>
    </section>
  );
}
