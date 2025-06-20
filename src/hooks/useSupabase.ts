import { useQuery } from '@tanstack/react-query';
import { supabase, checkAuthStatus } from '../services';

// Supabase 연결 상태 확인 훅
export function useSupabaseStatus() {
  return useQuery({
    queryKey: ['supabase-status'],
    queryFn: async () => {
      try {
        // 간단한 헬스체크 쿼리
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });

        return {
          isConnected: !error,
          error: error?.message || null,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return {
          isConnected: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };
      }
    },
    // 30초마다 자동 체크
    refetchInterval: 30000,
    // 초기 로드 시에만 실행
    staleTime: 30000,
  });
}

// 현재 인증 상태 확인 훅
export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: checkAuthStatus,
    // 인증 상태는 자주 체크하지 않음
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: true,
  });
}

// Supabase 클라이언트를 다른 곳에서 사용할 수 있도록 re-export
export { supabase } from '../services/supabase';
