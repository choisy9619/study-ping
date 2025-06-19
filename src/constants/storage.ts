// 로컬 스토리지 키 상수들

export const STORAGE_KEYS = {
  // 인증 관련
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  
  // 사용자 설정
  THEME: 'theme',
  LANGUAGE: 'language',
  PUSH_NOTIFICATIONS: 'push_notifications',
  
  // 임시 데이터
  DRAFT_STUDY: 'draft_study',
  LAST_VISIT: 'last_visit',
  
  // PWA 관련
  PWA_INSTALLED: 'pwa_installed',
  PWA_PROMPT_DISMISSED: 'pwa_prompt_dismissed'
} as const

// 세션 스토리지 키 상수들
export const SESSION_STORAGE_KEYS = {
  STUDY_JOIN_CODE: 'study_join_code',
  REDIRECT_AFTER_LOGIN: 'redirect_after_login',
  FORM_DATA: 'form_data'
} as const
