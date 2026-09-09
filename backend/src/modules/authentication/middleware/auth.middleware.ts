import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/env';
import { ApiError } from '../../../utils/apiError';
import { UserRole } from '../../../types';
import { AuthRequest, JWTPayload } from '../types';

export { AuthRequest };

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication token is missing');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Invalid or expired authentication token'));
    } else {
      next(err);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`));
    }

    next();
  };
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      req.user = decoded;
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }

  next();
};
