# StudyPing Auth 설정 가이드

## 이메일 인증 설정

StudyPing은 환경변수를 통해 이메일 인증을 제어할 수 있습니다.

### 환경변수 설정

```bash
# 이메일 인증 건너뛰기 (초기 서비스 런칭 시 권장)
VITE_SKIP_EMAIL_CONFIRMATION=true

# 이메일 인증 활성화 (서비스 안정화 후)
VITE_SKIP_EMAIL_CONFIRMATION=false
```

### 개발환경 (.env.local)

```env
VITE_SKIP_EMAIL_CONFIRMATION=true
```

### 운영환경 (.env.production)

초기 서비스 런칭 시:

```env
VITE_SKIP_EMAIL_CONFIRMATION=true
```

서비스 안정화 후:

```env
VITE_SKIP_EMAIL_CONFIRMATION=false
```

## 동작 방식

### 이메일 인증 건너뛰기 활성화 시 (`true`)

1. 사용자가 회원가입 요청
2. Supabase에 사용자 생성
3. 자동으로 이메일 인증 상태로 변경
4. 자동 로그인 처리
5. 대시보드로 리다이렉트

### 이메일 인증 활성화 시 (`false`)

1. 사용자가 회원가입 요청
2. Supabase에 사용자 생성
3. 이메일 인증 링크 발송
4. 사용자가 이메일에서 인증 완료
5. 로그인 가능

## 브라우저 헬퍼 함수

개발 중 다음 함수들을 사용할 수 있습니다:

```javascript
// 현재 Auth 설정 및 상태 확인
window.authHelpers.debugAuthStatus();

// 특정 사용자 이메일 인증 (VITE_SKIP_EMAIL_CONFIRMATION=true일 때만)
window.authHelpers.confirmUserEmail('user@example.com');

// 모든 미인증 사용자 일괄 인증 (VITE_SKIP_EMAIL_CONFIRMATION=true일 때만)
window.authHelpers.confirmAllUsers();
```

## 배포 시 주의사항

1. **초기 런칭**: `VITE_SKIP_EMAIL_CONFIRMATION=true`로 설정하여 사용자 경험 개선
2. **서비스 안정화**: 사용자 기반이 형성된 후 `VITE_SKIP_EMAIL_CONFIRMATION=false`로 변경
3. **보안 강화**: 이메일 인증 활성화 시 Supabase 대시보드에서 추가 보안 설정 검토

## 마이그레이션 가이드

이메일 인증을 나중에 활성화하려면:

1. 환경변수 변경: `VITE_SKIP_EMAIL_CONFIRMATION=false`
2. 기존 사용자들에게 이메일 재인증 요청 (선택사항)
3. 새로운 가입자부터 이메일 인증 적용
