import Head from 'next/head';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { Layout } from '../../components/layout';
import Date from '../../components/date';

const Blog = ({ allPostsData }) => {
  return (
    <Layout title='aolausoro.tech - blog'>
      <Head>
        <title>aolausoro.tech - blog</title>
      </Head>

      <section className='w-screen -mt-64 dark:bg-black dark:text-white'>
        <h1 className='text-3xl font-bold'>My Blog</h1>

        <div className='flex flex-col'>
          <ul className='p-0 m-0 list-none'>
            {allPostsData.map(({ id, date, title }) => (
              <li className='py-2 text-2xl' key={id}>
                <div className='relative flex flex-col px-4 py-2 mb-2 bg-white rounded-b shadow'>
                  <h2>{title}</h2>
                  <h3 className='my-1 font-bold'>
                    <Link href={`/blog/${id}`}>
                      <a>{id}</a>
                    </Link>
                  </h3>
                  <small className='text-gray-700'>
                    <Date dateString={date} />
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default Blog;
