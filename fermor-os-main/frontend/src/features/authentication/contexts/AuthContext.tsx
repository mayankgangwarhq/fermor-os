import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { initialUser, sampleUsers } from '../../../services/mockData';
import { authService } from '../services/auth.service';

export interface AuthContextType {
  currentUser: User;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updated: Partial<User>) => void;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  completeOnboarding: (data: Partial<User>) => void;
  login: (emailOrPhone: string, password?: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password?: string, role?: UserRole, phone?: string) => Promise<void>;
  logout: () => void;
  demoMode: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return authService.getStoredUser() || initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!authService.getStoredToken();
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem('farmer_os_onboarded') || localStorage.getItem('agrinext_onboarded');
    return saved ? JSON.parse(saved) : true;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('farmer_os_user', JSON.stringify(currentUser));
    }
  }, [currentUser, isAuthenticated]);

  const switchRole = (newRole: UserRole) => {
    const target = sampleUsers.find((u) => u.role === newRole) || {
      ...currentUser,
      role: newRole,
      name:
        newRole === 'farmer'
          ? 'Rajesh Kumar Patel'
          : newRole === 'buyer'
          ? 'Anil Gupta (AgriProcure)'
          : newRole === 'expert'
          ? 'Dr. Ramesh Sharma'
          : newRole === 'equipment_owner'
          ? 'Sardar Gurpreet Singh'
          : 'AGRINEXT Platform Admin',
    };
    setCurrentUser(target);
  };

  const updateUserProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const completeOnboarding = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    setIsOnboarded(true);
    localStorage.setItem('farmer_os_onboarded', JSON.stringify(true));
  };

  const login = async (emailOrPhone: string, password?: string, role: UserRole = 'farmer') => {
    setIsLoading(true);
    try {
      const res = await authService.login({ emailOrPhone, password, role });
      if (res?.user && res?.token) {
        setCurrentUser(res.user);
        authService.saveSession(res.token, res.user);
        setIsAuthenticated(true);
        return;
      }
    } catch (err) {
      console.warn('[AuthContext] Backend login API unavailable, using offline demo session:', err);
    } finally {
      setIsLoading(false);
    }

    // Fallback login
    const found = sampleUsers.find((u) => u.email === emailOrPhone || u.phone === emailOrPhone) || {
      ...initialUser,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'farmer@farmer-os.agri',
      role,
    };
    setCurrentUser(found);
    authService.saveSession('demo_token_' + Date.now(), found);
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password?: string, role: UserRole = 'farmer', phone?: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register({ name, email, password, role, phone });
      if (res?.user && res?.token) {
        setCurrentUser(res.user);
        authService.saveSession(res.token, res.user);
        setIsAuthenticated(true);
        return;
      }
    } catch (err) {
      console.warn('[AuthContext] Backend register API unavailable, using local demo session:', err);
    } finally {
      setIsLoading(false);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '+91 98765 00000',
      role,
      state: 'Rajasthan',
      district: 'Jaipur',
      village: 'Jagatpura (VGU)',
      language: 'en',
    };
    setCurrentUser(newUser);
    authService.saveSession('demo_token_' + Date.now(), newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.clearSession();
    setIsAuthenticated(false);
    setCurrentUser(initialUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        switchRole,
        updateUserProfile,
        isAuthenticated,
        isOnboarded,
        completeOnboarding,
        login,
        register,
        logout,
        demoMode: true,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
