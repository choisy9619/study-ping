// 스터디 관련 API 서비스

import { supabase } from './supabase';
import { getCurrentUser } from './auth';
import type {
  Study,
  StudyWithMembers,
  StudyMember,
  CreateStudyRequest,
  UpdateStudyRequest,
  JoinStudyRequest,
} from '../types';
import { generateStudyCode } from '../utils';

/**
 * 스터디 생성
 */
export const createStudy = async (data: CreateStudyRequest): Promise<Study> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const studyData = {
    ...data,
    owner_id: user.id,
    code: generateStudyCode(),
    is_active: true,
  };

  const { data: study, error } = await supabase.from('studies').insert(studyData).select().single();

  if (error) throw error;

  // 생성자를 멤버로 추가
  await addStudyMember(study.id, user.id, 'owner');

  return study;
};

/**
 * 내가 참여한 스터디 목록 가져오기
 */
export const getMyStudies = async (): Promise<StudyWithMembers[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('study_members')
    .select(
      `
      *,
      study:studies (
        *,
        members:study_members (
          *,
          user:users (name, avatar_url)
        )
      )
    `
    )
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error) throw error;

  return (
    data?.map(item => ({
      ...item.study,
      members: item.study.members,
      member_count: item.study.members.length,
      my_role: item.role,
    })) || []
  );
};

/**
 * 스터디 상세 정보 가져오기
 */
export const getStudyById = async (studyId: string): Promise<StudyWithMembers> => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('studies')
    .select(
      `
      *,
      members:study_members (
        *,
        user:users (name, avatar_url)
      )
    `
    )
    .eq('id', studyId)
    .eq('is_active', true)
    .single();

  if (error) throw error;

  // 내 역할 찾기
  const myRole = user ? data.members.find((m: StudyMember) => m.user_id === user.id)?.role : undefined;

  return {
    ...data,
    member_count: data.members.length,
    my_role: myRole,
  };
};

/**
 * 스터디 참여
 */
export const joinStudy = async (request: JoinStudyRequest): Promise<Study> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 스터디 코드로 스터디 찾기
  const { data: study, error: studyError } = await supabase
    .from('studies')
    .select('*')
    .eq('code', request.code)
    .eq('is_active', true)
    .single();

  if (studyError) throw new Error('존재하지 않는 스터디 코드입니다.');

  // 이미 참여했는지 확인
  const { data: existingMember } = await supabase
    .from('study_members')
    .select('*')
    .eq('study_id', study.id)
    .eq('user_id', user.id)
    .single();

  if (existingMember) {
    throw new Error('이미 참여한 스터디입니다.');
  }

  // 멤버로 추가
  await addStudyMember(study.id, user.id, 'member');

  return study;
};

/**
 * 스터디 멤버 추가 (내부 함수)
 */
const addStudyMember = async (studyId: string, userId: string, role: 'owner' | 'member') => {
  const { error } = await supabase.from('study_members').insert({
    study_id: studyId,
    user_id: userId,
    role,
    is_active: true,
  });

  if (error) throw error;
};

/**
 * 스터디 업데이트
 */
export const updateStudy = async (studyId: string, updates: UpdateStudyRequest): Promise<Study> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 권한 확인 (스터디 소유자만 가능)
  const { data: member } = await supabase
    .from('study_members')
    .select('role')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .single();

  if (!member || member.role !== 'owner') {
    throw new Error('스터디를 수정할 권한이 없습니다.');
  }

  const { data, error } = await supabase.from('studies').update(updates).eq('id', studyId).select().single();

  if (error) throw error;
  return data;
};

/**
 * 스터디 탈퇴
 */
export const leaveStudy = async (studyId: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 스터디 소유자는 탈퇴할 수 없음
  const { data: member } = await supabase
    .from('study_members')
    .select('role')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .single();

  if (member?.role === 'owner') {
    throw new Error('스터디 소유자는 탈퇴할 수 없습니다.');
  }

  const { error } = await supabase
    .from('study_members')
    .update({ is_active: false })
    .eq('study_id', studyId)
    .eq('user_id', user.id);

  if (error) throw error;
};

/**
 * 스터디 삭제 (소유자만)
 */
export const deleteStudy = async (studyId: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 권한 확인
  const { data: member } = await supabase
    .from('study_members')
    .select('role')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .single();

  if (!member || member.role !== 'owner') {
    throw new Error('스터디를 삭제할 권한이 없습니다.');
  }

  const { error } = await supabase.from('studies').update({ is_active: false }).eq('id', studyId);

  if (error) throw error;
};

/**
 * 새로운 스터디 코드 생성
 */
export const regenerateStudyCode = async (studyId: string): Promise<string> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 권한 확인
  const { data: member } = await supabase
    .from('study_members')
    .select('role')
    .eq('study_id', studyId)
    .eq('user_id', user.id)
    .single();

  if (!member || member.role !== 'owner') {
    throw new Error('스터디 코드를 변경할 권한이 없습니다.');
  }

  const newCode = generateStudyCode();

  const { error } = await supabase.from('studies').update({ code: newCode }).eq('id', studyId);

  if (error) throw error;
  return newCode;
};
