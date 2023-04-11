import * as fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { POSTS_PER_PAGE } from "../config";
import { BlogPost } from "./types";

const postsDirectory = path.join(process.cwd(), "/blogs");

export function getSortedPostsData(page: number) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    const blogPost: BlogPost = {
      id,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      cover_image: data.cover_image,
      category: data.category,
      author: data.author,
      author_image: data.author_image,
    };

    // Combine the data with the id
    return blogPost;
  });

  const numPages = Math.ceil(fileNames.length / POSTS_PER_PAGE);
  const pageIndex = page - 1;
  const orderedPost = allPostsData.slice(
    pageIndex * POSTS_PER_PAGE,
    (pageIndex + 1) * POSTS_PER_PAGE
  );
  // Sort posts by date
  // return { orderedPost, numPages }
  return {
    orderedPost: orderedPost.sort((a, b) => (a.date < b.date ? 1 : -1)),
    numPages,
  };
}
// .sort((a, b) => a.date < b.date ? 1 : -1)
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  const blogWithHtml: BlogPost & { contentHtml: string } = {
    id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    excerpt: matterResult.data.excerpt,
    cover_image: matterResult.data.cover_image,
    category: matterResult.data.category,
    author: matterResult.data.author,
    author_image: matterResult.data.author_image,
    contentHtml,
  };

  // Combine the data with the id
  return blogWithHtml;
}
