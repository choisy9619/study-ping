// React Router 설정 및 라우트 컴포넌트들

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestOnlyRoute } from './GuestOnlyRoute';
import { ROUTES } from '../constants';
import {
  HomePage,
  LoginPage,
  DashboardPage,
  NotFoundPage,
  // TODO: 향후 추가될 페이지들
  // SignupPage,
  // StudyDetailPage,
  // StudyCreatePage,
  // StudyJoinPage,
  // MyPage,
  // ProfilePage,
  // AttendancePage,
} from '../pages';

// 라우터 Provider 컴포넌트
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 라우트 (누구나 접근 가능) */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* 인증 라우트들 (로그인한 사용자는 접근 불가) */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />

        {/* TODO: 회원가입, 비밀번호 찾기 페이지 */}
        {/* 
        <Route 
          path={ROUTES.SIGNUP} 
          element={
            <GuestOnlyRoute>
              <SignupPage />
            </GuestOnlyRoute>
          } 
        />
        */}

        {/* 보호된 라우트들 (인증 필요) */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* TODO: 스터디 관련 라우트들 */}
        {/* 
        <Route 
          path={ROUTES.STUDIES} 
          element={
            <ProtectedRoute>
              <StudyListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.STUDY_DETAIL} 
          element={
            <ProtectedRoute>
              <StudyDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.STUDY_CREATE} 
          element={
            <ProtectedRoute>
              <StudyCreatePage />
            </ProtectedRoute>
          } 
        />
        */}

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
