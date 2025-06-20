// Database Types - Supabase Generated Types
// 데이터베이스 스키마와 일치하는 TypeScript 타입 정의

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Study {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  invite_code: string;
  image_url?: string;
  max_members: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  owner?: User;
  members?: StudyMember[];
  attendances?: Attendance[];
  announcements?: Announcement[];
}

export interface StudyMember {
  id: string;
  study_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;

  // Relations
  study?: Study;
  user?: User;
}

export interface Attendance {
  id: string;
  study_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  comment?: string;
  created_at: string;
  updated_at: string;

  // Relations
  study?: Study;
  user?: User;
}

export interface Announcement {
  id: string;
  study_id: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  study?: Study;
  author?: User;
}

// Create/Update 타입 (ID와 타임스탬프 제외)
export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUser = Partial<Omit<User, 'id' | 'email' | 'created_at' | 'updated_at'>>;

export type CreateStudy = Omit<Study, 'id' | 'invite_code' | 'created_at' | 'updated_at'>;
export type UpdateStudy = Partial<Omit<Study, 'id' | 'owner_id' | 'invite_code' | 'created_at' | 'updated_at'>>;

export type CreateStudyMember = Omit<StudyMember, 'id' | 'joined_at'>;
export type UpdateStudyMember = Partial<Omit<StudyMember, 'id' | 'study_id' | 'user_id' | 'joined_at'>>;

export type CreateAttendance = Omit<Attendance, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAttendance = Partial<
  Omit<Attendance, 'id' | 'study_id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>
>;

export type CreateAnnouncement = Omit<Announcement, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAnnouncement = Partial<
  Omit<Announcement, 'id' | 'study_id' | 'author_id' | 'created_at' | 'updated_at'>
>;

// 조인된 데이터 타입
export interface StudyWithDetails extends Study {
  owner: User;
  member_count: number;
  my_role?: 'owner' | 'admin' | 'member';
  latest_attendance?: string; // 최근 출석일
}

export interface AttendanceWithUser extends Attendance {
  user: User;
}

export interface AnnouncementWithAuthor extends Announcement {
  author: User;
}

// 통계 관련 타입
export interface AttendanceStats {
  user_id: string;
  study_id: string;
  total_attendance: number;
  attendance_rate: number;
  consecutive_days: number;
  last_attendance_date?: string;
}

export interface StudyStats {
  study_id: string;
  total_members: number;
  today_attendance: number;
  today_attendance_rate: number;
  total_announcements: number;
}

// API 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 검색 및 필터 타입
export interface StudyFilter {
  search?: string;
  isActive?: boolean;
  sortBy?: 'created_at' | 'name' | 'member_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface AttendanceFilter {
  study_id?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  pageSize?: number;
}

// Supabase 특화 타입
export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
}

export interface SupabaseListResponse<T> {
  data: T[] | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
  count?: number;
}

// 실시간 이벤트 타입
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimePayload<T = any> {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: RealtimeEvent;
  new?: T;
  old?: T;
}

// 유틸리티 타입
export type DatabaseTable = 'users' | 'studies' | 'study_members' | 'attendances' | 'announcements';

export interface TableRow {
  users: User;
  studies: Study;
  study_members: StudyMember;
  attendances: Attendance;
  announcements: Announcement;
}
