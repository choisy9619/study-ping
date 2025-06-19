// 유효성 검사 유틸리티 함수들

import { VALIDATION_RULES } from '../constants'

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email)
}

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH &&
         VALIDATION_RULES.PASSWORD.PATTERN.test(password)
}

/**
 * 사용자명 검증
 */
export const validateUsername = (username: string): boolean => {
  return username.length >= VALIDATION_RULES.USERNAME.MIN_LENGTH &&
         username.length <= VALIDATION_RULES.USERNAME.MAX_LENGTH &&
         VALIDATION_RULES.USERNAME.PATTERN.test(username)
}

/**
 * 스터디 코드 검증
 */
export const validateStudyCode = (code: string): boolean => {
  return VALIDATION_RULES.STUDY_CODE.PATTERN.test(code)
}

/**
 * 스터디명 검증
 */
export const validateStudyName = (name: string): boolean => {
  return name.length >= VALIDATION_RULES.STUDY_NAME.MIN_LENGTH &&
         name.length <= VALIDATION_RULES.STUDY_NAME.MAX_LENGTH
}

/**
 * 파일 확장자 검증
 */
export const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return allowedExtensions.includes(extension)
}

/**
 * 파일 크기 검증
 */
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize
}

/**
 * URL 형식 검증
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 한국 휴대폰 번호 검증
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phonePattern = /^01[0-9]-?\d{4}-?\d{4}$/
  return phonePattern.test(phone.replace(/\s/g, ''))
}

/**
 * 필수 필드 검증
 */
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

/**
 * 문자열 길이 검증
 */
export const validateLength = (text: string, min?: number, max?: number): boolean => {
  if (min !== undefined && text.length < min) return false
  if (max !== undefined && text.length > max) return false
  return true
}
