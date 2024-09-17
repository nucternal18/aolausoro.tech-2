import * as z from "zod";
import type { Prettify } from "./helpers";

export const cvSchema = z.object({
  id: z.string(),
  cvUrl: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const partialCvSchema = cvSchema.partial();

export type CvProps = Prettify<z.infer<typeof cvSchema>>;

export type PartialCvProps = Prettify<z.infer<typeof partialCvSchema>>;
