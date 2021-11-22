import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
// Components
import AdminLayout from "components/AdminLayout";
import Table2 from "components/Table2";

// Context
import { usePortfolio } from "context/portfolioContext";
import getUser from "lib/getUser";

function Projects() {
  const { state } = usePortfolio();
  return (
    <AdminLayout title="">
      <section className=" h-screen   py-10 md:px-8">
        {state.projects && <Table2 data={state.projects} />}
      </section>
    </AdminLayout>
  );
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


export default Projects;
