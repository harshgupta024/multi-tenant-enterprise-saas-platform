import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new AuditController();

// GET /api/audit-logs (Authenticated & Restricted to admins)
router.get(
  '/',
  requireAuth,
  requireRole(['tenant_admin', 'super_admin']),
  controller.getAuditLogs.bind(controller)
);

export default router;
