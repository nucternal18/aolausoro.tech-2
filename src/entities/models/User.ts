import { issueSchema } from "./Issue";
import { jobSchema } from "./Job";
import { projectSchema } from "./Project";
import type { Prettify } from "./helpers";
import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  displayName: z.string().min(2).max(50),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  image: z.string().url(),
  isAdmin: z.boolean(),
  clerkId: z.string(),
  cvUrl: z.string().url().optional(),
  emailVerified: z.date().optional(),
  projects: z.lazy(() => z.array(projectSchema)),
  jobs: z.lazy(() => z.array(jobSchema)),
  issues: z.lazy(() => z.array(issueSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export const partialUserSchema = userSchema.partial();

export type UserProps = Prettify<z.infer<typeof userSchema>>;

export type PartialUserProps = Prettify<z.infer<typeof partialUserSchema>>;
