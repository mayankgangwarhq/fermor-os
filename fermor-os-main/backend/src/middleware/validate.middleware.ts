import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Full name is required');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Validation failed', errors));
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, emailOrPhone } = req.body;

  if (!email && !phone && !emailOrPhone) {
    return next(ApiError.badRequest('Email or phone number is required for login'));
  }

  next();
};

export const validateFarm = (req: Request, res: Response, next: NextFunction) => {
  const { name, location, area } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Farm name is required');
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Farm location is required');
  }

  if (area === undefined || isNaN(Number(area)) || Number(area) <= 0) {
    errors.push('Valid farm area (in acres/hectares) is required');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Farm validation failed', errors));
  }

  next();
};

export const validateCrop = (req: Request, res: Response, next: NextFunction) => {
  const { farmId, cropName, variety } = req.body;
  const errors: string[] = [];

  if (!farmId) {
    errors.push('Farm ID is required');
  }
  if (!cropName || typeof cropName !== 'string' || cropName.trim().length === 0) {
    errors.push('Crop name is required');
  }
  if (!variety || typeof variety !== 'string' || variety.trim().length === 0) {
    errors.push('Crop variety is required');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Crop validation failed', errors));
  }

  next();
};
