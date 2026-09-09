// Canonical Backend Authentication Module

export { authRoutes } from './routes/auth.routes';
export { AuthController } from './controllers/auth.controller';
export { AuthService } from './services/auth.service';
export { authenticate, authorize, optionalAuth } from './middleware/auth.middleware';
export type { AuthRequest, JWTPayload, LoginDTO, RegisterDTO } from './types';
