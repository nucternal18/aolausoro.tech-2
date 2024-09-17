"use server";

import prisma from "@lib/prismadb";
import type { PartialIssueProps } from "@src/entities/models/Issue";

export async function getIssues() {
  // TODO: Implement this function
}

export async function getIssueById(id: string) {
  // TODO: Implement this function
}

export async function createIssue(input: PartialIssueProps) {
  // TODO: Implement this function
}

export async function updateIssue(input: PartialIssueProps) {
  // TODO: Implement this function
}

export async function deleteIssue(id: string) {
  // TODO: Implement this function
}
