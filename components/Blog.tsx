import Link from "next/link";
import Image from "next/image";
import CategoryLabel from "./CategoryLabel";
import { BlogPost } from "types/types";
import getFormattedDateString from "lib/getFormattedDateString";

export default function BlogItem({ post }: { post: BlogPost["meta"] }) {
  console.log("🚀 ~ file: Blog.tsx:8 ~ BlogItem ~ post:", post);
  const formattedDate = getFormattedDateString(post.date);
  return (
    <div className="w-full px-10 py-6 mt-6 bg-white rounded-lg shadow-md">
      <Image
        src={post.cover_image}
        alt="Do something great"
        width={620}
        height={420}
        className="mb-4 rounded"
      />
      <div className="flex items-center justify-between">
        <span className="font-light text-gray-600">{formattedDate}</span>
        <CategoryLabel>{post.category}</CategoryLabel>
      </div>
      <div className="mt-2">
        <Link
          href={`/blog/${post.id}`}
          className="text-2xl font-bold text-gray-700 hover:underline"
        >
          {post.title}
        </Link>
        <p className="mt-2 text-gray-600">{post.excerpt}</p>
      </div>
      <div className="flex items-center justify-between mt-6">
        <Link
          href={`/blog/${post.id}`}
          className="text-sm text-gray-900 hover:text-blue-600"
        >
          Read More
        </Link>
        <div className="flex items-center">
          <img
            src={post.author_image}
            alt=""
            className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
          />
          <h3 className="text-sm font-bold text-gray-700">{post.author}</h3>
        </div>
      </div>
    </div>
  );
}
