# StudyPing (출석체크잇)

스터디 출석 체크 및 커뮤니티 앱

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd study-ping
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

`.env` 파일에서 다음 값들을 설정하세요:

#### 필수 설정 (Supabase)

1. [Supabase](https://app.supabase.com)에 가입하고 새 프로젝트를 생성
2. 프로젝트 설정에서 다음 정보를 복사:
   - `VITE_SUPABASE_URL`: 프로젝트 URL
   - `VITE_SUPABASE_ANON_KEY`: Anonymous key

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 개발 서버 실행

```bash
npm run dev
```

앱이 http://localhost:5173에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Input 등)
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── study/          # 스터디 관련 컴포넌트
│   ├── attendance/     # 출석 관련 컴포넌트
│   └── community/      # 커뮤니티 관련 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── services/           # API 서비스
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── constants/          # 상수 정의
└── store/              # 상태 관리
```

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Backend**: Supabase (Auth, Database, Realtime)
- **State Management**: React Hooks (+ Zustand 예정)

## 📋 주요 기능

- 🔐 **인증**: 이메일/비밀번호, Google OAuth
- 📚 **스터디 관리**: 생성, 참여, 관리
- ✅ **출석 체크**: 일일 출석, 통계, 히트맵
- 💬 **커뮤니티**: 댓글, 공지사항
- 📊 **통계**: 출석률, 연속 출석일
- 📱 **PWA**: 모바일 최적화, 오프라인 지원

## 🔧 개발 가이드

### 빌드

```bash
npm run build
```

### 린트

```bash
npm run lint
```

### 타입 체크

```bash
npm run type-check
```

### 미리보기

```bash
npm run preview
```

## 🚨 문제 해결

### Supabase 연결 오류

1. `.env` 파일이 올바르게 설정되었는지 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. API URL과 Key가 정확한지 확인

### 개발 모드 실행

Supabase 설정 없이도 개발 모드로 실행 가능합니다:

```bash
# 환경 변수 없이 실행 (Mock 데이터 사용)
npm run dev
```

## 📞 지원

문제가 발생하면 이슈를 등록해주세요.

