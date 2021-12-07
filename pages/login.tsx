import React, { useState } from "react";
import { useRouter } from "next/router";

import { Layout } from "../components/layout";
import LoginForm from "components/Login";

// context
import { useAuth } from "../context/authContext";

export default function Login(props) {
  const { state, loginHandler } = useAuth();
  const router = useRouter();

  // const createUser = (e) => {
  //   e.preventDefault();
  //   createAccount(email, password);
  //   setEmail('');
  //   setPassword('');
  // };

  if (state.isAuthenticated) {
    router.push("/admin");
  }

  return (
    <Layout title="aolausoro.tech - login">
      <LoginForm error={state.error} handleLogin={loginHandler} />
    </Layout>
  );
}
