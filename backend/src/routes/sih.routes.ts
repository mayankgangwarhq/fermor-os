import { Router } from 'express';
import { SihController } from '../controllers/sih.controller';

const router = Router();

// 1. Hotspots
router.get('/hotspots', SihController.getHotspots);
router.post('/hotspots', SihController.createHotspot);

// 2. Weather-Based Early Warning
router.get('/early-warning', SihController.getEarlyWarning);

// 3. Scan Cases
router.get('/scan-cases', SihController.getScanCases);
router.post('/scan-cases', SihController.createScanCase);

// 4. Expert Review
router.post('/expert-review', SihController.submitExpertReview);

// 5. Lab Referrals
router.get('/referrals', SihController.getReferrals);
router.post('/referrals', SihController.createReferral);

// 6. Follow-up Tracking
router.get('/follow-ups', SihController.getFollowUps);
router.post('/follow-ups', SihController.updateFollowUp);

// 7. Field Confirmations
router.get('/field-confirmations', SihController.getFieldConfirmations);
router.post('/field-confirmations', SihController.submitFieldConfirmation);

// 8. Pest Observations
router.get('/pest-observations', SihController.getPestObservations);
router.post('/pest-observations', SihController.createPestObservation);

// 9. Official Department Statistics
router.get('/official-stats', SihController.getOfficialStats);

export const sihRoutes = router;
