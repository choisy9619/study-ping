// 출석 관련 API 서비스

import { supabase } from './supabase';
import type {
  Attendance,
  AttendanceStats,
  StudyAttendanceStats,
  CreateAttendanceRequest,
  MonthlyAttendance,
  AttendanceHeatmap,
  AttendanceCalendar,
} from '../types';
import { getTodayString } from '../utils';

/**
 * 출석 체크
 */
export const checkAttendance = async (request: CreateAttendanceRequest): Promise<Attendance> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 오늘 이미 출석했는지 확인
  const { data: existing } = await supabase
    .from('attendances')
    .select('*')
    .eq('study_id', request.study_id)
    .eq('user_id', user.id)
    .eq('date', request.date)
    .single();

  if (existing) {
    throw new Error('오늘은 이미 출석했습니다.');
  }

  const attendanceData = {
    study_id: request.study_id,
    user_id: user.id,
    date: request.date,
    comment: request.comment,
    is_present: true,
  };

  const { data, error } = await supabase.from('attendances').insert(attendanceData).select().single();

  if (error) throw error;
  return data;
};

/**
 * 스터디의 오늘 출석 현황 가져오기
 */
export const getTodayAttendance = async (studyId: string): Promise<Attendance[]> => {
  const today = getTodayString();

  const { data, error } = await supabase
    .from('attendances')
    .select(
      `
      *,
      user:users (name, avatar_url)
    `
    )
    .eq('study_id', studyId)
    .eq('date', today)
    .eq('is_present', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * 사용자의 스터디별 출석 통계 가져오기
 */
export const getUserAttendanceStats = async (studyId: string): Promise<StudyAttendanceStats> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data: attendances, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;

  const attendanceList = attendances || [];
  const stats = calculateAttendanceStats(attendanceList);

  return {
    study_id: studyId,
    stats,
    recent_attendances: attendanceList.slice(0, 10),
  };
};

/**
 * 출석 통계 계산
 */
const calculateAttendanceStats = (attendances: Attendance[]): AttendanceStats => {
  const presentAttendances = attendances.filter(a => a.is_present);
  const totalDays = attendances.length;
  const attendedDays = presentAttendances.length;
  const attendanceRate = totalDays > 0 ? (attendedDays / totalDays) * 100 : 0;

  return {
    total_days: totalDays,
    attended_days: attendedDays,
    attendance_rate: Math.round(attendanceRate * 100) / 100,
    current_streak: 0, // TODO: 계산 로직 구현
    longest_streak: 0, // TODO: 계산 로직 구현
  };
};

/**
 * 월별 출석 캘린더 데이터 가져오기
 */
export const getMonthlyAttendance = async (
  studyId: string,
  year: number,
  month: number
): Promise<MonthlyAttendance> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data: attendances, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;

  const attendanceList = attendances || [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const attendedDays = attendanceList.filter(a => a.is_present).length;

  // 일별 출석 기록 생성
  const dailyRecords: AttendanceCalendar[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];
    const attendance = attendanceList.find(a => a.date === date);

    dailyRecords.push({
      date,
      is_present: attendance?.is_present || false,
      comment: attendance?.comment,
    });
  }

  return {
    year,
    month,
    total_days: daysInMonth,
    attended_days: attendedDays,
    attendance_rate: daysInMonth > 0 ? (attendedDays / daysInMonth) * 100 : 0,
    daily_records: dailyRecords,
  };
};

/**
 * 출석 히트맵 데이터 가져오기 (GitHub 스타일)
 */
export const getAttendanceHeatmap = async (studyId: string): Promise<AttendanceHeatmap[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 최근 1년간의 출석 데이터
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const { data: attendances, error } = await supabase
    .from('attendances')
    .select('date, is_present')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0]);

  if (error) throw error;

  const attendanceMap = new Map();
  attendances?.forEach(attendance => {
    attendanceMap.set(attendance.date, attendance.is_present ? 1 : 0);
  });

  // 히트맵 데이터 생성
  const heatmapData: AttendanceHeatmap[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const count = attendanceMap.get(dateStr) || 0;

    // GitHub 스타일 레벨 (0-4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) level = 4; // 출석한 날은 최고 레벨

    heatmapData.push({
      date: dateStr,
      count,
      level,
    });

    current.setDate(current.getDate() + 1);
  }

  return heatmapData;
};
