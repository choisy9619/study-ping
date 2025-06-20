// Supabase 클라이언트 설정

import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const supabaseUrl = env.supabase.url;
const supabaseAnonKey = env.supabase.anonKey;

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 Anon Key가 필요합니다. .env.local 파일을 확인해주세요.');
}

if (import.meta.env.DEV) {
  console.log('🔗 Supabase 클라이언트 초기화됨:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // PWA 지원을 위한 localStorage 사용
    storage: window.localStorage,
  },
  realtime: {
    // 실시간 기능을 위한 설정
    params: {
      eventsPerSecond: 10,
    },
  },
});

// 헬퍼 함수들
export async function checkAuthStatus() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error('Error checking auth status:', error);
    return { session: null, user: null };
  }
  return { session, user: session?.user || null };
}

// 타입 안전성을 위한 Database 타입 (PRD에 맞춰 확장)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          created_at: string;
          updated_at?: string;
          email_verified?: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          email_verified?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          email_verified?: boolean;
        };
      };
      studies: {
        Row: {
          id: string;
          name: string;
          description?: string;
          owner_id: string;
          code: string;
          image_url?: string;
          max_members?: number;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          owner_id: string;
          code?: string;
          image_url?: string;
          max_members?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          owner_id?: string;
          code?: string;
          image_url?: string;
          max_members?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      study_members: {
        Row: {
          id: string;
          study_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          study_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          study_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
      attendances: {
        Row: {
          id: string;
          study_id: string;
          user_id: string;
          date: string;
          comment?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          study_id: string;
          user_id: string;
          date: string;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          study_id?: string;
          user_id?: string;
          date?: string;
          comment?: string;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          study_id: string;
          title: string;
          content: string;
          author_id: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          study_id: string;
          title: string;
          content: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          study_id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// 타입 안전한 Supabase 클라이언트
export type SupabaseClient = typeof supabase;
