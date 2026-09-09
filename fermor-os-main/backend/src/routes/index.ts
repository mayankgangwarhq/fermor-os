import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from '../modules/authentication';
import { userRoutes } from './user.routes';
import { farmerRoutes } from './farmer.routes';
import { farmRoutes } from './farm.routes';
import { cropRoutes } from './crop.routes';
import { diseaseRoutes } from './disease.routes';
import { pestRoutes } from './pest.routes';
import { weatherRoutes } from './weather.routes';
import { alertRoutes } from './alert.routes';
import { sihRoutes } from './sih.routes';
import { diagnosisRoutes } from './diagnosis.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/farmers', farmerRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/diseases', diseaseRoutes);
router.use('/diagnosis', diagnosisRoutes);
router.use('/pests', pestRoutes);
router.use('/weather', weatherRoutes);
router.use('/alerts', alertRoutes);
router.use('/sih', sihRoutes);

export const apiRoutes = router;

