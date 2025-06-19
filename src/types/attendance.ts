// 출석 관련 타입 정의들

import type { BaseEntity } from './common';

export interface Attendance extends BaseEntity {
  study_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD 형식
  comment?: string;
  is_present: boolean;
}

export interface AttendanceStats {
  total_days: number;
  attended_days: number;
  attendance_rate: number;
  current_streak: number;
  longest_streak: number;
}

export interface StudyAttendanceStats {
  study_id: string;
  stats: AttendanceStats;
  recent_attendances: Attendance[];
}

export interface AttendanceCalendar {
  date: string;
  is_present: boolean;
  comment?: string;
}

export interface CreateAttendanceRequest {
  study_id: string;
  date: string;
  comment?: string;
}

export interface UpdateAttendanceRequest {
  comment?: string;
  is_present?: boolean;
}

export interface AttendanceHeatmap {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub 스타일 히트맵 레벨
}

export interface MonthlyAttendance {
  year: number;
  month: number;
  total_days: number;
  attended_days: number;
  attendance_rate: number;
  daily_records: AttendanceCalendar[];
}
