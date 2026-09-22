import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * Creates an in-memory sliding window rate limiter middleware.
 * @param windowMs Window duration in milliseconds (e.g. 60000 for 1 minute)
 * @param maxRequests Max requests allowed within windowMs
 * @param serviceName Name of the service for logging and headers
 */
export function createAiRateLimiter(windowMs: number = 60000, maxRequests: number = 30, serviceName: string = 'AI Service') {
  const store: RateLimitStore = {};

  // Periodically clean up expired entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime < now) {
        delete store[ip];
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(store[ip].resetTime / 1000));
      return next();
    }

    store[ip].count += 1;
    const remaining = Math.max(0, maxRequests - store[ip].count);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(store[ip].resetTime / 1000));

    if (store[ip].count > maxRequests) {
      const retryAfterSeconds = Math.ceil((store[ip].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests to ${serviceName}. Please wait ${retryAfterSeconds} seconds before retrying.`,
          retryAfter: retryAfterSeconds,
        },
      });
    }

    next();
  };
}

// Pre-configured rate limiters
export const aiChatbotRateLimiter = createAiRateLimiter(60 * 1000, 30, 'AGRINEXT AI Chatbot');
export const aiVisionRateLimiter = createAiRateLimiter(60 * 1000, 20, 'AGRINEXT Crop Vision AI');
