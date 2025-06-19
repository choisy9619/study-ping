// 출석 관련 커스텀 훅

import { useState, useEffect } from 'react';
import {
  checkAttendance,
  getTodayAttendance,
  getUserAttendanceStats,
  getMonthlyAttendance,
  getAttendanceHeatmap,
} from '../services';
import type {
  Attendance,
  StudyAttendanceStats,
  CreateAttendanceRequest,
  MonthlyAttendance,
  AttendanceHeatmap,
} from '../types';
import { getTodayString } from '../utils';

interface UseTodayAttendanceReturn {
  attendances: Attendance[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  checkIn: (request: CreateAttendanceRequest) => Promise<void>;
}

/**
 * 오늘의 출석 현황 관리 훅
 */
export const useTodayAttendance = (studyId: string): UseTodayAttendanceReturn => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayAttendance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTodayAttendance(studyId);
      setAttendances(data);
    } catch (err: any) {
      setError(err.message || '출석 현황을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyId) {
      fetchTodayAttendance();
    }
  }, [studyId]);

  const handleCheckIn = async (request: CreateAttendanceRequest) => {
    await checkAttendance(request);
    await fetchTodayAttendance(); // 출석 현황 새로고침
  };

  return {
    attendances,
    isLoading,
    error,
    refetch: fetchTodayAttendance,
    checkIn: handleCheckIn,
  };
};

interface UseAttendanceStatsReturn {
  stats: StudyAttendanceStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 출석 통계 관리 훅
 */
export const useAttendanceStats = (studyId: string): UseAttendanceStatsReturn => {
  const [stats, setStats] = useState<StudyAttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserAttendanceStats(studyId);
      setStats(data);
    } catch (err: any) {
      setError(err.message || '출석 통계를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyId) {
      fetchStats();
    }
  }, [studyId]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

interface UseMonthlyAttendanceReturn {
  monthlyData: MonthlyAttendance | null;
  isLoading: boolean;
  error: string | null;
  fetchMonth: (year: number, month: number) => Promise<void>;
}

/**
 * 월별 출석 데이터 관리 훅
 */
export const useMonthlyAttendance = (studyId: string): UseMonthlyAttendanceReturn => {
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonth = async (year: number, month: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMonthlyAttendance(studyId, year, month);
      setMonthlyData(data);
    } catch (err: any) {
      setError(err.message || '월별 출석 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    monthlyData,
    isLoading,
    error,
    fetchMonth,
  };
};

interface UseAttendanceHeatmapReturn {
  heatmapData: AttendanceHeatmap[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 출석 히트맵 데이터 관리 훅
 */
export const useAttendanceHeatmap = (studyId: string): UseAttendanceHeatmapReturn => {
  const [heatmapData, setHeatmapData] = useState<AttendanceHeatmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeatmap = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAttendanceHeatmap(studyId);
      setHeatmapData(data);
    } catch (err: any) {
      setError(err.message || '출석 히트맵을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyId) {
      fetchHeatmap();
    }
  }, [studyId]);

  return {
    heatmapData,
    isLoading,
    error,
    refetch: fetchHeatmap,
  };
};

/**
 * 간단한 출석 체크 훅
 */
export const useAttendanceCheck = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkIn = async (studyId: string, comment?: string) => {
    try {
      setIsLoading(true);
      await checkAttendance({
        study_id: studyId,
        date: getTodayString(),
        comment,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkIn,
    isLoading,
  };
};
