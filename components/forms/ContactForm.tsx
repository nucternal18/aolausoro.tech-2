import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../Button";

interface IFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  token?: string;
}

function ContactForm({ submitHandler }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();
  const recaptchaRef = useRef<ReCAPTCHA>();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    const newMessage: IFormData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      token,
    };
    submitHandler(newMessage);
  };

  return (
    <form
      className="w-full px-4 py-4   border border-gray-600 rounded dark:bg-gray-900 md:mx-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-2 text-current bg-transparent dark:text-gray-700 dark:bg-gray-100">
        <label
          htmlFor="name"
          className="block  text-base font-bold text-gray-700"
        />
        <input
          className="w-full px-3 py-2 leading-tight text-current border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
          type="text"
          id="name"
          placeholder="Name"
          name="name"
          aria-label="name-input"
          aria-errormessage="name-error"
          aria-invalid="true"
          {...register("name", {
            required: "This is required",
            pattern: {
              value: /^[A-Za-z -]+$/,
              message: "Please enter your name",
            },
          })}
        />
      </div>
      {errors.name && (
        <span id="name-error" className="text-gray-800 dark:text-yellow-500">
          {errors.name.message}
        </span>
      )}
      <div className="my-2 text-current bg-transparent dark:text-gray-700">
        <label
          htmlFor="email"
          className="block text-base font-bold text-gray-700"
        />
        <input
          className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
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
      <div className="my-2 text-current bg-transparent dark:text-gray-700">
        <label
          htmlFor="subject"
          className="block  text-base font-bold text-gray-700"
        />
        <input
          className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
          type="text"
          id="subject"
          name="subject"
          placeholder="Subject"
          aria-label="subject-input"
          aria-errormessage="subject-error"
          aria-invalid="true"
          {...register("subject", {
            required: "This is required",
            maxLength: 20,
            pattern: {
              value: /^[A-Za-z ]+$/,
              message: "Please enter a subject",
            },
          })}
        />
      </div>
      {errors.subject && (
        <span id="subject-error" className="text-gray-800 dark:text-yellow-500">
          {errors.subject.message}
        </span>
      )}
      <div className="my-2 text-current bg-transparent dark:text-gray-700">
        <label
          htmlFor="message"
          className="block  text-base font-bold text-gray-700"
        />
        <textarea
          className="w-full h-48 px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
          id="message"
          rows={5}
          placeholder="Message..."
          name="message"
          aria-label="message-input"
          aria-errormessage="message-error"
          aria-invalid="true"
          {...register("message", {
            required: "This is required",
            pattern: {
              value: /^[A-Za-z ]+$/i,
              message: "Please enter a message",
            },
          })}
        />
      </div>
      {errors.message && (
        <span id="message-error" className="text-gray-800 dark:text-yellow-500">
          {errors.message.message}
        </span>
      )}
      <Button
        type="submit"
        color="yellow"
        className="w-full dark:text-white dark:bg-yellow-500 mt-2"
      >
        Send
      </Button>

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      />
    </form>
  );
}

export default ContactForm;
