import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new UsersController();

// All user routes require authentication
router.use(requireAuth);

// GET /api/users/me
// Get current user profile
router.get('/me', controller.getProfile);

// PUT /api/users/me
// Update current user profile
router.put('/me', controller.updateProfile);

// GET /api/users
// Only managers, tenant_admins, super_admins can view all tenant users
router.get('/', requireRole(['manager', 'tenant_admin', 'super_admin']), controller.getTenantUsers);

export default router;
