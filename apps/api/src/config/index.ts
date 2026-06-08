import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // ─── Server ─────────────────────────────────────────────────
  port: parseInt(process.env['PORT'] || '4000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  isDev: process.env['NODE_ENV'] !== 'production',

  // ─── Database ───────────────────────────────────────────────
  databaseUrl: process.env['DATABASE_URL'] || '',

  // ─── Redis ──────────────────────────────────────────────────
  redisUrl: process.env['REDIS_URL'] || 'redis://localhost:6379',

  // ─── JWT ────────────────────────────────────────────────────
  jwt: {
    accessSecret: process.env['JWT_ACCESS_SECRET'] || 'dev-access-secret-change-in-production',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'dev-refresh-secret-change-in-production',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },

  // ─── CORS ───────────────────────────────────────────────────
  cors: {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    credentials: true,
  },

  // ─── Rate Limiting ──────────────────────────────────────────
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100,            // 100 requests per window
    authMax: 5,          // 5 auth attempts per window
  },

  // ─── Email (placeholder for Phase 3) ───────────────────────
  email: {
    from: process.env['EMAIL_FROM'] || 'noreply@saas-platform.dev',
    provider: process.env['EMAIL_PROVIDER'] || 'console',
  },

  // ─── App ────────────────────────────────────────────────────
  appUrl: process.env['APP_URL'] || 'http://localhost:3000',
  apiUrl: process.env['API_URL'] || 'http://localhost:4000',
} as const;
