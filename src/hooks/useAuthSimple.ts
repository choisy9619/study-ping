// 개발용 간단한 인증 훅 (Supabase 연결 없이 테스트)

import { useState } from 'react';
import type { User, LoginCredentials } from '../types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthSimple = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>({
    id: 'dev-user-123',
    email: 'dev@example.com',
    name: '개발자',
    created_at: new Date().toISOString(),
  });
  const [isLoading] = useState(false);

  const isAuthenticated = !!user;

  const login = async (credentials: LoginCredentials) => {
    // 개발용 Mock 로그인
    setUser({
      id: 'user-123',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      created_at: new Date().toISOString(),
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
