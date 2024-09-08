import * as z from "zod";
import type { Prettify } from "./helpers";
import type { Wiki } from "@prisma/client";

export const wikiSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  description: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  isImage: z.boolean(),
  updatedAt: z.date(),
  userId: z.string(),
});

export const partialWikiSchema = wikiSchema.partial();

export type WikiProps = Prettify<z.infer<typeof wikiSchema>>;

export type PartialWikiProps = Prettify<z.infer<typeof partialWikiSchema>>;
