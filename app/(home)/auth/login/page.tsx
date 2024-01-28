import LoginForm from "./LoginForm";

export const metadata = {
  metadataBase: new URL("https://aolausoro.tech"),
  title: "aolausoro.tech - Login",
  description: "Login to your account",
  openGraph: {
    title: "aolausoro.tech - Login",
    description: "Login to your account",
  },
};

export default function Login() {
  return (
    <section className="flex items-center justify-center w-screen h-screen bg-background px-2 sm:px-0 ">
      <LoginForm />
    </section>
  );
}
