// 게스트(비로그인 사용자)만 접근 가능한 라우트 컴포넌트

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks';

interface GuestOnlyRouteProps {
  children: ReactNode;
}

export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 이미 인증된 경우 대시보드로 리다이렉트
  // location.state?.from이 있으면 그곳으로, 없으면 대시보드로
  if (isAuthenticated) {
    const redirectTo = (location.state as any)?.from || ROUTES.DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  // 인증되지 않은 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
