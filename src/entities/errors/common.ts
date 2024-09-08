import { Prisma } from "@prisma/client";

interface ErrorResponse {
  status: number;
  message: string;
}

export class DatabaseOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InputParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class PrismaErrorHandler {
  /**
   * Handles Prisma errors and returns appropriate status and message.
   * @param error - The error object thrown by Prisma.
   * @returns An object containing status and message.
   */
  public static handle(error: unknown): ErrorResponse {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(error);
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

  /**
   * Handles known request errors thrown by Prisma.
   * @param error - The known request error object from Prisma.
   * @returns An object containing status and message.
   */
  private static handleKnownRequestError(
    error: Prisma.PrismaClientKnownRequestError,
  ): ErrorResponse {
    switch (error.code) {
      case "P2002":
        // Unique constraint failed
        return {
          status: 409,
          message: "A user with this email already exists",
        };
      // Add more cases to handle other known errors as needed
      default:
        return { status: 400, message: error.message };
    }
  }
}
