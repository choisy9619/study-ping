import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services';
import { env } from '../config/env';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Auth 상태 타입 정의
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 회원가입 데이터 타입
interface SignUpData {
  email: string;
  password: string;
  name: string;
}

// 로그인 데이터 타입
interface SignInData {
  email: string;
  password: string;
}

// 메인 Auth 훅
export function useAuth(): AuthState {
  const [isLoading, setIsLoading] = useState(true);

  const { data: authStatus } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, user: session?.user || null };
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    // Auth 상태 변경 리스너 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (import.meta.env.DEV) {
        console.log('🔄 Auth 상태 변경:', event, session?.user?.email);
      }
      setIsLoading(false);
    });

    setIsLoading(false);

    return () => subscription.unsubscribe();
  }, []);

  return {
    user: authStatus?.user || null,
    session: authStatus?.session || null,
    isLoading,
    isAuthenticated: !!authStatus?.user,
  };
}

// 회원가입 훅 (설정에 따라 이메일 인증 제어)
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpData) => {
      console.log('📝 회원가입 시도:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            email_verified: env.auth.skipEmailConfirmation, // 환경변수로 제어
          },
        },
      });

      if (error) throw error;

      // 이메일 인증 건너뛰기가 활성화된 경우 처리
      if (env.auth.skipEmailConfirmation && data.user) {
        console.log('🔄 이메일 인증 건너뛰기 설정 활성화');

        try {
          // 이메일 인증 처리 함수 호출
          const { data: confirmResult } = await supabase.rpc('confirm_user_email', {
            user_email: email,
          });

          console.log('✅ 이메일 인증 완료:', confirmResult);

          // 인증 후 자동 로그인 시도
          console.log('🔄 자동 로그인 시도...');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.warn('⚠️ 자동 로그인 실패:', signInError.message);
            return data; // 원래 회원가입 데이터 반환
          } else {
            console.log('✅ 자동 로그인 성공');
            return { user: signInData.user, session: signInData.session };
          }
        } catch (confirmError) {
          console.warn('⚠️ 이메일 인증 처리 실패:', confirmError);
          return data; // 원래 회원가입 데이터 반환
        }
      }

      console.log('✅ 회원가입 성공:', data.user?.email);
      return data;
    },
    onSuccess: () => {
      // Auth 상태 새로고침
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
    },
    onError: (error: AuthError) => {
      console.error('❌ 회원가입 실패:', error.message);
    },
  });
}

// 로그인 훅
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: SignInData) => {
      if (import.meta.env.DEV) {
        console.log('🔑 로그인 시도:', email);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log('✅ 로그인 성공:', data.user?.email);
      }
      return data;
    },
    onSuccess: () => {
      // Auth 상태 새로고침
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
    },
    onError: (error: AuthError) => {
      console.error('❌ 로그인 실패:', error.message);
    },
  });
}

// 로그아웃 훅
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (import.meta.env.DEV) {
        console.log('👋 로그아웃 시도');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log('✅ 로그아웃 성공');
      }
    },
    onSuccess: () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();
    },
    onError: (error: AuthError) => {
      console.error('❌ 로그아웃 실패:', error.message);
    },
  });
}

// Google OAuth 로그인 훅
export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      if (import.meta.env.DEV) {
        console.log('🔍 Google 로그인 시도');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    },
    onError: (error: AuthError) => {
      console.error('❌ Google 로그인 실패:', error.message);
    },
  });
}

// 비밀번호 재설정 요청 훅
export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      if (import.meta.env.DEV) {
        console.log('🔄 비밀번호 재설정 요청:', email);
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log('✅ 비밀번호 재설정 이메일 발송됨');
      }
    },
    onError: (error: AuthError) => {
      console.error('❌ 비밀번호 재설정 실패:', error.message);
    },
  });
}
