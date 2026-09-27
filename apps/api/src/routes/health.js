import { Router } from 'express';
import { AppError } from '../errors/app-error.js';

export function createHealthRouter({ database }) {
  const router = Router();

  router.get('/', async (_request, response, next) => {
    try {
      await database.ping();
      response.status(200).json({
        data: {
          status: 'ok',
          database: 'connected',
        },
      });
    } catch {
      next(
        new AppError({
          status: 503,
          code: 'DATABASE_UNAVAILABLE',
          message: 'Database is unavailable. Check the API database configuration and connection.',
        }),
      );
    }
  });

  return router;
}
