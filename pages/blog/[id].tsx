import Link from 'next/link';
import Head from 'next/head';
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
  };
}

export default function Post({ postData }) {
  return (
    <Layout title={postData.title}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div className='flex flex-col h-screen'>
        <h1 className='my-4 text-4xl font-extrabold tracking-tighter'>
          {postData.title}
        </h1>
        <br />
        <div className='text-gray-700'>
          <Date dateString={postData.date} />
        </div>
        <br />
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <h2 className='my-4 text-2xl font-bold'>
          <Link href='/blog'>
            <a>Back</a>
          </Link>
        </h2>
      </div>
    </Layout>
  );
}
