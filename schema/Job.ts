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

export const defaultStatsSchema = z.object({
  pending: z.number(),
  interviewing: z.number(),
  declined: z.number(),
  offer: z.number(),
});

export const monthlyApplicationsSchema = z.object({
  date: z.string(),
  totalPrice: z.number(),
});

export const statsSchema = z.object({
  defaultStats: defaultStatsSchema,
  monthlyApplicationStats: z.array(monthlyApplicationsSchema),
});

export const partialJobSchema = jobSchema.partial();

export type JobProps = Prettify<z.infer<typeof jobSchema>>;

export type JobsProps = Prettify<z.infer<typeof jobsSchema>>;

export type PartialJobProps = Prettify<z.infer<typeof partialJobSchema>>;

export type DefaultStatsProps = Prettify<z.infer<typeof defaultStatsSchema>>;

export type MonthlyApplicationProps = Prettify<
  z.infer<typeof monthlyApplicationsSchema>
>;

export type StatsProps = Prettify<z.infer<typeof statsSchema>>;
