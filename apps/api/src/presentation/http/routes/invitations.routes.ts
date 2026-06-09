import { Router } from 'express';
import { InvitationsController } from '../controllers/invitations.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new InvitationsController();

// GET /api/invitations/:token (Public)
router.get('/:token', controller.getInvitation.bind(controller));

// POST /api/invitations/accept (Public)
router.post('/accept', controller.acceptInvitation.bind(controller));

// POST /api/invitations (Authenticated & restricted)
router.post(
  '/',
  requireAuth,
  requireRole(['manager', 'tenant_admin', 'super_admin']),
  controller.inviteUser.bind(controller)
);

export default router;
