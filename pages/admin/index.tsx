import nookies from 'nookies';
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { getAuth } from "firebase-admin/auth";
import getUser from '../../lib/getUser';

// Components
import { Layout } from '../../components/layout';
import UploadForm from '../../components/UploadForm';
import AdminLayout from 'components/AdminLayout';

const admin = () => {
  return (
    <AdminLayout title="aolausoro.tech - admin">
      <section className="flex items-center justify-center flex-grow w-full h-screen px-4 mx-auto  md:px-10">
        <div className="items-center justify-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:w-2/4 md:mx-auto">
          <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            Add latest projects
          </p>
          <UploadForm />
        </div>
      </section>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    if (!cookies.token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    const { user } = await getUser(cookies.token);

    if (!user.isAdmin) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {},
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
