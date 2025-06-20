import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Query Client 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 5 * 60 * 1000,
      // 네트워크 재연결 시 자동 refetch
      refetchOnWindowFocus: false,
      // 에러 시 재시도 설정
      retry: (failureCount, error: any) => {
        // 인증 오류는 재시도하지 않음
        if (error?.status === 401) return false;
        // 최대 3번 재시도
        return failureCount < 3;
      },
    },
    mutations: {
      // 뮤테이션 에러 처리
      onError: (error: any) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서 React Query DevTools 추가 (선택사항) */}
      {import.meta.env.DEV && (
        <div style={{ fontSize: '12px', opacity: 0.7, position: 'fixed', bottom: 0, right: 0, padding: '8px' }}>
          React Query Ready
        </div>
      )}
    </QueryClientProvider>
  );
}

// Query Client를 다른 곳에서도 사용할 수 있도록 export
export { queryClient };
