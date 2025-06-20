import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../constants';

interface GuestOnlyRouteProps {
  children: ReactNode;
}

export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 이미 인증된 경우 대시보드로 리다이렉트
  // location.state?.from이 있으면 그곳으로, 없으면 대시보드로
  if (isAuthenticated) {
    const state = location.state as { from?: string } | null;
    const redirectTo = state?.from || ROUTES.DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
