// 유틸리티에서 사용하는 상수들

/**
 * HTTP 상태 코드
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

/**
 * 디바운스 기본 딜레이 (ms)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  RESIZE: 100,
  SCROLL: 50,
  INPUT: 500
} as const

/**
 * 스로틀링 기본 딜레이 (ms)
 */
export const THROTTLE_DELAY = {
  SCROLL: 16, // 60fps
  RESIZE: 100,
  CLICK: 1000
} as const

/**
 * 캐시 만료 시간 (ms)
 */
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5분
  MEDIUM: 30 * 60 * 1000, // 30분
  LONG: 24 * 60 * 60 * 1000 // 24시간
} as const

/**
 * 네트워크 상태
 */
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  SLOW: 'slow'
} as const

/**
 * 디바이스 타입
 */
export const DEVICE_TYPE = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
} as const

/**
 * 터치 제스처 임계값
 */
export const TOUCH_THRESHOLD = {
  SWIPE_DISTANCE: 50,
  SWIPE_VELOCITY: 0.3,
  TAP_DURATION: 200,
  LONG_PRESS_DURATION: 500
} as const

/**
 * 이미지 관련 상수
 */
export const IMAGE = {
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  QUALITY: 0.8,
  PLACEHOLDER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PC9zdmc+'
} as const

/**
 * 폼 검증 상태
 */
export const FORM_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  VALID: 'valid',
  INVALID: 'invalid',
  SUBMITTING: 'submitting',
  SUBMITTED: 'submitted',
  ERROR: 'error'
} as const
