import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../../../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

export const authRoutes = router;
export default router;
