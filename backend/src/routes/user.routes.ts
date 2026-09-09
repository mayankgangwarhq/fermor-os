import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, UserController.getUsers);
router.get('/:id', authenticate, UserController.getUserById);
router.put('/:id', authenticate, UserController.updateUser);
router.delete('/:id', authenticate, UserController.deleteUser);

export const userRoutes = router;
