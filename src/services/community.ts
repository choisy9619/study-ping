// 커뮤니티 관련 API 서비스 (댓글, 공지)

import { supabase } from './supabase';
import type {
  Comment,
  Announcement,
  DailyComments,
  AnnouncementList,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '../types';

/**
 * 댓글 작성 (출석한 사용자만 가능)
 */
export const createComment = async (request: CreateCommentRequest): Promise<Comment> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  // 해당 날짜에 출석했는지 확인
  const { data: attendance } = await supabase
    .from('attendances')
    .select('*')
    .eq('study_id', request.study_id)
    .eq('user_id', user.id)
    .eq('date', request.date)
    .eq('is_present', true)
    .single();

  if (!attendance) {
    throw new Error('출석한 날에만 댓글을 작성할 수 있습니다.');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      study_id: request.study_id,
      user_id: user.id,
      content: request.content,
      date: request.date,
    })
    .select(
      `
      *,
      user:users (name, avatar_url)
    `
    )
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    author_name: data.user.name,
    author_avatar: data.user.avatar_url,
    can_edit: true,
    can_delete: true,
  };
};

/**
 * 특정 날짜의 댓글 목록 가져오기
 */
export const getDailyComments = async (studyId: string, date: string): Promise<DailyComments> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments, error } = await supabase
    .from('comments')
    .select(
      `
      *,
      user:users (name, avatar_url)
    `
    )
    .eq('study_id', studyId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // 댓글 작성 권한 확인 (해당 날짜에 출석했는지)
  let canComment = false;
  if (user) {
    const { data: attendance } = await supabase
      .from('attendances')
      .select('*')
      .eq('study_id', studyId)
      .eq('user_id', user.id)
      .eq('date', date)
      .eq('is_present', true)
      .single();

    canComment = !!attendance;
  }

  const formattedComments: Comment[] =
    comments?.map(comment => ({
      ...comment,
      author_name: comment.user.name,
      author_avatar: comment.user.avatar_url,
      can_edit: user?.id === comment.user_id,
      can_delete: user?.id === comment.user_id,
    })) || [];

  return {
    date,
    comments: formattedComments,
    total_count: formattedComments.length,
    can_comment: canComment,
  };
};

/**
 * 댓글 수정
 */
export const updateComment = async (commentId: string, updates: UpdateCommentRequest): Promise<Comment> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', commentId)
    .eq('user_id', user.id) // 본인 댓글만 수정 가능
    .select(
      `
      *,
      user:users (name, avatar_url)
    `
    )
    .single();

  if (error) throw error;

  return {
    ...data,
    author_name: data.user.name,
    author_avatar: data.user.avatar_url,
    can_edit: true,
    can_delete: true,
  };
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id); // 본인 댓글만 삭제 가능

  if (error) throw error;
};

/**
 * 공지사항 작성 (스터디 소유자만 가능)
 */
export const createAnnouncement = async (request: CreateAnnouncementRequest): Promise<Announcement> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  // 스터디 소유자 권한 확인
  const { data: member } = await supabase
    .from('study_members')
    .select('role')
    .eq('study_id', request.study_id)
    .eq('user_id', user.id)
    .single();

  if (!member || member.role !== 'owner') {
    throw new Error('공지사항을 작성할 권한이 없습니다.');
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      study_id: request.study_id,
      author_id: user.id,
      title: request.title,
      content: request.content,
      is_pinned: request.is_pinned || false,
    })
    .select(
      `
      *,
      author:users (name, avatar_url)
    `
    )
    .single();

  if (error) throw error;

  return {
    ...data,
    author_name: data.author.name,
    author_avatar: data.author.avatar_url,
    can_edit: true,
    can_delete: true,
  };
};

/**
 * 스터디 공지사항 목록 가져오기
 */
export const getStudyAnnouncements = async (studyId: string): Promise<AnnouncementList> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: announcements, error } = await supabase
    .from('announcements')
    .select(
      `
      *,
      author:users (name, avatar_url)
    `
    )
    .eq('study_id', studyId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  const formattedAnnouncements: Announcement[] =
    announcements?.map(announcement => ({
      ...announcement,
      author_name: announcement.author.name,
      author_avatar: announcement.author.avatar_url,
      can_edit: user?.id === announcement.author_id,
      can_delete: user?.id === announcement.author_id,
    })) || [];

  const pinnedCount = formattedAnnouncements.filter(a => a.is_pinned).length;

  return {
    announcements: formattedAnnouncements,
    total_count: formattedAnnouncements.length,
    pinned_count: pinnedCount,
  };
};

/**
 * 공지사항 수정
 */
export const updateAnnouncement = async (
  announcementId: string,
  updates: UpdateAnnouncementRequest
): Promise<Announcement> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', announcementId)
    .eq('author_id', user.id) // 작성자만 수정 가능
    .select(
      `
      *,
      author:users (name, avatar_url)
    `
    )
    .single();

  if (error) throw error;

  return {
    ...data,
    author_name: data.author.name,
    author_avatar: data.author.avatar_url,
    can_edit: true,
    can_delete: true,
  };
};

/**
 * 공지사항 삭제
 */
export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase.from('announcements').delete().eq('id', announcementId).eq('author_id', user.id); // 작성자만 삭제 가능

  if (error) throw error;
};

/**
 * 공지사항 고정/고정해제
 */
export const toggleAnnouncementPin = async (announcementId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요합니다.');

  // 현재 고정 상태 확인
  const { data: announcement } = await supabase
    .from('announcements')
    .select('is_pinned')
    .eq('id', announcementId)
    .eq('author_id', user.id)
    .single();

  if (!announcement) throw new Error('공지사항을 찾을 수 없습니다.');

  const { error } = await supabase
    .from('announcements')
    .update({ is_pinned: !announcement.is_pinned })
    .eq('id', announcementId)
    .eq('author_id', user.id);

  if (error) throw error;
};
