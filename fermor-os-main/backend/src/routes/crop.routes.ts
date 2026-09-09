import { Router } from 'express';
import { CropController } from '../controllers/crop.controller';
import { validateCrop } from '../middleware/validate.middleware';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, CropController.getCrops);
router.get('/:id', CropController.getCropById);
router.post('/', optionalAuth, validateCrop, CropController.createCrop);
router.put('/:id', CropController.updateCrop);
router.put('/:id/status', CropController.updateCropStatus);
router.delete('/:id', CropController.deleteCrop);

export const cropRoutes = router;
