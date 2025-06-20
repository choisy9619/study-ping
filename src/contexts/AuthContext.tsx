import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuth } from '../hooks';
import type { User, Session } from '@supabase/supabase-js';

// Auth Context 타입 정의
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props 타입
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  useEffect(() => {
    // 개발 환경에서 Auth 상태 로깅
    if (import.meta.env.DEV) {
      console.log('🔐 Auth Context 상태:', {
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        user: auth.user?.email || null,
        session: !!auth.session,
        timestamp: new Date().toISOString(),
      });
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.session]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Auth Context 사용 훅
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext는 AuthProvider 내부에서 사용해야 합니다');
  }

  return context;
}

// 편의를 위한 별칭
export { useAuthContext as useCurrentUser };
