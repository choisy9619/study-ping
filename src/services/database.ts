// Database Service
// Supabase 데이터베이스 작업을 위한 서비스 함수들

import { supabase } from './supabase';
import type {
  User,
  Study,
  StudyMember,
  Attendance,
  Announcement,
  CreateStudy,
  CreateAnnouncement,
  UpdateStudy,
  UpdateAttendance,
  UpdateAnnouncement,
  StudyWithDetails,
  AttendanceWithUser,
  AnnouncementWithAuthor,
  StudyFilter,
  AttendanceFilter,
  SupabaseResponse,
  SupabaseListResponse,
  RealtimePayload,
} from '../types/database';

// ==================== USERS ====================

export const userService = {
  // 현재 사용자 프로필 조회
  async getCurrentUser(): Promise<SupabaseResponse<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    return { data, error };
  },

  // 사용자 프로필 업데이트
  async updateProfile(updates: Partial<User>): Promise<SupabaseResponse<User>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase.from('users').update(updates).eq('id', user.data.user.id).select().single();

    return { data, error };
  },

  // 사용자 ID로 프로필 조회
  async getUserById(userId: string): Promise<SupabaseResponse<User>> {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    return { data, error };
  },
};

// ==================== STUDIES ====================

export const studyService = {
  // 스터디 생성
  async createStudy(studyData: CreateStudy): Promise<SupabaseResponse<Study>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    // 초대 코드 생성
    const { data: inviteCode } = await supabase.rpc('generate_invite_code');

    const { data, error } = await supabase
      .from('studies')
      .insert({
        ...studyData,
        owner_id: user.data.user.id,
        invite_code: inviteCode,
      })
      .select()
      .single();

    return { data, error };
  },

  // 스터디 목록 조회 (필터링 지원)
  async getStudies(filter: StudyFilter = {}): Promise<SupabaseListResponse<StudyWithDetails>> {
    let query = supabase.from('studies').select(
      `
        *,
        owner:users(id, name, email, avatar_url),
        member_count:study_members(count)
      `,
      { count: 'exact' }
    );

    // 필터 적용
    if (filter.search) {
      query = query.ilike('name', `%${filter.search}%`);
    }
    if (filter.isActive !== undefined) {
      query = query.eq('is_active', filter.isActive);
    }

    // 정렬
    const sortBy = filter.sortBy || 'created_at';
    const sortOrder = filter.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // 페이지네이션
    if (filter.page && filter.pageSize) {
      const from = (filter.page - 1) * filter.pageSize;
      const to = from + filter.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    return { data, error, count: count ?? undefined };
  },

  // 스터디 상세 조회
  async getStudyById(studyId: string): Promise<SupabaseResponse<StudyWithDetails>> {
    const { data, error } = await supabase
      .from('studies')
      .select(
        `
        *,
        owner:users(id, name, email, avatar_url),
        members:study_members(
          id, role, joined_at,
          user:users(id, name, email, avatar_url)
        ),
        announcements(
          id, title, content, is_pinned, created_at,
          author:users(id, name, email, avatar_url)
        )
      `
      )
      .eq('id', studyId)
      .single();

    return { data, error };
  },

  // 초대 코드로 스터디 조회
  async getStudyByInviteCode(inviteCode: string): Promise<SupabaseResponse<StudyWithDetails>> {
    const { data, error } = await supabase
      .from('studies')
      .select(
        `
        *,
        owner:users(id, name, email, avatar_url),
        member_count:study_members(count)
      `
      )
      .eq('invite_code', inviteCode)
      .eq('is_active', true)
      .single();

    return { data, error };
  },

  // 스터디 업데이트 (소유자만)
  async updateStudy(studyId: string, updates: UpdateStudy): Promise<SupabaseResponse<Study>> {
    const { data, error } = await supabase.from('studies').update(updates).eq('id', studyId).select().single();

    return { data, error };
  },

  // 스터디 삭제 (소유자만)
  async deleteStudy(studyId: string): Promise<SupabaseResponse<null>> {
    const { data, error } = await supabase.from('studies').delete().eq('id', studyId).select().single();

    return { data, error };
  },

  // 내가 참여한 스터디 목록
  async getMyStudies(): Promise<SupabaseListResponse<StudyWithDetails>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('study_members')
      .select(
        `
        role, joined_at,
        study:studies(
          *,
          owner:users(id, name, email, avatar_url),
          member_count:study_members(count)
        )
      `
      )
      .eq('user_id', user.data.user.id);

    // 데이터 변환
    const transformedData: StudyWithDetails[] =
      data?.map(
        item =>
          ({
            ...item.study,
            my_role: item.role,
          }) as unknown as StudyWithDetails
      ) || [];

    return { data: transformedData, error };
  },
};

// ==================== STUDY MEMBERS ====================

export const studyMemberService = {
  // 스터디 참여
  async joinStudy(studyId: string): Promise<SupabaseResponse<StudyMember>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('study_members')
      .insert({
        study_id: studyId,
        user_id: user.data.user.id,
        role: 'member',
      })
      .select()
      .single();

    return { data, error };
  },

  // 스터디 멤버 목록 조회
  async getStudyMembers(studyId: string): Promise<SupabaseListResponse<StudyMember>> {
    const { data, error } = await supabase
      .from('study_members')
      .select(
        `
        *,
        user:users(id, name, email, avatar_url)
      `
      )
      .eq('study_id', studyId)
      .order('joined_at', { ascending: false });

    return { data, error };
  },

  // 스터디 탈퇴
  async leaveStudy(studyId: string): Promise<SupabaseResponse<null>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('study_members')
      .delete()
      .eq('study_id', studyId)
      .eq('user_id', user.data.user.id)
      .select()
      .single();

    return { data, error };
  },

  // 멤버 역할 변경 (소유자/관리자만)
  async updateMemberRole(
    studyId: string,
    userId: string,
    role: 'admin' | 'member'
  ): Promise<SupabaseResponse<StudyMember>> {
    const { data, error } = await supabase
      .from('study_members')
      .update({ role })
      .eq('study_id', studyId)
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  },
};

// ==================== ATTENDANCES ====================

export const attendanceService = {
  // 출석 체크
  async checkAttendance(studyId: string, comment?: string): Promise<SupabaseResponse<Attendance>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('attendances')
      .insert({
        study_id: studyId,
        user_id: user.data.user.id,
        date: today,
        comment,
      })
      .select()
      .single();

    return { data, error };
  },

  // 출석 기록 조회
  async getAttendances(filter: AttendanceFilter = {}): Promise<SupabaseListResponse<AttendanceWithUser>> {
    let query = supabase.from('attendances').select(
      `
        *,
        user:users(id, name, email, avatar_url)
      `,
      { count: 'exact' }
    );

    // 필터 적용
    if (filter.study_id) {
      query = query.eq('study_id', filter.study_id);
    }
    if (filter.user_id) {
      query = query.eq('user_id', filter.user_id);
    }
    if (filter.date_from) {
      query = query.gte('date', filter.date_from);
    }
    if (filter.date_to) {
      query = query.lte('date', filter.date_to);
    }

    // 정렬 (최신순)
    query = query.order('created_at', { ascending: false });

    // 페이지네이션
    if (filter.page && filter.pageSize) {
      const from = (filter.page - 1) * filter.pageSize;
      const to = from + filter.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    return { data, error, count: count ?? undefined };
  },

  // 오늘의 출석자 목록
  async getTodayAttendances(studyId: string): Promise<SupabaseListResponse<AttendanceWithUser>> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('attendances')
      .select(
        `
        *,
        user:users(id, name, email, avatar_url)
      `
      )
      .eq('study_id', studyId)
      .eq('date', today)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // 출석 기록 수정 (댓글 수정)
  async updateAttendance(attendanceId: string, updates: UpdateAttendance): Promise<SupabaseResponse<Attendance>> {
    const { data, error } = await supabase.from('attendances').update(updates).eq('id', attendanceId).select().single();

    return { data, error };
  },

  // 출석률 계산
  async getAttendanceRate(userId: string, studyId: string): Promise<number> {
    const { data } = await supabase.rpc('calculate_attendance_rate', {
      p_user_id: userId,
      p_study_id: studyId,
    });

    return data || 0;
  },
};

// ==================== ANNOUNCEMENTS ====================

export const announcementService = {
  // 공지사항 생성 (스터디장/관리자만)
  async createAnnouncement(announcementData: CreateAnnouncement): Promise<SupabaseResponse<Announcement>> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...announcementData,
        author_id: user.data.user.id,
      })
      .select()
      .single();

    return { data, error };
  },

  // 스터디 공지사항 목록 조회
  async getAnnouncements(studyId: string): Promise<SupabaseListResponse<AnnouncementWithAuthor>> {
    const { data, error } = await supabase
      .from('announcements')
      .select(
        `
        *,
        author:users(id, name, email, avatar_url)
      `
      )
      .eq('study_id', studyId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // 공지사항 업데이트
  async updateAnnouncement(
    announcementId: string,
    updates: UpdateAnnouncement
  ): Promise<SupabaseResponse<Announcement>> {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', announcementId)
      .select()
      .single();

    return { data, error };
  },

  // 공지사항 삭제
  async deleteAnnouncement(announcementId: string): Promise<SupabaseResponse<null>> {
    const { data, error } = await supabase.from('announcements').delete().eq('id', announcementId).select().single();

    return { data, error };
  },
};

// ==================== 실시간 구독 ====================

type RealtimeCallbacks = {
  onAttendanceChange?: (payload: RealtimePayload<Attendance>) => void;
  onAnnouncementChange?: (payload: RealtimePayload<Announcement>) => void;
};

export const realtimeService = {
  // 스터디별 실시간 구독 (출석, 공지, 댓글)
  subscribeToStudy(studyId: string, callbacks: RealtimeCallbacks) {
    const channel = supabase
      .channel(`study_${studyId}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'attendances',
          filter: `study_id=eq.${studyId}`,
        },
        callbacks.onAttendanceChange || (() => {})
      )
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
          filter: `study_id=eq.${studyId}`,
        },
        callbacks.onAnnouncementChange || (() => {})
      )
      .subscribe();

    return channel;
  },

  // 구독 해제
  unsubscribe(channel: ReturnType<typeof supabase.channel>) {
    return supabase.removeChannel(channel);
  },
};
