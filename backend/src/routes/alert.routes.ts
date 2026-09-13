import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, AlertController.getAlerts);
router.post('/', optionalAuth, AlertController.createAlert);
router.put('/read-all', optionalAuth, AlertController.markAllRead);
router.get('/:id', AlertController.getAlertById);
router.put('/:id/read', AlertController.markRead);
router.delete('/:id', AlertController.deleteAlert);

export const alertRoutes = router;
