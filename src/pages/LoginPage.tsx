import { useState } from 'react';
import { Button } from '../components';
import { useSignIn, useSignUp, useGoogleSignIn, useResetPassword, useNavigate } from '../hooks';

type AuthMode = 'signin' | 'signup' | 'reset';

export function LoginPage() {
  const { navigate } = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Auth 뮤테이션 훅들
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const googleSignInMutation = useGoogleSignIn();
  const resetPasswordMutation = useResetPassword();

  const isLoading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    googleSignInMutation.isPending ||
    resetPasswordMutation.isPending;

  // 폼 데이터 업데이트
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 이메일/비밀번호 로그인
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signin') {
      try {
        await signInMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        navigate('/dashboard');
      } catch (_error) {
        // 에러는 뮤테이션에서 이미 로깅됨
      }
    } else if (mode === 'signup') {
      if (!formData.name.trim()) {
        alert('이름을 입력해주세요');
        return;
      }

      try {
        await signUpMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        // 회원가입 성공 시 로그인 페이지로 이동
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        setMode('signin');

        // 폼 초기화 (비밀번호 제외하고 이메일은 유지)
        setFormData(prev => ({
          ...prev,
          password: '',
          name: '',
        }));
      } catch (_error) {
        // 에러는 뮤테이션에서 이미 로깅됨
      }
    } else if (mode === 'reset') {
      try {
        await resetPasswordMutation.mutateAsync(formData.email);
        alert('비밀번호 재설정 이메일이 발송되었습니다!');
        setMode('signin');
      } catch (_error) {
        // 에러는 뮤테이션에서 이미 로깅됨
      }
    }
  };

  // Google 로그인
  const handleGoogleSignIn = async () => {
    try {
      await googleSignInMutation.mutateAsync();
      // Google OAuth는 리다이렉트로 처리됨
    } catch (_error) {
      // 에러는 뮤테이션에서 이미 로깅됨
    }
  };

  // 에러 메시지 가져오기
  const getErrorMessage = () => {
    const error =
      signInMutation.error || signUpMutation.error || googleSignInMutation.error || resetPasswordMutation.error;

    if (!error) return null;

    // 사용자 친화적인 에러 메시지
    if (error.message.includes('Invalid login credentials')) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    if (error.message.includes('User already registered')) {
      return '이미 가입된 이메일입니다.';
    }
    if (error.message.includes('Password should be at least 6 characters')) {
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (error.message.includes('Unable to validate email address')) {
      return '유효하지 않은 이메일 주소입니다.';
    }

    return error.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 StudyPing</h1>
          <p className="text-gray-600">
            {mode === 'signin' && '로그인하여 스터디를 시작하세요'}
            {mode === 'signup' && '새 계정을 만들어보세요'}
            {mode === 'reset' && '비밀번호를 재설정하세요'}
          </p>
        </div>

        {/* 메인 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* 이름 입력 (회원가입 시에만) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => updateFormData('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동"
                  required={mode === 'signup'}
                />
              </div>
            )}

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => updateFormData('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* 비밀번호 입력 (재설정 모드가 아닐 때만) */}
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => updateFormData('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            )}

            {/* 에러 메시지 */}
            {getErrorMessage() && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{getErrorMessage()}</p>
              </div>
            )}

            {/* 제출 버튼 */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? '처리 중...'
                : mode === 'signin'
                  ? '로그인'
                  : mode === 'signup'
                    ? '회원가입'
                    : '재설정 이메일 발송'}
            </Button>
          </form>

          {/* Google 로그인 (재설정 모드가 아닐 때만) */}
          {mode !== 'reset' && (
            <>
              <div className="mt-4 text-center">
                <span className="text-gray-500 text-sm">또는</span>
              </div>

              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mt-4" disabled={isLoading}>
                🔍 Google로 계속하기
              </Button>
            </>
          )}

          {/* 모드 전환 링크 */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  계정이 없으신가요? 회원가입
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </>
            )}

            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                이미 계정이 있으신가요? 로그인
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                로그인으로 돌아가기
              </button>
            )}
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-700 text-sm">
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
