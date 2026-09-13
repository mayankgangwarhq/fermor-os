import { Router } from 'express';
import { MandiController } from '../controllers/mandi.controller';

const router = Router();

router.get('/', MandiController.getPrices);
router.get('/filter-options', MandiController.getFilterOptions);
router.get('/:id', MandiController.getPriceById);
router.post('/', MandiController.createPrice);

export const mandiRoutes = router;
