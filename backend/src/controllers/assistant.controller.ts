import { Response, NextFunction } from 'express';
import { AIService, AssistantQueryParams } from '../services/ai.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class AssistantController {
  public static async query(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { query, language, farmContext, conversationHistory, imageBase64 } = req.body;
      const userId = req.user?.id;

      const params: AssistantQueryParams = {
        query: query || '',
        language: language || 'en',
        userId,
        farmContext,
        conversationHistory,
        imageBase64,
      };

      const result = await AIService.processQuery(params);
      return sendSuccess(res, result, 'AI assistant response generated successfully');
    } catch (error) {
      next(error);
    }
  }
}
