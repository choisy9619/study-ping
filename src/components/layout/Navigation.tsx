import { Button } from '../ui';
import { useNavigate, useAuthStatus } from '../../hooks';

export function Navigation() {
  const { goTo } = useNavigate();
  const { data: authStatus } = useAuthStatus();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center cursor-pointer" onClick={() => goTo('/')}>
            <span className="text-xl font-bold text-gray-900">📚 StudyPing</span>
          </div>

          {/* 우측 버튼들 */}
          <div className="flex items-center gap-3">
            {authStatus?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">안녕하세요, {authStatus.user.email}님</span>
                <Button onClick={() => goTo('/dashboard')} variant="primary" size="sm">
                  대시보드
                </Button>
              </div>
            ) : (
              <Button onClick={() => goTo('/login')} variant="outline" size="sm">
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
