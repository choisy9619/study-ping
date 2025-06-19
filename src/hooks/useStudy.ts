// 스터디 관련 커스텀 훅

import { useState, useEffect } from 'react'
import { 
  getMyStudies, 
  getStudyById, 
  createStudy, 
  joinStudy, 
  updateStudy, 
  leaveStudy, 
  deleteStudy,
  regenerateStudyCode
} from '../services/study'
import type { 
  Study, 
  StudyWithMembers, 
  CreateStudyRequest, 
  UpdateStudyRequest, 
  JoinStudyRequest 
} from '../types'

interface UseStudiesReturn {
  studies: StudyWithMembers[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createStudy: (data: CreateStudyRequest) => Promise<Study>
  joinStudy: (request: JoinStudyRequest) => Promise<Study>
}

/**
 * 내 스터디 목록 관리 훅
 */
export const useStudies = (): UseStudiesReturn => {
  const [studies, setStudies] = useState<StudyWithMembers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudies = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getMyStudies()
      setStudies(data)
    } catch (err: any) {
      setError(err.message || '스터디 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudies()
  }, [])

  const handleCreateStudy = async (data: CreateStudyRequest): Promise<Study> => {
    const newStudy = await createStudy(data)
    await fetchStudies() // 목록 새로고침
    return newStudy
  }

  const handleJoinStudy = async (request: JoinStudyRequest): Promise<Study> => {
    const study = await joinStudy(request)
    await fetchStudies() // 목록 새로고침
    return study
  }

  return {
    studies,
    isLoading,
    error,
    refetch: fetchStudies,
    createStudy: handleCreateStudy,
    joinStudy: handleJoinStudy
  }
}

interface UseStudyReturn {
  study: StudyWithMembers | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateStudy: (updates: UpdateStudyRequest) => Promise<void>
  leaveStudy: () => Promise<void>
  deleteStudy: () => Promise<void>
  regenerateCode: () => Promise<string>
}

/**
 * 개별 스터디 관리 훅
 */
export const useStudy = (studyId: string): UseStudyReturn => {
  const [study, setStudy] = useState<StudyWithMembers | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudy = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getStudyById(studyId)
      setStudy(data)
    } catch (err: any) {
      setError(err.message || '스터디 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (studyId) {
      fetchStudy()
    }
  }, [studyId])

  const handleUpdateStudy = async (updates: UpdateStudyRequest) => {
    await updateStudy(studyId, updates)
    await fetchStudy() // 정보 새로고침
  }

  const handleLeaveStudy = async () => {
    await leaveStudy(studyId)
  }

  const handleDeleteStudy = async () => {
    await deleteStudy(studyId)
  }

  const handleRegenerateCode = async (): Promise<string> => {
    const newCode = await regenerateStudyCode(studyId)
    await fetchStudy() // 정보 새로고침
    return newCode
  }

  return {
    study,
    isLoading,
    error,
    refetch: fetchStudy,
    updateStudy: handleUpdateStudy,
    leaveStudy: handleLeaveStudy,
    deleteStudy: handleDeleteStudy,
    regenerateCode: handleRegenerateCode
  }
}
