import { createClient } from 'redis';
import { env } from './env';

export const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  password: env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error', err);
});

/**
 * Connect Redis safely (idempotent)
 */
export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('⚡ Redis connected');
  }
}
