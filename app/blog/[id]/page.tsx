import Link from "next/link";

import CategoryLabel from "../../../components/CategoryLabel";
import { getPostsMeta, getPostByName } from "../../../lib/posts";
import Date from "../../../components/date";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import "highlight.js/styles/github-dark.css";

export const revalidate = 10;

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
}): Promise<Metadata> {
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
    <section className="flex-grow h-full max-w-screen-lg mx-auto text-black dark:text-gray-100 py-4">
      <button className="flex items-center justify-center px-4 py-1 font-medium text-center transition duration-200 ease-in border border-gray-900 rounded shadow text-gray-900 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 dark:border-yellow-500 dark:text-yellow-500 focus:outline-none">
        <Link href="/blog" className="text-lg font-bold ">
          Go Back
        </Link>
      </button>
      <section className="w-full px-10 py-6 mt-6 bg-slate-100 rounded-lg shadow-ld dark:shadow-lg dark:text-gray-800">
        <div className="flex flex-col mt-4 w-full">
          <h1 className="text-3xl mb-7 ">{meta.title}</h1>
          <CategoryLabel>{meta.category}</CategoryLabel>
        </div>
        <div className="flex items-center justify-between p-2 my-8 bg-gray-300">
          <div className="flex items-center relative">
            <Image
              src={meta.author_image}
              alt="author image"
              width={40}
              height={40}
              className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
            />
            <h4>{meta.author}</h4>
          </div>
          <div className="mr-4 text-gray-500">
            <Date dateString={meta.date} />
          </div>
        </div>
        <article className="mt-2 blog-text">{contentHtml}</article>
      </section>
    </section>
  );
}
