// 커뮤니티 관련 커스텀 훅

import { useState, useEffect } from 'react';
import {
  createComment,
  getDailyComments,
  updateComment,
  deleteComment,
  createAnnouncement,
  getStudyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementPin,
} from '../services';
import type {
  DailyComments,
  AnnouncementList,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '../types';

interface UseDailyCommentsReturn {
  dailyComments: DailyComments | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addComment: (content: string) => Promise<void>;
  editComment: (commentId: string, content: string) => Promise<void>;
  removeComment: (commentId: string) => Promise<void>;
}

/**
 * 특정 날짜의 댓글 관리 훅
 */
export const useDailyComments = (studyId: string, date: string): UseDailyCommentsReturn => {
  const [dailyComments, setDailyComments] = useState<DailyComments | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDailyComments(studyId, date);
      setDailyComments(data);
    } catch (err: any) {
      setError(err.message || '댓글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyId && date) {
      fetchComments();
    }
  }, [studyId, date]);

  const addComment = async (content: string) => {
    const request: CreateCommentRequest = {
      study_id: studyId,
      content,
      date,
    };
    await createComment(request);
    await fetchComments(); // 댓글 목록 새로고침
  };

  const editComment = async (commentId: string, content: string) => {
    const updates: UpdateCommentRequest = { content };
    await updateComment(commentId, updates);
    await fetchComments(); // 댓글 목록 새로고침
  };

  const removeComment = async (commentId: string) => {
    await deleteComment(commentId);
    await fetchComments(); // 댓글 목록 새로고침
  };

  return {
    dailyComments,
    isLoading,
    error,
    refetch: fetchComments,
    addComment,
    editComment,
    removeComment,
  };
};

interface UseAnnouncementsReturn {
  announcements: AnnouncementList | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addAnnouncement: (data: CreateAnnouncementRequest) => Promise<void>;
  editAnnouncement: (announcementId: string, updates: UpdateAnnouncementRequest) => Promise<void>;
  removeAnnouncement: (announcementId: string) => Promise<void>;
  togglePin: (announcementId: string) => Promise<void>;
}

/**
 * 스터디 공지사항 관리 훅
 */
export const useAnnouncements = (studyId: string): UseAnnouncementsReturn => {
  const [announcements, setAnnouncements] = useState<AnnouncementList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getStudyAnnouncements(studyId);
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || '공지사항을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyId) {
      fetchAnnouncements();
    }
  }, [studyId]);

  const addAnnouncement = async (data: CreateAnnouncementRequest) => {
    await createAnnouncement(data);
    await fetchAnnouncements(); // 공지사항 목록 새로고침
  };

  const editAnnouncement = async (announcementId: string, updates: UpdateAnnouncementRequest) => {
    await updateAnnouncement(announcementId, updates);
    await fetchAnnouncements(); // 공지사항 목록 새로고침
  };

  const removeAnnouncement = async (announcementId: string) => {
    await deleteAnnouncement(announcementId);
    await fetchAnnouncements(); // 공지사항 목록 새로고침
  };

  const togglePin = async (announcementId: string) => {
    await toggleAnnouncementPin(announcementId);
    await fetchAnnouncements(); // 공지사항 목록 새로고침
  };

  return {
    announcements,
    isLoading,
    error,
    refetch: fetchAnnouncements,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    togglePin,
  };
};

interface UseCommentFormReturn {
  content: string;
  setContent: (content: string) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  submit: () => Promise<void>;
  reset: () => void;
}

/**
 * 댓글 작성 폼 관리 훅
 */
export const useCommentForm = (
  onSubmit: (content: string) => Promise<void>,
  canComment: boolean = true
): UseCommentFormReturn => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = content.trim().length > 0 && canComment && !isSubmitting;

  const submit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim());
      setContent(''); // 성공시 폼 리셋
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setContent('');
  };

  return {
    content,
    setContent,
    isSubmitting,
    canSubmit,
    submit,
    reset,
  };
};

interface UseAnnouncementFormReturn {
  formData: {
    title: string;
    content: string;
    is_pinned: boolean;
  };
  updateField: (field: string, value: any) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  submit: () => Promise<void>;
  reset: () => void;
}

/**
 * 공지사항 작성 폼 관리 훅
 */
export const useAnnouncementForm = (
  onSubmit: (data: CreateAnnouncementRequest) => Promise<void>,
  studyId: string
): UseAnnouncementFormReturn => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_pinned: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = formData.title.trim().length > 0 && formData.content.trim().length > 0 && !isSubmitting;

  const submit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        study_id: studyId,
        title: formData.title.trim(),
        content: formData.content.trim(),
        is_pinned: formData.is_pinned,
      });
      reset(); // 성공시 폼 리셋
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData({
      title: '',
      content: '',
      is_pinned: false,
    });
  };

  return {
    formData,
    updateField,
    isSubmitting,
    canSubmit,
    submit,
    reset,
  };
};
