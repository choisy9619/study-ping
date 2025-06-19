// 인증 관련 커스텀 훅

import { useState, useEffect } from 'react'
import { 
  login, 
  signup, 
  logout, 
  getCurrentUser, 
  onAuthStateChange,
  updateProfile
} from '../services'
import type { User, LoginCredentials, SignupCredentials } from '../types'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  refetch: () => Promise<void>
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // 초기 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 개발 모드에서는 mock 사용자 반환
        if (!import.meta.env.VITE_SUPABASE_URL) {
          setUser({
            id: 'dev-user-123',
            email: 'dev@example.com',
            name: '개발자',
            created_at: new Date().toISOString()
          })
          setIsLoading(false)
          return
        }
        
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // 인증 상태 변경 감지
  useEffect(() => {
    // 개발 모드에서는 auth state change 리스너 건너뛰기
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return
    }

    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      await login(credentials)
      // onAuthStateChange가 자동으로 사용자 정보를 업데이트함
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const handleSignup = async (credentials: SignupCredentials) => {
    setIsLoading(true)
    try {
      await signup(credentials)
      // onAuthStateChange가 자동으로 사용자 정보를 업데이트함
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (updates: Partial<User>) => {
    try {
      await updateProfile(updates)
      // 사용자 정보 다시 로드
      const updatedUser = await getCurrentUser()
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const refetch = async () => {
    setIsLoading(true)
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refetch user:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    refetch
  }
}
