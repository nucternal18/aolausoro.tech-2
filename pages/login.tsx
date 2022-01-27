import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { toast } from "react-toastify";

import { Layout } from "../components/layout";
import LoginForm from "components/Login";

// context
import { useGlobalApp } from "../context/appContext";
import { ActionType } from "context/appActions";

type Inputs = {
  email: string;
  password: string;
};

export default function Login(props) {
  const { dispatch } = useGlobalApp();
  const router = useRouter();

  const submitHandler = async ({ email, password }: Inputs) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result.error) {
      toast.error("Invalid email or password");
    }
    if (result.ok) {
      const session = await getSession();

      dispatch({
        type: ActionType.FETCH_USER_SUCCESS,
        payload: session.user,
      });
      router.push("/admin");
    }
  };

  return (
    <Layout title="aolausoro.tech - login">
      <section className="flex items-center justify-center">
        <LoginForm handleLogin={submitHandler} />
      </section>
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
