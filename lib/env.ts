import * as zod from "zod";

export const envSchema = zod.object({
  CLOUDINARY_NAME: zod.string(),
  CLOUDINARY_API_KEY: zod.string(),
  CLOUDINARY_API_SECRET: zod.string(),
  NEXT_TELEMETRY_DISABLED: zod.string(),
  DATABASE_URL: zod.string(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: zod.string(),
  RECAPTCHA_SITE_KEY: zod.string(),
  __NEXT_PRIVATE_PREBUNDLED_REACT: zod.string(),
  REPO_TOKEN: zod.string(),
  NEXT_PUBLIC_API_URL: zod.string(),
});

export type Env = zod.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
