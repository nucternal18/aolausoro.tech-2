import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { POSTS_PER_PAGE } from '../config';

const postsDirectory = path.join(process.cwd(), '/blogs');

export async function getSortedPostsData(page) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFileSync(fullPath, 'utf-8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      contentHtml: content,
      ...data,
    };
  }));

  const numPages = Math.ceil(fileNames.length / POSTS_PER_PAGE);
  const pageIndex = page - 1
  const orderedPost = allPostsData.slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE)
  // Sort posts by date
  return { orderedPost, numPages }
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
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id
  return {
    id,
    contentHtml: matterResult.content,
    ...matterResult.data,
  };
}