// 커뮤니티 관련 타입 정의들

import type { BaseEntity } from './common'

export interface Comment extends BaseEntity {
  study_id: string
  user_id: string
  content: string
  date: string // 댓글 작성 날짜 (YYYY-MM-DD)
  author_name: string
  author_avatar?: string
  can_edit: boolean
  can_delete: boolean
}

export interface Announcement extends BaseEntity {
  study_id: string
  author_id: string
  title: string
  content: string
  is_pinned: boolean
  author_name: string
  author_avatar?: string
  can_edit: boolean
  can_delete: boolean
}

export interface CreateCommentRequest {
  study_id: string
  content: string
  date: string
}

export interface UpdateCommentRequest {
  content: string
}

export interface CreateAnnouncementRequest {
  study_id: string
  title: string
  content: string
  is_pinned?: boolean
}

export interface UpdateAnnouncementRequest {
  title?: string
  content?: string
  is_pinned?: boolean
}

export interface DailyComments {
  date: string
  comments: Comment[]
  total_count: number
  can_comment: boolean // 해당 날짜에 출석했는지 여부
}

export interface AnnouncementList {
  announcements: Announcement[]
  total_count: number
  pinned_count: number
}
