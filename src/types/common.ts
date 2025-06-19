// 공통 타입 정의들

export interface BaseEntity {
  id: string
  created_at: string
  updated_at?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginationResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingAction<T> {
  state: LoadingState
  data?: T
  error?: ApiError
}
