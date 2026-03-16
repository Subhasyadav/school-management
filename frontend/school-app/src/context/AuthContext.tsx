
// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../api/axios';
import type { ChangePasswordRequest, LoginRequest, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const hasSession = localStorage.getItem('isLoggedIn') === 'true';
      if (!hasSession) {
        setIsLoading(false);
        setUser(null);
        return;
      }

      try {
        const response = await apiClient.get<User>('/user/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('isLoggedIn');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await apiClient.post<User>('/auth/login', data);
      localStorage.setItem('isLoggedIn', 'true');
      setUser(response.data);
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    await apiClient.post('/auth/change-password', data);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // If you store the full user in localStorage, update it here:
    // localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        changePassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};