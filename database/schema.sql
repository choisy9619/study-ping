-- StudyPing Database Schema
-- 스터디 출석 체크 및 커뮤니티 앱을 위한 데이터베이스 스키마

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users 테이블 (사용자 정보)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. studies 테이블 (스터디 메타데이터)
CREATE TABLE IF NOT EXISTS studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invite_code VARCHAR(8) UNIQUE NOT NULL,
  image_url TEXT,
  max_members INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. study_members 테이블 (스터디 참여자)
CREATE TABLE IF NOT EXISTS study_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(study_id, user_id)
);

-- 4. attendances 테이블 (출석 기록 & 한마디)
CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(study_id, user_id, date)
);

-- 5. announcements 테이블 (공지사항)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 인덱스 생성
-- studies 테이블
CREATE INDEX IF NOT EXISTS idx_studies_owner_id ON studies(owner_id);
CREATE INDEX IF NOT EXISTS idx_studies_invite_code ON studies(invite_code);
CREATE INDEX IF NOT EXISTS idx_studies_active ON studies(is_active);

-- study_members 테이블  
CREATE INDEX IF NOT EXISTS idx_study_members_study_id ON study_members(study_id);
CREATE INDEX IF NOT EXISTS idx_study_members_user_id ON study_members(user_id);

-- attendances 테이블
CREATE INDEX IF NOT EXISTS idx_attendances_study_id ON attendances(study_id);
CREATE INDEX IF NOT EXISTS idx_attendances_user_id ON attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_attendances_date ON attendances(date);
CREATE INDEX IF NOT EXISTS idx_attendances_study_date ON attendances(study_id, date);

-- announcements 테이블
CREATE INDEX IF NOT EXISTS idx_announcements_study_id ON announcements(study_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON announcements(is_pinned);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- users 테이블 정책
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view all profiles" ON users;
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

-- studies 테이블 정책
DROP POLICY IF EXISTS "Anyone can view studies" ON studies;
CREATE POLICY "Anyone can view studies" ON studies
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can create studies" ON studies;
CREATE POLICY "Authenticated users can create studies" ON studies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Study owners can update studies" ON studies;
CREATE POLICY "Study owners can update studies" ON studies
  FOR UPDATE USING (auth.uid() = owner_id);

-- study_members 테이블 정책
DROP POLICY IF EXISTS "Study members can view members" ON study_members;
CREATE POLICY "Study members can view members" ON study_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM study_members sm 
      WHERE sm.study_id = study_members.study_id 
      AND sm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join studies" ON study_members;
CREATE POLICY "Users can join studies" ON study_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- attendances 테이블 정책
DROP POLICY IF EXISTS "Study members can view attendances" ON attendances;
CREATE POLICY "Study members can view attendances" ON attendances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM study_members sm 
      WHERE sm.study_id = attendances.study_id 
      AND sm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage their own attendance" ON attendances;
CREATE POLICY "Users can manage their own attendance" ON attendances
  FOR ALL USING (auth.uid() = user_id);

-- announcements 테이블 정책
DROP POLICY IF EXISTS "Study members can view announcements" ON announcements;
CREATE POLICY "Study members can view announcements" ON announcements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM study_members sm 
      WHERE sm.study_id = announcements.study_id 
      AND sm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Study owners and admins can manage announcements" ON announcements;
CREATE POLICY "Study owners and admins can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM study_members sm 
      WHERE sm.study_id = announcements.study_id 
      AND sm.user_id = auth.uid()
      AND sm.role IN ('owner', 'admin')
    )
  );

-- 트리거 및 함수
-- 1. 스터디 생성 시 소유자를 멤버로 자동 추가
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO study_members (study_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_owner_as_member ON studies;
CREATE TRIGGER trigger_add_owner_as_member
  AFTER INSERT ON studies
  FOR EACH ROW
  EXECUTE FUNCTION add_owner_as_member();

-- 2. 출석률 계산 함수
CREATE OR REPLACE FUNCTION calculate_attendance_rate(
  p_user_id UUID,
  p_study_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  total_days INTEGER;
  attended_days INTEGER;
  join_date DATE;
BEGIN
  -- 참여 날짜 조회
  SELECT joined_at::DATE INTO join_date
  FROM study_members 
  WHERE user_id = p_user_id AND study_id = p_study_id;
  
  -- 참여일부터 오늘까지 총 일수
  total_days := CURRENT_DATE - join_date + 1;
  
  -- 실제 출석 일수
  SELECT COUNT(*) INTO attended_days
  FROM attendances 
  WHERE user_id = p_user_id AND study_id = p_study_id;
  
  -- 출석률 계산 (소수점 2자리)
  RETURN ROUND((attended_days::DECIMAL / total_days) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- 3. 초대 코드 생성 함수
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
