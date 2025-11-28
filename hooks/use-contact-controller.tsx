"use client";

import { useCallback, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";

// components
import { useToast } from "@components/ui/use-toast";

// zod schemas

import { createMessage, sendMail } from "@app/actions/messages";
import {
  partialMessageSchema,
  type PartialMessageProps,
} from "@src/entities/models/Message";

export default function useContactController() {
  const { toast } = useToast();

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
      const formData = new FormData();
      formData.append("name", newMessage.name as string);
      formData.append("email", newMessage.email as string);
      formData.append("subject", newMessage.subject as string);
      formData.append("message", newMessage.message as string);
      formData.append("token", newMessage.token);
      try {
        const sendMailResponse = await sendMail(formData);
        if (sendMailResponse.success) {
          await createMessage(formData);
          toast({
            title: "Success",
            description: "Message sent successfully",
          });
          form.reset();
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
