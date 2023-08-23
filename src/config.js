import { config } from 'dotenv';

config();

export const {
  PORT,
  TOKEN_KEY,
  ROOT_KEY,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SMTP_SERVICE,
  SMTP_USER,
  SMTP_PASS,
} = process.env;
