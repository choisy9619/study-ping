// 대시보드 페이지

import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui'
import { ROUTES } from '../constants'

export const DashboardPage: React.FC = () => {
  // 개발용 임시 사용자 데이터
  const user = { name: '개발자' }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                안녕하세요, {user?.name}님!
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                오늘도 열심히 공부해보세요 ✨
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to={ROUTES.STUDY_CREATE}>
                <Button>스터디 만들기</Button>
              </Link>
              <Link to={ROUTES.STUDY_JOIN}>
                <Button variant="secondary">스터디 참여</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 오늘의 출석 현황 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>오늘의 출석 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">참여 중인 스터디가 없습니다.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      스터디를 만들거나 참여해보세요!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 내 스터디 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>내 스터디</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      참여 중인 스터디가 없습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 출석 통계 */}
              <Card>
                <CardHeader>
                  <CardTitle>출석 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">이번 주</span>
                      <Badge variant="secondary">0/7</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">이번 달</span>
                      <Badge variant="secondary">0/30</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">연속 출석</span>
                      <Badge variant="secondary">0일</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 빠른 액션 */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 액션</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={ROUTES.STUDY_CREATE}>
                    <Button variant="ghost" fullWidth className="justify-start">
                      📚 새 스터디 만들기
                    </Button>
                  </Link>
                  <Link to={ROUTES.STUDY_JOIN}>
                    <Button variant="ghost" fullWidth className="justify-start">
                      🚀 스터디 참여하기
                    </Button>
                  </Link>
                  <Link to={ROUTES.MY_PAGE}>
                    <Button variant="ghost" fullWidth className="justify-start">
                      👤 마이페이지
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
