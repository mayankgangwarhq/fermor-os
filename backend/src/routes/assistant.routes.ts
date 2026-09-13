import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// GET /api/assistant or GET /api/assistant/query
router.get(['/', '/query'], (_req, res) => {
  res.json({
    success: true,
    message: 'AGRINEXT AI Agriculture Assistant Service is operational.',
    usage: 'Send a POST request to /api/assistant/query with JSON payload: { query: string, language?: "hi" | "en" }',
    status: 'ready',
  });
});

// POST /api/assistant/query
router.post('/query', optionalAuth, AssistantController.query);

export const assistantRoutes = router;
