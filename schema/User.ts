import { issueSchema } from "./Issue";
import { jobSchema } from "./Job";
import { projectSchema } from "./Project";
import type { Prettify } from "./helpers";
import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  image: z.string().url(),
  isAdmin: z.boolean(),
  password: z
    .string()
    .min(7)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})/, {
      message:
        "Password must contain at least 7 characters, one uppercase, one lowercase, one special character and one number.",
    }),
  emailVerified: z.string().optional(),
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
  password: z
    .string()
    .min(7)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})/, {
      message:
        "Password must contain at least 7 characters, one uppercase, one lowercase, one special character and one number.",
    }),
});

export const partialUserSchema = userSchema.partial();

export type UserProps = Prettify<z.infer<typeof userSchema>>;

export type PartialUserProps = Prettify<z.infer<typeof partialUserSchema>>;
