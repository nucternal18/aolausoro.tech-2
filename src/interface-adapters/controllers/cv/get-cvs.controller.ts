import { z } from "zod";
import { startSpan } from "@sentry/nextjs";
import { cvSchema, type PartialCvProps } from "@src/entities/models/cv";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";

import { getCvsUseCase } from "@src/application/use-cases/cv/get-cvs.use-case";

function presenter(cv: PartialCvProps[]) {
  return startSpan({ name: "createTodo Presenter", op: "serialize" }, () => {
    return cv.map((cv) => ({
      id: cv.id,
      cvUrl: cv.cvUrl,
      createdAt: cv.createdAt,
    }));
  });
}

export async function getCvsController(): Promise<
  ReturnType<typeof presenter>
> {
  return await startSpan(
    {
      name: "createTodo Controller",
    },
    async () => {
      const cv = await getCvsUseCase();

      return presenter(cv);
    },
  );
}
