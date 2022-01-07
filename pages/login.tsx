import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { toast } from "react-toastify";

import { Layout } from "../components/layout";
import LoginForm from "components/Login";

// context
import { useAuth } from "../context/authContext";

type Inputs = {
  email: string;
  password: string;
};

export default function Login(props) {
  const { state } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;

  const submitHandler = async ({ email, password }) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result.error) {
      toast.error("Invalid email or password");
    }
    if (result.ok) {
      router.push("/admin");
    }
  };

  return (
    <Layout title="aolausoro.tech - login">
      <LoginForm handleLogin={submitHandler} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const req = context.req;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};
