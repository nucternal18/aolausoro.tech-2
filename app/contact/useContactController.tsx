"use client";

import { useCallback, useState, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

// redux
import {
  useCreateMessageMutation,
  useSendMailMutation,
} from "app/GlobalReduxStore/features/messages/messagesApiSlice";

// components
import { useToast } from "@components/ui/use-toast";

// zod schemas
import { partialMessageSchema, type PartialMessageProps } from "schema/Message";

export default function useContactController() {
  const { toast } = useToast();
  const [createMessage] = useCreateMessageMutation();
  const [sendMail] = useSendMailMutation();
  const form = useForm<PartialMessageProps>({
    resolver: zodResolver(partialMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit: SubmitHandler<PartialMessageProps> = useCallback(
    async (data) => {
      const token = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

      const newMessage: PartialMessageProps & { token: string } = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        token: token as string,
      };
      try {
        const sendMailResponse = await sendMail(newMessage).unwrap();
        if (sendMailResponse.success) {
          await createMessage(newMessage).unwrap();
          form.reset();
          toast({
            title: "Success",
            description: "Message sent successfully",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Unable to send message. Please try again.",
        });
      }
    },
    [],
  );

  return {
    form,
    handleSubmit,
    recaptchaRef,
  };
}
