import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';

const router = Router();

router.get('/', IntegrationController.getIntegrations);
router.get('/registry', IntegrationController.getRegistry);

export const integrationRoutes = router;
