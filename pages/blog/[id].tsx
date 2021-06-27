import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import CategoryLabel from '../../components/CategoryLabel';
import { Layout } from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
    revalidate: 600,
  };
}

export default function Post({ postData }) {
  return (
    <Layout title={postData.title}>
      <section className='flex-grow h-full text-black dark:text-gray-100'>
        <Link href='/blog'>
          <a className='my-4 text-2xl font-bold '>Go Back</a>
        </Link>
        <div className='w-full px-10 py-6 mt-6 bg-gray-100 rounded-lg shadow-ld dark:shadow-lg dark:text-gray-800'>
          <div className='flex items-center justify-between mt-4'>
            <h1 className='text-5xl mb-7 '>{postData.title}</h1>
            <CategoryLabel>{postData.category}</CategoryLabel>
          </div>
          <img src={postData.cover_image} alt='' className='w-full rounded' />
          <div className='flex items-center justify-between p-2 my-8 bg-gray-300'>
            <div className='flex items-center'>
              <img
                src={postData.author_image}
                alt=''
                className='hidden object-cover w-10 h-10 mx-4 rounded-full sm:block'
              />
              <h4>{postData.author}</h4>
            </div>
            <div className='mr-4 text-gray-500'>
              <Date dateString={postData.date} />
            </div>
          </div>
          <div className='mt-2 blog-text'>
            <ReactMarkdown>{postData.contentHtml}</ReactMarkdown>
          </div>
        </div>
      </section>
    </Layout>
  );
}
