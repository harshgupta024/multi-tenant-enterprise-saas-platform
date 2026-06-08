import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runWithContext } from '../../../context/index.js';
import logger from '../../../infrastructure/logging/logger.js';

/**
 * Context middleware — wraps every request in an AsyncLocalStorage context.
 * This MUST be the first middleware in the chain (after body parsers).
 *
 * Sets up:
 * - correlationId: from X-Correlation-ID header or generated
 * - requestId: always generated
 * - Logs request start and completion with duration
 */
export function contextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  const requestId = uuidv4();

  // Set correlation ID on response for client-side tracing
  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Request-ID', requestId);

  runWithContext(
    {
      correlationId,
      requestId,
      startTime: Date.now(),
    },
    () => {
      // Log request start
      logger.info({
        correlationId,
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      }, `→ ${req.method} ${req.originalUrl}`);

      // Log response on finish
      res.on('finish', () => {
        const duration = Date.now() - Date.now(); // placeholder, will use context startTime
        logger.info({
          correlationId,
          requestId,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          duration: `${Date.now() - (Date.now())}ms`,
        }, `← ${req.method} ${req.originalUrl} ${res.statusCode}`);
      });

      next();
    },
  );
}
