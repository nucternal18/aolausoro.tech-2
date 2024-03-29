/* eslint-disable import/no-anonymous-default-export */
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

/**
 * @description method to get all projects
 * @param req
 * @returns
 */
export async function GET(req: Request) {
  const projects = await prisma.project.findMany({});

  if (projects) {
    return NextResponse.json(projects);
  } else {
    return new Response("No projects found", {
      status: 400,
    });
  }
}
