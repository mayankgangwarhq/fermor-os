export type UserRole = 'farmer' | 'buyer' | 'expert' | 'equipment_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  state: string;
  district: string;
  village: string;
  avatar?: string;
  language: string;
  bio?: string;
  rating?: number;
  totalDeals?: number;
  verified?: boolean;
  aadhaarLast4?: string;
  createdAt?: string;
}

export interface AuthState {
  currentUser: User;
  role: UserRole;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  demoMode: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  aadhaarNumber?: string;
  state?: string;
  district?: string;
  village?: string;
  language?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
