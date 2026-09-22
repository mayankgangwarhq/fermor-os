import { Response, NextFunction } from 'express';
import { AIService, AssistantQueryParams } from '../services/ai.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class AssistantController {
  public static async query(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { query, language, farmContext, conversationHistory, imageBase64 } = req.body;
      const userId = req.user?.id;

      if (!query && !imageBase64) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'A query string or specimen image is required.',
          },
        });
      }

      // Bound query length to max 3000 characters
      const boundedQuery = typeof query === 'string' ? query.substring(0, 3000) : '';

      // Bound conversation history to last 10 turns
      const boundedHistory: Array<{ role: 'user' | 'model'; content: string }> = Array.isArray(conversationHistory)
        ? conversationHistory.slice(-10).map((item) => ({
            role: item.role === 'model' ? ('model' as const) : ('user' as const),
            content: typeof item.content === 'string' ? item.content.substring(0, 2000) : '',
          }))
        : [];

      const params: AssistantQueryParams = {
        query: boundedQuery,
        language: language || 'en',
        userId,
        farmContext,
        conversationHistory: boundedHistory,
        imageBase64: typeof imageBase64 === 'string' && imageBase64.length < 15000000 ? imageBase64 : undefined,
      };

      const result = await AIService.processQuery(params);
      return sendSuccess(res, result, 'AI assistant response generated successfully');
    } catch (error) {
      next(error);
    }
  }
}
