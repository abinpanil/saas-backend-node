import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load env file based on NODE_ENV
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
});

// Fallback (optional)
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV,

  PORT: Number(process.env.PORT) || 3000,
  API_VERSION: process.env.API_VERSION || 'v1',

  // Database
  DB_HOST: required('DB_HOST'),
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USERNAME: required('DB_USERNAME'),
  DB_PASSWORD: required('DB_PASSWORD'),
  DB_DATABASE: required('DB_DATABASE'),

  // Redis
  REDIS_HOST: required('REDIS_HOST'),
  REDIS_PORT: Number(process.env.REDIS_PORT || 6379),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Auth
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Security
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS || 10),

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['*'],

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
