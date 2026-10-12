import dotenv from 'dotenv';
import path from 'node:path';

const root = process.cwd();
const envName = process.env.ENV ?? 'dev';

// Prioridad: variables del sistema > .env.local (secretos) > .env.<ENV>
dotenv.config({ path: path.join(root, '.env.local') });
dotenv.config({ path: path.join(root, `.env.${envName}`) });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable "${name}" para el ambiente "${envName}". Revisa .env.${envName} o .env.local`);
  }
  return value;
}

export const env = {
  name: envName,
  baseURL: required('BASE_URL'),
  users: {
    standard: {
      username: required('STANDARD_USER'),
      password: required('STANDARD_PASSWORD'),
    },
  },
} as const;
