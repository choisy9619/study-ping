import { Button, Badge, Card, Layout } from '../components';
import { useNavigate, useAuthStatus } from '../hooks';

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

export function HomePage() {
  const { goTo } = useNavigate();
  const { data: authStatus } = useAuthStatus();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">함께 성장하는 스터디 플랫폼</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            출석 체크부터 커뮤니티까지, <br />
            스터디 그룹원들과 함께 꾸준한 학습 습관을 만들어보세요
          </p>
        </header>

        {/* 기능 소개 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-6">✅</div>
            <h3 className="text-xl font-semibold mb-4">출석 체크</h3>
            <p className="text-gray-600">매일 간편하게 출석을 체크하고 꾸준한 학습 습관을 만들어보세요</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-6">💬</div>
            <h3 className="text-xl font-semibold mb-4">실시간 소통</h3>
            <p className="text-gray-600">출석한 멤버들과 오늘의 한마디를 나누며 서로 동기부여하세요</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-6">📈</div>
            <h3 className="text-xl font-semibold mb-4">출석 통계</h3>
            <p className="text-gray-600">개인별 출석률과 스터디 참여 현황을 한눈에 확인하세요</p>
          </div>
        </div>

        {/* 추천 스터디 섹션 */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 인기 스터디</h2>
            <p className="text-lg text-gray-600">지금 가장 활발한 스터디들을 만나보세요</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudies.map(study => {
              const progressPercentage = Math.round((study.memberCount / study.maxMembers) * 100);

              return (
                <Card key={study.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-6">
                    {/* 상태 뱃지 */}
                    <div className="flex justify-between items-start mb-3">
                      {getStatusBadge(study.status)}
                      <span className="text-sm text-gray-500">
                        {study.memberCount}/{study.maxMembers}명
                      </span>
                    </div>

                    {/* 스터디 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{study.title}</h3>

                    {/* 스터디 설명 */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{study.description}</p>

                    {/* 태그들 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 시작일과 진행률 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>시작일: {study.startDate}</span>
                        <span className="font-medium text-blue-600">참여율 : {progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* 참여 버튼 */}
                    <div className="flex gap-2">
                      {authStatus?.user ? (
                        <>
                          <Button variant="primary" size="sm" className="flex-1">
                            참여하기
                          </Button>
                          <Button variant="outline" size="sm">
                            자세히
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => goTo('/login')} variant="primary" size="sm" className="w-full">
                          로그인 후 참여
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
