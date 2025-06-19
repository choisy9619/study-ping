// 프로그래밍 방식 네비게이션을 위한 커스텀 훅

import { useNavigate as useRouterNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

export const useNavigate = () => {
  const navigate = useRouterNavigate();
  const location = useLocation();

  // 로그인 후 원래 페이지로 돌아가기
  const goToAfterLogin = () => {
    const from = (location.state as any)?.from || ROUTES.DASHBOARD;
    navigate(from, { replace: true });
  };

  // 특정 경로로 이동
  const goTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  };

  // 뒤로 가기
  const goBack = () => {
    navigate(-1);
  };

  // 앞으로 가기
  const goForward = () => {
    navigate(1);
  };

  // 홈으로 가기
  const goHome = () => {
    navigate(ROUTES.HOME, { replace: true });
  };

  // 로그인 페이지로 가기
  const goToLogin = (from?: string) => {
    navigate(ROUTES.LOGIN, {
      replace: true,
      state: from ? { from } : undefined,
    });
  };

  return {
    navigate,
    goTo,
    goBack,
    goForward,
    goHome,
    goToLogin,
    goToAfterLogin,
  };
};
