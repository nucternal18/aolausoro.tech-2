import Link from "next/link";
import ReactMarkdown from "react-markdown";

import CategoryLabel from "../../../components/CategoryLabel";
import { getPostData, getSortedPostsData } from "../../../lib/posts";
import Date from "../../../components/date";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const { orderedPost } = getSortedPostsData(1);
  return orderedPost.map((post) => ({
    params: {
      id: post.id,
    },
  }));
}

export function generateMetaData({ params }: { params: { id: string } }) {
  const { orderedPost } = getSortedPostsData(1);
  const { id } = params;

  const post = orderedPost.find((post) => post.id === id);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: `${post.title} | aolausoro.tech`,
  };
}

export default async function Post({ params }: { params: { id: string } }) {
  const { orderedPost } = getSortedPostsData(1);
  const { id } = params;

  if (!orderedPost.find((post) => post.id === id)) {
    return notFound();
  }

  const post = await getPostData(id);

  return (
    <section className="flex-grow h-full max-w-screen-lg mx-auto text-black dark:text-gray-100">
      <button className="flex items-center justify-center px-4 py-1 font-medium text-center text-yellow-500 transition duration-200 ease-in border border-yellow-500 rounded shadow active:bg-yellow-500 active:text-white focus:outline-none">
        <Link href="/blog" className="text-2xl font-bold ">
          Go Back
        </Link>
      </button>
      <div className="w-full px-10 py-6 mt-6 bg-gray-100 rounded-lg shadow-ld dark:shadow-lg dark:text-gray-800">
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-5xl mb-7 ">{post.title}</h1>
          <CategoryLabel>{post.category}</CategoryLabel>
        </div>
        <img src={post.cover_image} alt="" className="w-full rounded" />
        <div className="flex items-center justify-between p-2 my-8 bg-gray-300">
          <div className="flex items-center">
            <img
              src={post.author_image}
              alt=""
              className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
            />
            <h4>{post.author}</h4>
          </div>
          <div className="mr-4 text-gray-500">
            <Date dateString={post.date} />
          </div>
        </div>
        <div className="mt-2 blog-text">
          <ReactMarkdown>{post.contentHtml}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
