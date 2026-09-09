import { Router } from 'express';
import { PestController } from '../controllers/pest.controller';

const router = Router();

router.get('/', PestController.getPests);
router.get('/:id', PestController.getPestById);
router.post('/', PestController.createPest);

export const pestRoutes = router;
