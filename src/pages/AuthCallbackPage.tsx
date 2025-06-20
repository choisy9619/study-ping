import { useEffect } from 'react';
import { useNavigate } from '../hooks';
import { supabase } from '../services';

export function AuthCallbackPage() {
  const { navigate } = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 정보 처리
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth 콜백 에러:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (data.session) {
          if (import.meta.env.DEV) {
            console.log('✅ OAuth 로그인 성공:', data.session.user.email);
          }
          navigate('/dashboard');
        } else {
          if (import.meta.env.DEV) {
            console.log('⚠️ OAuth 세션이 없음, 로그인 페이지로 이동');
          }
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth 처리 중 오류:', error);
        navigate('/login?error=oauth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
        <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
