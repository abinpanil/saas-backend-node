import express from 'express';
import cors from 'cors';
import routes from './routes';
import { env } from './config/env';
import { setupSwagger } from './docs/swagger';
import { errorMiddleware } from './common/middleware/error.middleware';

const app = express();

app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN }));

// Routes
app.use(`/api/${env.API_VERSION}`, routes);

// Swagger
setupSwagger(app);

// Error handler
app.use(errorMiddleware);

export default app;
