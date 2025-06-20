// 개발용 헬퍼 함수들

import { supabase } from '../services';
import { env } from '../config/env';

/**
 * 설정에 따라 특정 사용자의 이메일 인증 처리
 */
export async function confirmUserEmail(email: string) {
  if (!env.auth.skipEmailConfirmation) {
    console.warn('이메일 인증 건너뛰기가 비활성화되어 있습니다.');
    return;
  }

  try {
    const { data, error } = await supabase.rpc('confirm_user_email', {
      user_email: email,
    });

    if (error) throw error;

    console.log('✅ 이메일 인증 완료:', data);
    return data;
  } catch (error) {
    console.error('❌ 이메일 인증 실패:', error);
    throw error;
  }
}

/**
 * 모든 미인증 사용자를 인증 처리
 */
export async function confirmAllUsers() {
  if (!env.auth.skipEmailConfirmation) {
    console.warn('이메일 인증 건너뛰기가 비활성화되어 있습니다.');
    return;
  }

  try {
    const { data, error } = await supabase.rpc('dev_confirm_all_users');

    if (error) throw error;

    console.log(`✅ ${data}명의 사용자 이메일 인증 완료`);
    return data;
  } catch (error) {
    console.error('❌ 일괄 이메일 인증 실패:', error);
    throw error;
  }
}

/**
 * Auth 상태 디버깅
 */
export async function debugAuthStatus() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Auth 세션 조회 실패:', error);
      return;
    }

    console.log('🔍 현재 Auth 상태:', {
      skipEmailConfirmation: env.auth.skipEmailConfirmation,
      isLoggedIn: !!session,
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            emailConfirmed: session.user.email_confirmed_at,
            userMetadata: session.user.user_metadata,
          }
        : null,
      session: !!session,
    });

    return session;
  } catch (error) {
    console.error('❌ Auth 상태 디버깅 실패:', error);
  }
}

// 환경에 관계없이 window 객체에 헬퍼 함수들 추가
if (typeof window !== 'undefined') {
  (window as any).authHelpers = {
    confirmUserEmail,
    confirmAllUsers,
    debugAuthStatus,
    skipEmailConfirmation: env.auth.skipEmailConfirmation,
  };

  console.log('🛠️ Auth 헬퍼 함수가 window.authHelpers에 추가되었습니다:');
  console.log(`  Skip Email Confirmation: ${env.auth.skipEmailConfirmation ? '✅ Enabled' : '❌ Disabled'}`);
  console.log('- window.authHelpers.confirmUserEmail("email@example.com")');
  console.log('- window.authHelpers.confirmAllUsers()');
  console.log('- window.authHelpers.debugAuthStatus()');
}
