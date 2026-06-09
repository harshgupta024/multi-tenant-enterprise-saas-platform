import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runWithContext } from '../../../context/index.js';
import logger from '../../../infrastructure/logging/logger.js';
import { verifyAccessToken } from '../utils/jwt.utils.js';

/**
 * Context middleware — wraps every request in an AsyncLocalStorage context.
 * Resolves Correlation ID, Request ID, and optional auth claims from authorization header or cookie.
 */
export function contextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  const requestId = uuidv4();

  // Set correlation and request IDs on response headers
  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Request-ID', requestId);

  // Extract authentication token if present
  let token: string | undefined;
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies['accessToken']) {
    token = req.cookies['accessToken'];
  }

  let userId: string | null = null;
  let tenantId: string | null = null;
  let userRole: string | null = null;

  if (token) {
    try {
      const claims = verifyAccessToken(token);
      userId = claims.userId;
      tenantId = claims.tenantId;
      userRole = claims.role;
    } catch {
      // Token is invalid/expired. Let route handlers or auth guard middleware handle 401.
    }
  }

  // Fallback check: if no token but header has X-Tenant-ID
  if (!tenantId) {
    tenantId = (req.headers['x-tenant-id'] as string) || null;
  }

  runWithContext(
    {
      correlationId,
      requestId,
      userId,
      tenantId,
      userRole,
      startTime: Date.now(),
    },
    () => {
      logger.info({
        correlationId,
        requestId,
        tenantId,
        userId,
        method: req.method,
        url: req.originalUrl,
      }, `→ ${req.method} ${req.originalUrl}`);

      res.on('finish', () => {
        const duration = Date.now() - Date.now(); // Placeholder calculation fix:
        const startTime = Date.now(); // We can compute elapsed time inside context
        logger.info({
          correlationId,
          requestId,
          statusCode: res.statusCode,
        }, `← ${req.method} ${req.originalUrl} ${res.statusCode}`);
      });

      next();
    },
  );
}
