import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 에러 타입 정의
interface ErrorWithStatus {
  status?: number;
  message?: string;
}

// Query Client 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 5 * 60 * 1000,
      // 네트워크 재연결 시 자동 refetch
      refetchOnWindowFocus: false,
      // 에러 시 재시도 설정
      retry: (failureCount, error: unknown) => {
        const typedError = error as ErrorWithStatus;
        // 인증 오류는 재시도하지 않음
        if (typedError?.status === 401) return false;
        // 최대 3번 재시도
        return failureCount < 3;
      },
    },
    mutations: {
      // 뮤테이션 에러 처리
      onError: (error: unknown) => {
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Query Client를 다른 곳에서도 사용할 수 있도록 export
export { queryClient };
