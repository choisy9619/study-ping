// 인증 관련 타입 정의들

import type { BaseEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar_url?: string;
  email_verified?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_at: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  password: string;
  confirmPassword: string;
}
