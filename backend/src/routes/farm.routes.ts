import { Router } from 'express';
import { FarmController } from '../controllers/farm.controller';
import { validateFarm } from '../middleware/validate.middleware';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, FarmController.getFarms);
router.get('/:id', FarmController.getFarmById);
router.post('/', optionalAuth, validateFarm, FarmController.createFarm);
router.put('/:id', FarmController.updateFarm);
router.delete('/:id', FarmController.deleteFarm);

export const farmRoutes = router;
