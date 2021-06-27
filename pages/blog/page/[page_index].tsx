import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { getSortedPostsData } from '../../../lib/posts';
import { Layout } from '../../../components/layout';
import Date from '../../../components/date';
import BlogItem from '../../../components/Blog';
import Pagination from '../../../components/Pagination';
import { POSTS_PER_PAGE } from '../../../config';

const postsDirectory = path.join(process.cwd(), '/blogs');

export default function BlogPage({ posts, numPages, currentPage }) {
  return (
    <Layout title='aolausoro.tech - blog'>
      <section className='mx-2 -mt-16 md:mx-0 md:-mt-48'>
        <h1 className='p-5 text-5xl font-bold border-b-4 border-current dark:border-yellow-500 dark:text-gray-100'>
          Blog
        </h1>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {posts
            .sort((postA, postB) => (postA.date > postB.date ? -1 : 1))
            .map((post) => (
              <BlogItem key={post.id} post={post} />
            ))}
        </div>
        <Pagination currentPage={currentPage} numPages={numPages} />
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const fileNames = fs.readdirSync(postsDirectory);
  const numPages = Math.ceil(fileNames.length / POSTS_PER_PAGE);

  const paths = [];
  for (let i = 1; i <= numPages; i++) {
    paths.push({
      params: { page_index: i.toString() },
    });
  }
  console.log(paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = parseInt((params && params.page_index) || 1);
  const { orderedPost, numPages } = await getSortedPostsData(page);
  return {
    props: {
      posts: orderedPost,
      numPages,
      currentPage: page,
    },
  };
}
