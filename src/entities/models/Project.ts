import * as z from "zod";
import type { Prettify } from "./helpers";

export const projectSchema = z.object({
  id: z.string(),
  address: z.string().url(),
  github: z.string().url(),
  projectName: z.string(),
  description: z.string(),
  published: z.boolean(),
  techStack: z.array(z.string()),
  controlledTechStack: z.array(z.object({ content: z.string() })),
  url: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const partialProjectSchema = projectSchema.partial();

export type ProjectProps = Prettify<z.infer<typeof projectSchema>>;

export type PartialProjectProps = Prettify<
  z.infer<typeof partialProjectSchema>
>;
