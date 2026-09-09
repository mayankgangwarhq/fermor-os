import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, AlertController.getAlerts);
router.get('/:id', AlertController.getAlertById);
router.post('/', optionalAuth, AlertController.createAlert);
router.put('/:id/read', AlertController.markRead);
router.put('/read-all', optionalAuth, AlertController.markAllRead);
router.delete('/:id', AlertController.deleteAlert);

export const alertRoutes = router;
