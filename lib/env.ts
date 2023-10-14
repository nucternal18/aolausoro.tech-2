/* eslint-disable @typescript-eslint/no-namespace */
import * as zod from "zod";

export const envSchema = zod.object({
  USER_EMAIL: zod.string(),
  USER_PASS: zod.string(),
  CLOUDINARY_NAME: zod.string(),
  CLOUDINARY_API_KEY: zod.string(),
  CLOUDINARY_API_SECRET: zod.string(),
  NEXT_TELEMETRY_DISABLED: zod.string(),
  PRIVARE_KEY_ID: zod.string(),
  GOOGLE_CLIENT_ID: zod.string(),
  GOOGLE_CLIENT_SECRET: zod.string(),
  NEXTAUTH_URL: zod.string(),
  NEXTAUTH_SECRET: zod.string(),
  JWT_SIGNING_PRIVATE_KEY: zod.string(),
  DATABASE_URL: zod.string(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: zod.string(),
  RECAPTCHA_SITE_KEY: zod.string(),
  __NEXT_PRIVATE_PREBUNDLED_REACT: zod.string(),
  REPO_TOKEN: zod.string(),
});

export type Env = zod.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
