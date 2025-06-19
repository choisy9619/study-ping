// 404 페이지

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { ROUTES } from '../constants';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="max-w-md mx-auto">
          {/* 404 아이콘 */}
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>

          {/* 메시지 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h1>

          <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>

          {/* 액션 버튼들 */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link to={ROUTES.HOME}>
              <Button>홈으로 가기</Button>
            </Link>

            <Button variant="secondary" onClick={() => window.history.back()}>
              이전 페이지로
            </Button>
          </div>

          {/* 도움말 링크 */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              문제가 계속 발생한다면{' '}
              <a href="mailto:support@studyping.com" className="text-blue-600 hover:text-blue-500">
                고객지원
              </a>
              으로 문의해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
