import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { usePortfolio } from 'context/portfolioContext';
import AdminLayout from 'components/AdminLayout'
import getUser from 'lib/getUser';
import UploadForm from 'components/UploadForm';

function project() {
    return (
        <AdminLayout title=''>
            <section className="flex items-center justify-center flex-grow w-full h-screen px-4 mx-auto  md:px-10">
        <div className="items-center justify-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:w-2/4 md:mx-auto">
          <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            Add latest projects
          </p>
          <UploadForm />
        </div>
      </section>
        </AdminLayout>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

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
 
 
};


export default project
