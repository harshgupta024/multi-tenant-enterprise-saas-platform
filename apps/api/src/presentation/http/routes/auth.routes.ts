import { Router } from 'express';
import { signup, signin, refresh, signout } from '../controllers/auth.controller.js';

const router: Router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh', refresh);
router.post('/signout', signout);

export default router;
