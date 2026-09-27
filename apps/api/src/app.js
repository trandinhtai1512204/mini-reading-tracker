import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { createHealthRouter } from './routes/health.js';

export function createApp({ database }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/health', createHealthRouter({ database }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
