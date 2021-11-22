import { Layout } from "./layout";

export default function NextErrorComponent({ statusCode }) {
  return (
    <Layout title={`${statusCode} error on server`}>
      <div className="flex flex-col items-center mt-20">
        <h1 className="my-5 text-6xl">Whoops!</h1>
        <h2 className="mb-5 text-4xl text-gray-500">
          {statusCode
            ? `A ${statusCode} error occurred on server`
            : "An error occurred on client"}
        </h2>
      </div>
    </Layout>
  );
}

NextErrorComponent.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const hasGetInitialPropsRun = true;
  return { statusCode, hasGetInitialPropsRun };
};
