import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string().default("4000"),
  BACKEND_URL: z.string().default("http://localhost:5000"),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  MAILTRAP_TOKEN: z.string().default("f262f3621d3aa21ac359dc75264a5370"),
});

export const env = EnvSchema.parse(process.env);
