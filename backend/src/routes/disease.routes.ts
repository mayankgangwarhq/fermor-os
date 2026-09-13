import { Router } from 'express';
import { DiseaseController } from '../controllers/disease.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', DiseaseController.getDiseases);
router.get('/:id', DiseaseController.getDiseaseById);
router.post('/detect', optionalAuth, DiseaseController.detectDisease);
router.post('/analyze', optionalAuth, DiseaseController.detectDisease);
router.post('/', DiseaseController.createDisease);

export const diseaseRoutes = router;
