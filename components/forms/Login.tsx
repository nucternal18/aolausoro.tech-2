"use client";
import { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";

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
    reset,
    formState: { errors },
  } = useForm<IFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    handleLogin({ email: data.email, password: data.password });
    reset();
  };
  return (
    <div className="w-full">
      <h1 className="my-8 text-3xl text-center dark:text-gray-400">
        Account <span className="text-blue-700">Login</span>
      </h1>
      <form
        className="px-4 pt-6 pb-8 mx-2 mb-4 bg-white rounded shadow-lg dark:bg-gray-600 sm:mx-auto sm:w-2/4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4 w-full bg-white flex gap-1 p-1 rounded-md">
          <label
            htmlFor="email"
            className="block mb-2 text-base font-bold text-gray-700"
          />

          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border-none appearance-none focus:outline-none  focus:ring-0 bg-white"
            type="email"
            id="email"
            placeholder="Email"
            aria-label="email-input"
            aria-errormessage="email-error"
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
        <div className="mb-4 w-full bg-white flex gap-1 p-1 rounded-md">
          <label
            className="block mb-2 text-base font-bold text-gray-700"
            htmlFor="password"
          />
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border-none appearance-none focus:outline-none  focus:ring-0 bg-white"
            type={showPassword ? "text" : "password"}
            id="password"
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
          <button
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            className="p-1 font-semibold"
          >
            {showPassword ? (
              <FiEye fontSize={21} />
            ) : (
              <FiEyeOff fontSize={21} />
            )}
          </button>
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
            className="w-full px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline dark:bg-yellow-500 dark:text-gray-100 dark:hover:bg-yellow-700"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
