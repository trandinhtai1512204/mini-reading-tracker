import { AppError } from '../errors/app-error.js';

export function notFoundHandler(request, response, next) {
  next(
    new AppError({
      status: 404,
      code: 'NOT_FOUND',
      message: `Route ${request.method} ${request.originalUrl} was not found.`,
    }),
  );
}

export function errorHandler(error, _request, response, _next) {
  let appError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    appError = new AppError({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request body must be valid JSON.',
    });
  } else {
    appError = new AppError({
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected server error occurred.',
    });
  }

  const body = {
    error: {
      code: appError.code,
      message: appError.message,
    },
  };

  if (appError.details) {
    body.error.details = appError.details;
  }

  response.status(appError.status).json(body);
}
