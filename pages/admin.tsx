import nookies from 'nookies';
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';

import { auth } from '../lib/firebaseAdmin';
import { Layout } from '../components/layout';
import UploadForm from '../components/UploadForm';

const admin = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <Layout title='aolausoro.tech - admin'>
      <main className='flex-grow'>
        <div className='items-center justify-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:w-2/4 md:mx-auto'>
          <p className='mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300'>
            Add latest projects
          </p>
          <UploadForm uid={props.uid} />
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await auth.verifyIdToken(cookies.token);
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    // the user is authenticated!
    const { uid, email } = token;

    // FETCH STUFF HERE!! 🚀

    return {
      props: token,
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();

    // `as never` prevents inference issues
    // with InferGetServerSidePropsType.
    // The props returned here don't matter because we've
    // already redirected the user.
    return { props: {} as never };
  }
};

export default admin;
