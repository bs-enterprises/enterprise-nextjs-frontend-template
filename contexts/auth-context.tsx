'use client';

import StorageKeys from '@/constants/storage-constants';
import { getStorageItem, removeStorageItem, setStorageItem } from '@/store/local-storage';
import { DemoUser, demoUsers } from '@/types/mock-data';
import type { ApiResponse } from '@/types/responses';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type UserRole = 'org-owner' | 'org-admin';

export type Permission = 'dashboard.view';

const rolePermissions: Record<UserRole, Permission[]> = {
  'org-owner': ['dashboard.view'],
  'org-admin': ['dashboard.view'],
};

export { demoUsers, rolePermissions };

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<ApiResponse<unknown>>;
  logout: () => void;
  can: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  getPermissions: () => Permission[];
  getDemoUsers: () => DemoUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users] = useState<DemoUser[]>(() => {
    if (typeof window === 'undefined') return demoUsers;
    try {
      const stored = getStorageItem<DemoUser[]>(StorageKeys.DEMO_USERS);
      return stored && Array.isArray(stored) ? stored : demoUsers;
    } catch {
      return demoUsers;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = getStorageItem<User>(StorageKeys.USER);
      if (stored && typeof stored.id === 'string') return stored;
    } catch {
      // ignore
    }
    return null;
  });

  const login = async (username: string, password: string): Promise<ApiResponse<unknown>> => {
    try {
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 400));

      const found = users.find(
        (u) => (u.username === username || u.email === username) && u.password === password
      );

      if (!found) {
        return { success: false, message: 'Invalid username or password' };
      }

      const loggedInUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        orgId: found.orgId,
      };

      setUser(loggedInUser);
      setStorageItem(StorageKeys.USER, loggedInUser);

      return { success: true, data: loggedInUser };
    } catch {
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    removeStorageItem(StorageKeys.USER);
    removeStorageItem(StorageKeys.SESSION);
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => user?.role === role;

  const getPermissions = (): Permission[] => {
    if (!user) return [];
    return rolePermissions[user.role] ?? [];
  };

  const getDemoUsers = (): DemoUser[] => users;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        can,
        hasRole,
        getPermissions,
        getDemoUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
