import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(currentDirectory, '../../../../');

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  MYSQL_HOST: z.string().trim().min(1, 'MYSQL_HOST is required.'),
  MYSQL_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  MYSQL_DATABASE: z.string().trim().min(1, 'MYSQL_DATABASE is required.'),
  MYSQL_USER: z.string().trim().min(1, 'MYSQL_USER is required.'),
  MYSQL_PASSWORD: z.string().min(1, 'MYSQL_PASSWORD is required.'),
});

export function loadEnvironment({ env = process.env, envFile = env.ENV_FILE } = {}) {
  dotenv.config({ path: envFile ?? resolve(repositoryRoot, '.env') });

  const parsed = environmentSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration. ${details}`);
  }

  return parsed.data;
}
