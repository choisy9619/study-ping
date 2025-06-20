// 라우트 경로 상수들

export const ROUTES = {
  // 인증
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // 메인
  HOME: '/',
  DASHBOARD: '/dashboard',

  // 개발
  DEV_CHECK: '/dev-check',

  // 스터디
  STUDIES: '/studies',
  STUDY_DETAIL: '/studies/:id',
  STUDY_CREATE: '/studies/create',
  STUDY_JOIN: '/studies/join',

  // 출석
  ATTENDANCE: '/attendance',
  ATTENDANCE_HISTORY: '/attendance/history',

  // 마이페이지
  MY_PAGE: '/my',
  PROFILE: '/my/profile',
  SETTINGS: '/my/settings',

  // 기타
  NOT_FOUND: '/404',
  ERROR: '/error',
} as const;

// 라우트 파라미터를 포함한 경로 생성 헬퍼
export const createRoute = {
  studyDetail: (id: string) => `/studies/${id}`,
  studyJoin: (code?: string) => (code ? `/studies/join?code=${code}` : '/studies/join'),
};

// 보호된 라우트 (인증 필요)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.STUDIES,
  ROUTES.STUDY_CREATE,
  ROUTES.ATTENDANCE,
  ROUTES.MY_PAGE,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
];

// 인증된 사용자가 접근하면 안되는 라우트
export const GUEST_ONLY_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD];
