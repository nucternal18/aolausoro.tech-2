import type { Prettify } from "./helpers";
import * as z from "zod";

export const messageSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  message: z.string(),
  name: z.string(),
  subject: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const partialMessageSchema = messageSchema.partial();

export type MessageProps = Prettify<z.infer<typeof messageSchema>>;

export type PartialMessageProps = Prettify<
  z.infer<typeof partialMessageSchema>
>;
