import { apiClient } from '../../../services/api';
import type { User, UserRole, LoginCredentials, RegisterData, AuthResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data?.data || res.data;
  },

  sendAadhaarOtp: async (aadhaarNumber: string): Promise<{ demoOtp: string; aadhaarLast4: string; message: string }> => {
    const res = await apiClient.post('/auth/aadhaar/send-otp', { aadhaarNumber });
    return res.data?.data || res.data;
  },

  verifyAadhaarOtp: async (aadhaarNumber: string, otp: string): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post('/auth/aadhaar/verify-otp', { aadhaarNumber, otp });
    return res.data?.data || res.data;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data?.data || res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me');
    return res.data?.data || res.data;
  },

  saveSession: (token: string, user: User) => {
    localStorage.setItem('farmer_os_token', token);
    localStorage.setItem('farmer_os_user', JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem('farmer_os_token');
    localStorage.removeItem('farmer_os_user');
    localStorage.removeItem('agrinext_token');
    localStorage.removeItem('agrinext_user');
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('farmer_os_token') || localStorage.getItem('agrinext_token');
  },

  getStoredUser: (): User | null => {
    const raw = localStorage.getItem('farmer_os_user') || localStorage.getItem('agrinext_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
