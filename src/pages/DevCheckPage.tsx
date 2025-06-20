import { Button, Layout } from '../components';

import { useNavigate, useSupabaseStatus, useAuthStatus } from '../hooks';

export function DevCheckPage() {
  const { goTo } = useNavigate();
  const { data: supabaseStatus, isLoading: isLoadingSupabase } = useSupabaseStatus();
  const { data: authStatus, isLoading: isLoadingAuth } = useAuthStatus();

  return (
    <Layout showNavigation={false}>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 개발 상태 확인</h1>
          <p className="text-lg text-gray-600 mb-8">StudyPing 시스템 상태 및 개발 정보</p>

          <Button onClick={() => goTo('/')} variant="outline" className="mb-2">
            ← 홈으로 돌아가기
          </Button>
        </header>

        {/* 시스템 상태 */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Supabase 연결 상태 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">시스템 상태</h3>

            <div className="space-y-3">
              {/* 데이터베이스 연결 상태 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">데이터베이스:</span>
                {isLoadingSupabase ? (
                  <span className="text-yellow-600 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                    확인 중...
                  </span>
                ) : supabaseStatus?.isConnected ? (
                  <span className="text-green-600 flex items-center font-semibold">✅ 연결됨</span>
                ) : (
                  <span className="text-red-600 flex items-center font-semibold">❌ 연결 실패</span>
                )}
              </div>

              {/* 인증 시스템 상태 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">인증 시스템:</span>
                {isLoadingAuth ? (
                  <span className="text-yellow-600 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                    확인 중...
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center font-semibold">✅ 준비됨</span>
                )}
              </div>

              {/* 로그인 상태 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">로그인 상태:</span>
                <span
                  className={`flex items-center font-semibold ${authStatus?.user ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {authStatus?.user ? `✅ ${authStatus.user.email}` : '❌ 비로그인'}
                </span>
              </div>
            </div>

            {/* 에러 메시지 */}
            {supabaseStatus?.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <h4 className="font-semibold mb-1">연결 오류:</h4>
                <p className="text-sm">{supabaseStatus.error}</p>
              </div>
            )}
          </div>

          {/* 개발 환경 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">개발 환경 정보</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Environment:</span>
                <span className="font-mono  px-2 py-1">{import.meta.env.MODE}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">개발 모드:</span>
                <span className={`font-semibold ${import.meta.env.DEV ? 'text-green-600' : 'text-red-600'}`}>
                  {import.meta.env.DEV ? '✅ 활성화' : '❌ 비활성화'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">마지막 체크:</span>
                <span className="font-mono text-gray-600">{supabaseStatus?.timestamp || '확인 중...'}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">빠른 액션</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              {authStatus?.user ? (
                <>
                  <Button onClick={() => goTo('/dashboard')} className="flex-1">
                    📊 대시보드로 이동
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                    🔄 페이지 새로고침
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => goTo('/login')} className="flex-1">
                    🚀 로그인
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                    🔄 페이지 새로고침
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
