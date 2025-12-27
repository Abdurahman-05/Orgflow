import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string().default("4000"),
  BACKEND_URL: z.string().default("http://localhost:5000"),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

export const env = EnvSchema.parse(process.env);
