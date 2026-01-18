import { env } from './env';

export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  debug: (msg: string) => {
    if (env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${msg}`);
    }
  },
};
