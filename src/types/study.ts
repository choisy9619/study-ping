// 스터디 관련 타입 정의들

import type { BaseEntity } from './common'

export interface Study extends BaseEntity {
  name: string
  description: string
  owner_id: string
  code: string
  image_url?: string
  max_members?: number
  is_active: boolean
}

export interface StudyMember extends BaseEntity {
  study_id: string
  user_id: string
  joined_at: string
  role: 'owner' | 'member'
  is_active: boolean
}

export interface StudyWithMembers extends Study {
  members: StudyMember[]
  member_count: number
  my_role?: 'owner' | 'member'
}

export interface CreateStudyRequest {
  name: string
  description: string
  max_members?: number
  image_url?: string
}

export interface UpdateStudyRequest {
  name?: string
  description?: string
  max_members?: number
  image_url?: string
  is_active?: boolean
}

export interface JoinStudyRequest {
  code: string
}

export interface StudyInvite {
  study_id: string
  code: string
  expires_at?: string
  max_uses?: number
  current_uses: number
}
