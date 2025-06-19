// 애플리케이션 전반적인 상수들

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'StudyPing',
  DISPLAY_NAME: import.meta.env.VITE_APP_DISPLAY_NAME || '출석체크잇',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || '스터디 출석 체크 및 커뮤니티 앱',

  // API 설정
  API: {
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
  },

  // 페이지네이션
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },

  // 파일 업로드
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  },

  // 출석
  ATTENDANCE: {
    DAILY_LIMIT: 1, // 하루 1번만 출석 가능
    COMMENT_REQUIRED: false,
  },

  // 스터디
  STUDY: {
    MAX_MEMBERS: 50,
    CODE_EXPIRY_HOURS: 24 * 7, // 7일
    DEFAULT_IMAGE: '/images/study-default.png',
  },

  // 실시간 업데이트
  REALTIME: {
    HEARTBEAT_INTERVAL: 30000, // 30초
    RECONNECT_INTERVAL: 5000, // 5초
    MAX_RECONNECT_ATTEMPTS: 10,
  },
} as const;

// 테마 관련
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#10B981',
    SUCCESS: '#059669',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#0EA5E9',
  },

  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;

// 날짜/시간 형식
export const DATE_FORMATS = {
  DISPLAY: 'YYYY년 MM월 DD일',
  DISPLAY_WITH_TIME: 'YYYY년 MM월 DD일 HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm',
} as const;

// 알림 관련
export const NOTIFICATION = {
  DURATION: {
    SHORT: 2000,
    MEDIUM: 4000,
    LONG: 6000,
  },

  POSITION: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
  },
} as const;

// 애니메이션 지속시간
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
