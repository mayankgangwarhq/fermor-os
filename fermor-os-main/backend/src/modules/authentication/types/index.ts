import { Request } from 'express';
import { UserRole } from '../../../types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface LoginDTO {
  emailOrPhone: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  language?: string;
}
