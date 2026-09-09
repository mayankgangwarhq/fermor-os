import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong on the server';
  let errors: any[] | undefined = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors.length > 0 ? err.errors : undefined;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  } else if (err.message) {
    message = err.message;
  }

  logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
};
