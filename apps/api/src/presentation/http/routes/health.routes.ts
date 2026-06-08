import { Router, Request, Response } from 'express';
import { prisma } from '@saas/database';

const router: Router = Router();

/**
 * GET /api/health
 * Liveness + readiness probe for container orchestration.
 * Checks database connectivity and returns system status.
 */
router.get('/health', async (_req: Request, res: Response) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
    checks: {
      database: 'unknown' as string,
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    healthcheck.checks.database = 'connected';
  } catch {
    healthcheck.checks.database = 'disconnected';
    healthcheck.status = 'degraded';
  }

  const statusCode = healthcheck.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthcheck);
});

/**
 * GET /api/health/ready
 * Readiness probe — only returns 200 when all dependencies are available.
 */
router.get('/health/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});

export default router;
