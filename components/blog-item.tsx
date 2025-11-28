import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import CategoryLabel from "./category-label";

import getFormattedDateString from "lib/getFormattedDateString";
import type { BlogPost } from "types/index";

export default function BlogItem({ post }: { post: BlogPost["meta"] }) {
  const formattedDate = getFormattedDateString(post.date);
  return (
    <div className="px-4 py-6 mt-6 w-full bg-white rounded-lg shadow-md">
      <Image
        src={post.cover_image}
        alt="Do something great"
        width={620}
        height={420}
        className="mb-4 rounded"
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <span className="font-light text-gray-600">{formattedDate}</span>
          {post.readTime && (
            <div className="flex gap-1 items-center text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{post.readTime}</span>
            </div>
          )}
        </div>
        <CategoryLabel variant={post.category} />
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
      <div className="flex justify-between items-center mt-6">
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
            className="hidden object-cover mx-4 w-10 h-10 rounded-full sm:block"
          />
          <h3 className="text-sm font-bold text-gray-700">{post.author}</h3>
        </div>
      </div>
    </div>
  );
}
