import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { GetServerSideProps } from "next";
import { toast } from "react-toastify";

import { Layout } from "../components/layout";

// context
import { useAuth } from "../context/authContext";
import RegisterForm from "components/RegisterForm";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register(props) {
  const { state, createAccount } = useAuth();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.replace("/login");
    }
  }, [state.success]);

  const submitHandler: SubmitHandler<Inputs> = async ({
    name,
    email,
    password,
    confirmPassword,
  }) => {
    if (name === "") {
      toast.error("Please enter a valid name");
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. please check your password");
    }
    createAccount(name, email, password);
  };
  return (
    <Layout title="aolausoro.tech - login">
      {/* <RegisterForm
        submitHandler={submitHandler}
        errors={errors}
        handleSubmit={handleSubmit}
        register={register}
      /> */}
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
