import { Router } from 'express';
import { DiseaseController } from '../controllers/disease.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { aiVisionRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/', DiseaseController.getDiseases);
router.get('/:id', DiseaseController.getDiseaseById);
router.post('/detect', aiVisionRateLimiter, optionalAuth, DiseaseController.detectDisease);
router.post('/analyze', aiVisionRateLimiter, optionalAuth, DiseaseController.detectDisease);
router.post('/', DiseaseController.createDisease);

export const diseaseRoutes = router;
