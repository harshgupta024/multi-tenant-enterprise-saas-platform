import { Request, Response, NextFunction } from 'express';
import { prisma } from '@saas/database';
import { runWithContext, getContext } from '../../../context/index.js';

/**
  * Middleware to validate and bind Tenant ID from the request header or query parameter.
  * Ensures that requests to tenant-specific routes have a valid existing tenant context.
  */
export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const tenantId = (req.headers['x-tenant-id'] as string) || (req.query['tenantId'] as string);

  if (!tenantId) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_TENANT_ID',
        message: 'X-Tenant-ID header or tenantId query parameter is required for this route.',
      },
    });
    return;
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, status: true },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        error: {
          code: 'TENANT_NOT_FOUND',
          message: `Tenant with ID '${tenantId}' does not exist.`,
        },
      });
      return;
    }

    if (tenant.status !== 'active' && tenant.status !== 'pending') {
      res.status(403).json({
        success: false,
        error: {
          code: 'TENANT_INACTIVE',
          message: `Tenant is currently ${tenant.status}. Access is restricted.`,
        },
      });
      return;
    }

    // Bind tenant context dynamically into the active AsyncLocalStorage context
    const currentCtx = getContext();
    if (currentCtx) {
      currentCtx.tenantId = tenant.id;
      next();
    } else {
      // Fallback if contextMiddleware didn't run
      runWithContext({ tenantId: tenant.id }, () => next());
    }
  } catch (error) {
    next(error);
  }
}
