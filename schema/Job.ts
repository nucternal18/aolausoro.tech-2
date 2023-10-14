import * as z from "zod";
import type { Prettify } from "./helpers";

export const jobSchema = z.object({
  id: z.string(),
  company: z.string(),
  createdBy: z.string(),
  jobLocation: z.string(),
  jobType: z.string(),
  position: z.string(),
  status: z.string(),
  sort: z.string(),
  search: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const jobsSchema = z.object({
  jobs: z.array(jobSchema),
  totalJobs: z.number(),
  numberOfPages: z.number(),
});

export const partialJobSchema = jobSchema.partial();

export type JobProps = Prettify<z.infer<typeof jobSchema>>;

export type JobsProps = Prettify<z.infer<typeof jobsSchema>>;

export type PartialJobProps = Prettify<z.infer<typeof partialJobSchema>>;
