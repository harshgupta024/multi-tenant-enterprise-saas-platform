import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { config } from './config/index.js';
import logger from './infrastructure/logging/logger.js';
import { contextMiddleware } from './presentation/http/middleware/context.middleware.js';
import { errorMiddleware, notFoundMiddleware } from './presentation/http/middleware/error.middleware.js';
import healthRoutes from './presentation/http/routes/health.routes.js';
import authRoutes from './presentation/http/routes/auth.routes.js';
import teamRoutes from './presentation/http/routes/teams.routes.js';
import userRoutes from './presentation/http/routes/users.routes.js';
// ─── Create Express App ─────────────────────────────────────────

const app: express.Express = express();

// ─── Security Middleware ────────────────────────────────────────

app.use(helmet({
  contentSecurityPolicy: config.isDev ? false : undefined,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID', 'X-Tenant-ID'],
}));

// ─── Body Parsing ───────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ─── Context Middleware (AsyncLocalStorage) ─────────────────────

app.use(contextMiddleware);

// ─── Routes ─────────────────────────────────────────────────────

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
// app.use('/api/audit-logs', auditLogRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// ─── Error Handling ─────────────────────────────────────────────

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ─── Start Server ───────────────────────────────────────────────

const server = app.listen(config.port, () => {
  logger.info({
    port: config.port,
    env: config.nodeEnv,
    pid: process.pid,
  }, `🚀 SaaS API Server running on port ${config.port}`);
});

// ─── Graceful Shutdown ──────────────────────────────────────────

const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Received shutdown signal, closing server...');
  server.close(async () => {
    logger.info('HTTP server closed');
    const { prisma } = await import('@saas/database');
    await prisma.$disconnect();
    logger.info('Database connection closed');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
