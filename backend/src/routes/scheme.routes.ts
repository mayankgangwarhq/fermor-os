import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller';

const router = Router();

router.get('/', SchemeController.getSchemes);
router.get('/pm-kisan', SchemeController.getPmKisanDetails);
router.get('/:id', SchemeController.getSchemeById);
router.post('/', SchemeController.createScheme);

export const schemeRoutes = router;
