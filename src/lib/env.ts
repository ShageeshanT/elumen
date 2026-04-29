import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  AUTH_SECRET: z.string().min(16).default("dev-insecure-change-me-change"),
  INTERNAL_API_SECRET: z.string().min(16).default("dev-internal-change-me-too"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_DB_URL: z.string().optional(),
  COMPOSIO_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_CREDITS: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  DATABASE_FILE: z.string().optional(),
  CREDITS_PER_PURCHASE_PACKAGE: z.coerce.number().default(5000),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse(process.env);
}
