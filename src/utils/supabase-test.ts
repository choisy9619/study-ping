import { supabase } from '../services';

// Supabase 연결 테스트
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Supabase 연결 테스트 시작...');

    // 1. 기본 연결 테스트
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Supabase 연결 실패:', error);
      return false;
    }

    console.log('✅ Supabase 연결 성공!');
    console.log(`📊 현재 users 테이블: ${data ? ' 존재함' : '생성 필요'}`);

    // 2. Auth 상태 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(`🔐 인증 상태: ${session ? '로그인됨' : '비로그인'}`);

    return true;
  } catch (error) {
    console.error('💥 Supabase 테스트 중 오류:', error);
    return false;
  }
}

// Auth 리스너 설정
export function setupAuthListener() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth 상태 변경:', event, session?.user?.email || '비로그인');
  });

  // 정리 함수 반환
  return () => subscription.unsubscribe();
}

// 개발 환경에서 자동 테스트
if (import.meta.env.DEV) {
  // 페이지 로드 후 자동 테스트
  window.addEventListener('load', () => {
    setTimeout(testSupabaseConnection, 1000);
  });
}
