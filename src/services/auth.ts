// 인증 관련 API 서비스

import { supabase } from './supabase'
import type { 
  LoginCredentials, 
  SignupCredentials, 
  User, 
  PasswordResetRequest,
  PasswordUpdateRequest 
} from '../types'

/**
 * 로그인
 */
export const login = async (credentials: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  })
  
  if (error) throw error
  return data
}

/**
 * 회원가입
 */
export const signup = async (credentials: SignupCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        name: credentials.name
      }
    }
  })
  
  if (error) throw error
  return data
}

/**
 * 로그아웃
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * 현재 사용자 정보 가져오기
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) throw error
  if (!user) return null
  
  // Supabase User를 앱의 User 타입으로 변환
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata.name || user.email!,
    avatar_url: user.user_metadata.avatar_url,
    email_verified: user.email_confirmed_at !== null,
    created_at: user.created_at,
    updated_at: user.updated_at
  }
}

/**
 * 비밀번호 재설정 요청
 */
export const requestPasswordReset = async (request: PasswordResetRequest) => {
  const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) throw error
}

/**
 * 비밀번호 업데이트
 */
export const updatePassword = async (request: PasswordUpdateRequest) => {
  const { error } = await supabase.auth.updateUser({
    password: request.password
  })
  
  if (error) throw error
}

/**
 * 프로필 업데이트
 */
export const updateProfile = async (updates: Partial<User>) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      name: updates.name,
      avatar_url: updates.avatar_url
    }
  })
  
  if (error) throw error
}

/**
 * Google OAuth 로그인
 */
export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  
  if (error) throw error
}

/**
 * 세션 상태 변경 리스너
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (_, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}
