import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

interface IFormInputs {
  email: string;
  password: string;
}
interface ILogin {
  handleLogin: ({ email, password }: IFormInputs) => void;
}

function LoginForm({ handleLogin }: ILogin) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    handleLogin({ email: data.email, password: data.password });
  };
  return (
    <section className="container mx-auto mb-4 md:flex-grow">
      <h1 className="my-8 text-3xl text-center dark:text-gray-400">
        Account <span className="text-blue-700">Login</span>
      </h1>
      <form
        className="px-8 pt-6 pb-8 mx-2 mb-4 bg-white rounded shadow-lg dark:bg-gray-600 sm:mx-auto sm:w-2/4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-base font-bold text-gray-700"
          />

          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
            type="email"
            id="email"
            placeholder="Email"
            aria-label="email-input"
            aria-errormessage="email-error"
            name="email"
            aria-invalid="true"
            {...register("email", {
              required: "This is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            })}
          />
        </div>
        {errors.email && (
          <span id="email-error" className="text-gray-800 dark:text-yellow-500">
            {errors.email.message}
          </span>
        )}
        <div className="mb-4">
          <label
            className="block mb-2 text-base font-bold text-gray-700"
            htmlFor="password"
          />
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            aria-label="password-input"
            aria-errormessage="password-error"
            aria-invalid="true"
            {...register("password", {
              required: "This is required",
              minLength: {
                value: 7,
                message: "Please enter a password with at least 7 characters",
              },
              maxLength: {
                value: 15,
                message: "Please enter a password not more than 15 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})/,
                message:
                  "Password must contain at least one uppercase letter, one number and one special character",
              },
            })}
          />
        </div>
        {errors.password && (
          <span
            id="password-error"
            className="text-gray-800 dark:text-yellow-500"
          >
            {errors.password.message}
          </span>
        )}
        <div className="flex items-center justify-between mt-2">
          <button
            className="w-2/4 px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline dark:bg-yellow-500 dark:text-gray-100 dark:hover:bg-yellow-700"
            type="submit"
          >
            Login
          </button>
          <button
            className="w-2/4 flex items-center justify-center px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline dark:bg-yellow-500 dark:text-gray-100 dark:hover:bg-yellow-700"
            type="button"
            onClick={() => signIn()}
          >
            <span>SignIn with Google</span>
            <FaGoogle className="ml-2 text-green-500" />
          </button>
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
