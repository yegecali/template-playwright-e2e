import { env } from '../config/env';

// Credenciales que dependen del ambiente (vienen de .env.<ENV> / .env.local)
export const users = env.users;
