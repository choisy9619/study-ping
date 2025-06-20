import { Button } from '../ui';
import { useNavigate, useSignOut } from '../../hooks';
import { useAuthContext } from '../../contexts/AuthContext';

export function Navigation() {
  const { navigate } = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const signOutMutation = useSignOut();

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync();
      // 로그아웃 후 홈으로 이동
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl font-bold text-gray-900">📚 StudyPing</span>
          </div>

          {/* 우측 버튼들 */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">안녕하세요, {user.user_metadata?.name || user.email}님</span>
                <Button onClick={() => navigate('/dashboard')} variant="primary" size="sm">
                  대시보드
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm" disabled={signOutMutation.isPending}>
                  {signOutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
