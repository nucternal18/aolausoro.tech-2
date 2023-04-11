import LoginForm from "components/forms/LoginForm";

export function metadata() {
  return {
    title: "aolausoro.tech - Login",
    description: "Login to your account",
    openGraph: {
      title: "aolausoro.tech - Login",
      description: "Login to your account",
    },
  };
}

export default function Login() {
  return (
    <section className="flex items-center justify-center h-screen">
      <LoginForm />
    </section>
  );
}