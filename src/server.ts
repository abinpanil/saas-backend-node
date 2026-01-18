import http from 'http';
import app from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import { connectRedis } from './config/redis';

const server = http.createServer(app);

async function start() {
  try {
    await AppDataSource.initialize();
    await connectRedis();

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed', err);
    process.exit(1);
  }
}

start();
