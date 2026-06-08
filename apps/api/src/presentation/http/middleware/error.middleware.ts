import { Request, Response, NextFunction } from 'express';
import logger from '../../../infrastructure/logging/logger.js';
import { getCorrelationId } from '../../../context/index.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, string[]>;
}

/**
 * Global error handling middleware.
 * Catches all errors, logs them, and returns a consistent JSON response.
 */
export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode || 500;
  const correlationId = getCorrelationId();

  // Log error with full context
  if (statusCode >= 500) {
    logger.error({
      correlationId,
      err,
      statusCode,
    }, `Server Error: ${err.message}`);
  } else {
    logger.warn({
      correlationId,
      statusCode,
      code: err.code,
    }, `Client Error: ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: statusCode >= 500 && process.env['NODE_ENV'] === 'production'
        ? 'An unexpected error occurred'
        : err.message,
      ...(err.details && { details: err.details }),
    },
    meta: {
      correlationId,
    },
  });
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundMiddleware(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
}
