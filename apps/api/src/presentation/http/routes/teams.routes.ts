import { Router } from 'express';
import { TeamsController } from '../controllers/teams.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new TeamsController();

// All team routes require authentication
router.use(requireAuth);

// GET /api/teams
// Any authenticated user can list teams
router.get('/', controller.getTeams);

// GET /api/teams/:id
// Any authenticated user can view a specific team
router.get('/:id', controller.getTeamById);

// POST /api/teams
// Only managers, tenant_admins, super_admins can create teams
router.post('/', requireRole(['manager', 'tenant_admin', 'super_admin']), controller.createTeam);

// PUT /api/teams/:id
// Only managers, tenant_admins, super_admins can update teams
router.put('/:id', requireRole(['manager', 'tenant_admin', 'super_admin']), controller.updateTeam);

// DELETE /api/teams/:id
// Only tenant_admins and super_admins can delete teams
router.delete('/:id', requireRole(['tenant_admin', 'super_admin']), controller.deleteTeam);

export default router;
