import { redirect } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    // Check if it's a redirect error by checking the error message
    // In Next.js 16, redirect() throws a NEXT_REDIRECT error
    if (err.message.includes("NEXT_REDIRECT")) {
      throw err;
    }
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}
