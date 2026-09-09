import { Router } from 'express';
import { FarmerController } from '../controllers/farmer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, FarmerController.getFarmers);
router.get('/:id', authenticate, FarmerController.getFarmerById);
router.put('/:id', authenticate, FarmerController.updateFarmer);
router.get('/:id/farms', authenticate, FarmerController.getFarmerFarms);

export const farmerRoutes = router;
