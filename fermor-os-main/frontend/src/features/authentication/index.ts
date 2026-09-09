// Canonical Frontend Authentication Feature Module

// Components
export { ProtectedRoute } from './components/ProtectedRoute';

// Pages
export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';
export { OnboardingPage } from './pages/OnboardingPage';

// Context & Hooks
export { AuthContext, AuthProvider, useAuth } from './contexts/AuthContext';
export type { AuthContextType } from './contexts/AuthContext';

// Services
export { authService } from './services/auth.service';

// Types
export type {
  UserRole,
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from './types';
