// utils/prismaErrorHandler.ts

import { Prisma } from "@prisma/client";

interface PrismaErrorResponse {
  status: number;
  message: string;
}

export function handlePrismaError(error: unknown): PrismaErrorResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { status: 409, message: "Item already exists" };
    } else {
      return { status: 400, message: error.message };
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return { status: 500, message: "An unknown error occurred" };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return { status: 500, message: "An internal server error occurred" };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 500,
      message: "Failed to initialize the database connection",
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return { status: 400, message: "Validation error" };
  } else {
    return { status: 500, message: "An unexpected error occurred" };
  }
}
