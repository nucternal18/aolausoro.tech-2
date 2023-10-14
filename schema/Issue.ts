import type { Prettify } from "./helpers";
import * as z from "zod";

export enum Status {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
}

export const issueSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  status: z.nativeEnum(Status),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const partialIssueSchema = issueSchema.partial();

export type IssueProps = Prettify<z.infer<typeof issueSchema>>;

export type PartialIssueProps = Prettify<z.infer<typeof partialIssueSchema>>;
