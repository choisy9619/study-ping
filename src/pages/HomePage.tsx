// 홈페이지 - 비로그인 사용자도 접근 가능

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';
import { useAuth } from '../hooks';
import { ROUTES } from '../constants';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Mock 데이터 - 추후 실제 API 연동
  const featuredStudies = [
    {
      id: '1',
      title: 'React 심화 스터디',
      description: 'React와 TypeScript를 활용한 실무 프로젝트 개발',
      memberCount: 8,
      maxMembers: 10,
      status: 'recruiting',
      tags: ['React', 'TypeScript', 'Frontend'],
      startDate: '2024-07-01',
    },
    {
      id: '2',
      title: '알고리즘 코딩테스트 대비',
      description: '매일 문제 풀이와 주간 모의고사로 실력 향상',
      memberCount: 12,
      maxMembers: 15,
      status: 'ongoing',
      tags: ['Algorithm', 'Python', 'CodingTest'],
      startDate: '2024-06-15',
    },
    {
      id: '3',
      title: 'Node.js 백엔드 스터디',
      description: 'Express와 MongoDB를 활용한 RESTful API 개발',
      memberCount: 6,
      maxMembers: 8,
      status: 'recruiting',
      tags: ['Node.js', 'Backend', 'MongoDB'],
      startDate: '2024-07-10',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recruiting':
        return <Badge variant="success">모집중</Badge>;
      case 'ongoing':
        return <Badge variant="primary">진행중</Badge>;
      case 'completed':
        return <Badge variant="secondary">완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">출석체크잇</h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">안녕하세요, {user?.name}님!</span>
                  <Link to={ROUTES.DASHBOARD}>
                    <Button variant="primary">대시보드</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="outline">로그인</Button>
                  </Link>
                  <Link to={ROUTES.SIGNUP}>
                    <Button variant="primary">회원가입</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">함께 성장하는 스터디 플랫폼</h2>
          <p className="text-xl text-gray-600 mb-8">체계적인 출석 관리와 활발한 커뮤니티로 학습 목표를 달성하세요</p>
        </div>

        {/* 진행중/모집중 스터디 */}
        <section className="mb-16">
          <div className="flex justify-center items-center mb-8 ">
            <h3 className="text-2xl font-bold text-gray-900">진행중인 스터디</h3>
            {isAuthenticated && (
              <Link to={ROUTES.STUDIES}>
                <Button variant="outline">전체 보기</Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudies.map(study => (
              <Card
                key={study.id}
                padding="lg"
                className="hover:shadow-lg transition-shadow flex flex-col justify-evenly"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{study.title}</h4>
                  {getStatusBadge(study.status)}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{study.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {study.tags.map(tag => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    참여인원: {study.memberCount}/{study.maxMembers}명
                  </span>
                  <span className="text-sm text-gray-500">시작일: {study.startDate}</span>
                </div>

                <div className="flex space-x-2">
                  {isAuthenticated ? (
                    <>
                      <Button variant="primary" size="sm" fullWidth>
                        참여하기
                      </Button>
                      <Button variant="outline" size="sm">
                        자세히
                      </Button>
                    </>
                  ) : (
                    <Link to={ROUTES.LOGIN} className="w-full">
                      <Button variant="primary" size="sm" fullWidth>
                        로그인 후 참여
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 특징 소개 */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">왜 출석체크잇인가?</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">체계적인 출석 관리</h4>
              <p className="text-gray-600">
                실시간 출석 체크와 통계로 학습 패턴을 분석하고 꾸준한 참여를 도와드립니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">활발한 커뮤니티</h4>
              <p className="text-gray-600">
                스터디원들과 자유롭게 소통하며 서로의 성장을 응원하는 건강한 학습 환경을 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">목표 달성 지원</h4>
              <p className="text-gray-600">
                개인별 학습 목표 설정부터 달성까지, 체계적인 프로세스로 성공적인 학습을 지원합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">출석체크잇</h3>
            <p className="text-gray-400 mb-4">함께 성장하는 스터디 플랫폼</p>
            <p className="text-gray-500 text-sm">© 2024 출석체크잇. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
