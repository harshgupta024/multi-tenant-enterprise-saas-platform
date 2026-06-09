import { Request, Response, NextFunction } from 'express';
import { getContext } from '../../../context/index.js';
import { UserRole } from '@shared/types';
import logger from '../../../infrastructure/logging/logger.js';

/**
 * Middleware to require authentication (valid user and tenant in context)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const ctx = getContext();

  if (!ctx?.userId || !ctx?.tenantId) {
    logger.warn({
      correlationId: ctx?.correlationId,
      path: req.originalUrl
    }, 'Unauthorized access attempt - Missing user or tenant context');
    
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
    return;
  }

  next();
}

/**
 * Middleware factory to require specific roles
 * Must be used after requireAuth
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ctx = getContext();

    if (!ctx?.userId || !ctx?.tenantId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
      return;
    }

    if (!ctx.userRole || !allowedRoles.includes(ctx.userRole as UserRole)) {
      logger.warn({
        correlationId: ctx.correlationId,
        userId: ctx.userId,
        tenantId: ctx.tenantId,
        userRole: ctx.userRole,
        requiredRoles: allowedRoles,
        path: req.originalUrl
      }, 'Forbidden access attempt - Insufficient permissions');

      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
}
