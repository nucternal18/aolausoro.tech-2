"use client";
import React, { useRef, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../Button";

// redux
import {
  useCreateMessageMutation,
  useSendMailMutation,
} from "app/GlobalReduxStore/features/messages/messagesApiSlice";
import { toast } from "react-toastify";

interface IFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  token?: string;
}

function ContactForm() {
  const [createMessage] = useCreateMessageMutation();
  const [sendMail] = useSendMailMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onSubmit: SubmitHandler<IFormData> = useCallback(async (data) => {
    const token = await recaptchaRef.current?.executeAsync();
    recaptchaRef.current?.reset();
    const newMessage: IFormData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      token: token as string,
    };
    try {
      const sendMailResponse = await sendMail(newMessage).unwrap();
      if (sendMailResponse) {
        await createMessage(newMessage).unwrap();
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again later");
    }
  }, []);

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
          aria-label="name-input"
          aria-errormessage="name-error"
          aria-invalid="true"
          {...register("name", {
            required: "This is required",
            pattern: {
              value: /^[A-Za-z_ -]+$/,
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
          placeholder="Subject"
          aria-label="subject-input"
          aria-errormessage="subject-error"
          aria-invalid="true"
          {...register("subject", {
            required: "This is required",
            maxLength: 20,
            pattern: {
              value: /^[A-Za-z0-9.?_@ -]+$/,
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
          aria-label="message-input"
          aria-errormessage="message-error"
          aria-invalid="true"
          {...register("message", {
            required: "This is required",
            pattern: {
              value: /^[A-Za-z0-9.?_@ -]+$/,
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
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
      />
    </form>
  );
}

export default ContactForm;
