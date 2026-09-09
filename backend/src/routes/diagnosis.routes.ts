import { Router } from 'express';
import { DiagnosticCaseController } from '../controllers/diagnosticCase.controller';
import { authenticate, optionalAuth, authorize } from '../middleware/auth.middleware';

const router = Router();

// 1. Create Diagnostic Case (Farmers / Users)
router.post('/cases', optionalAuth, DiagnosticCaseController.createCase);

// 2. Query Diagnostic Cases
router.get('/cases', optionalAuth, DiagnosticCaseController.getCases);

// 3. Get Single Diagnostic Case by ID
router.get('/cases/:id', optionalAuth, DiagnosticCaseController.getCaseById);

// 4. Submit Clarification Answers (Farmers)
router.post('/cases/:id/clarify', optionalAuth, DiagnosticCaseController.submitClarification);

// 5. Request Expert Review (Farmers)
router.post('/cases/:id/request-expert', optionalAuth, DiagnosticCaseController.requestExpert);

// 6. Submit Expert Review Verdict (Experts / Agronomists / Admins)
router.post(
  '/cases/:id/expert-review',
  optionalAuth,
  DiagnosticCaseController.submitExpertReview
);

export const diagnosisRoutes = router;
