import { Button } from '../components';
import { useAuthContext } from '../contexts/AuthContext';
import { useSignOut, useNavigate } from '../hooks';

export function DashboardPage() {
  const { user, isLoading } = useAuthContext();
  const signOutMutation = useSignOut();
  const { navigate } = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      navigate('/');
    } catch (_error) {
      // 에러는 뮤테이션에서 이미 로깅됨
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">📚 StudyPing</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">안녕하세요, {user?.user_metadata?.name || user?.email}님</span>
              <Button onClick={handleSignOut} variant="outline" size="sm" disabled={signOutMutation.isPending}>
                {signOutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 환영 메시지 */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">🎉 환영합니다!</h2>
              <p className="text-gray-600 mb-4">
                StudyPing에 오신 것을 환영합니다. 여기서 스터디를 만들고 참여하며 꾸준한 학습 습관을 만들어보세요.
              </p>

              {/* 사용자 정보 */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">내 정보</h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <div>이메일: {user?.email}</div>
                  <div>가입일: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : 'N/A'}</div>
                  <div>이메일 인증: {user?.email_confirmed_at ? '✅ 완료' : '⏳ 대기 중'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 액션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">➕</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">새 스터디 만들기</dt>
                      <dd className="text-sm text-gray-900">스터디 그룹을 생성하고 멤버들을 초대하세요</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full" disabled>
                    곧 출시 예정
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">🔍</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">스터디 참여하기</dt>
                      <dd className="text-sm text-gray-900">초대 코드로 기존 스터디에 참여하세요</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" disabled>
                    곧 출시 예정
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">내 출석 통계</dt>
                      <dd className="text-sm text-gray-900">지금까지의 출석률과 활동을 확인하세요</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" disabled>
                    곧 출시 예정
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 내 스터디 목록 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">내 스터디 목록</h3>

              <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-500 mb-4">아직 참여 중인 스터디가 없습니다</p>
                <p className="text-sm text-gray-400 mb-6">새 스터디를 만들거나 친구의 초대를 받아보세요</p>
                <div className="space-x-4">
                  <Button disabled>스터디 만들기</Button>
                  <Button variant="outline" disabled>
                    참여하기
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 개발 정보 */}
          {import.meta.env.DEV && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">🔧 개발 정보</h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>User ID: {user?.id}</div>
                <div>Email: {user?.email}</div>
                <div>Created: {user?.created_at}</div>
                <div>Last Sign In: {user?.last_sign_in_at}</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
