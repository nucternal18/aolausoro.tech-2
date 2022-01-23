import React from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { Layout } from "components/layout";
import UserProfileComponent from "components/UserProfile";

const randomImage =
  "https://source.unsplash.com/random/1600x900/?coder-setup,code";

function UserProfile({ user }) {
  return (
    <Layout title="user-profile">
      <UserProfileComponent randomImage={randomImage} user={user} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { id } = ctx.params;
  const req = ctx.req;
  const session = await getSession({ req });
  if (!session) {
    // If no token is present redirect user to the login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    }, // will be passed to the page component as props
  };
};

export default UserProfile;
