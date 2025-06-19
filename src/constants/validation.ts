// 유효성 검사 상수들

export const VALIDATION_RULES = {
  // 사용자 정보
  USERNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    PATTERN: /^[가-힣a-zA-Z0-9_]+$/,
  },

  // 이메일
  EMAIL: {
    PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },

  // 비밀번호
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    PATTERN: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
  },

  // 스터디
  STUDY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },

  STUDY_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },

  STUDY_CODE: {
    LENGTH: 6,
    PATTERN: /^[A-Z0-9]{6}$/,
  },

  // 출석 관련
  ATTENDANCE_COMMENT: {
    MAX_LENGTH: 200,
  },

  // 공지
  ANNOUNCEMENT_TITLE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },

  ANNOUNCEMENT_CONTENT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 1000,
  },
} as const;

// 에러 메시지
export const VALIDATION_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다.',

  USERNAME: {
    MIN_LENGTH: `사용자명은 ${VALIDATION_RULES.USERNAME.MIN_LENGTH}자 이상이어야 합니다.`,
    MAX_LENGTH: `사용자명은 ${VALIDATION_RULES.USERNAME.MAX_LENGTH}자 이하여야 합니다.`,
    PATTERN: '사용자명은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.',
  },

  EMAIL: {
    PATTERN: '올바른 이메일 형식이 아닙니다.',
  },

  PASSWORD: {
    MIN_LENGTH: `비밀번호는 ${VALIDATION_RULES.PASSWORD.MIN_LENGTH}자 이상이어야 합니다.`,
    PATTERN: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  },

  PASSWORD_CONFIRM: {
    NOT_MATCH: '비밀번호가 일치하지 않습니다.',
  },

  STUDY_NAME: {
    MIN_LENGTH: `스터디명은 ${VALIDATION_RULES.STUDY_NAME.MIN_LENGTH}자 이상이어야 합니다.`,
    MAX_LENGTH: `스터디명은 ${VALIDATION_RULES.STUDY_NAME.MAX_LENGTH}자 이하여야 합니다.`,
  },

  STUDY_DESCRIPTION: {
    MIN_LENGTH: `스터디 설명은 ${VALIDATION_RULES.STUDY_DESCRIPTION.MIN_LENGTH}자 이상이어야 합니다.`,
    MAX_LENGTH: `스터디 설명은 ${VALIDATION_RULES.STUDY_DESCRIPTION.MAX_LENGTH}자 이하여야 합니다.`,
  },

  STUDY_CODE: {
    PATTERN: '올바른 스터디 코드 형식이 아닙니다. (6자리 영문 대문자 + 숫자)',
  },
} as const;
