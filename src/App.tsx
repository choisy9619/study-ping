import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <img
            src={viteLogo}
            className="h-16 w-16 animate-spin hover:animate-bounce-soft"
            alt="Vite logo"
          />
          <img
            src={reactLogo}
            className="h-16 w-16 animate-spin hover:animate-bounce-soft"
            alt="React logo"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 mb-4">
          StudyPing
        </h1>
        
        <p className="text-center text-secondary-600 text-lg mb-8">
          스터디 출석 체크 및 커뮤니티 앱
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Count Card */}
          <div className="card mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-secondary-800">
              Tailwind CSS 테스트
            </h2>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary-600">
                {count}
              </span>
              <p className="text-secondary-600 mt-2">클릭 횟수</p>
            </div>
            
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="btn-primary w-full mb-4"
            >
              카운트 증가 ✨
            </button>
            
            <button 
              onClick={() => setCount(0)}
              className="btn-secondary w-full"
            >
              리셋
            </button>
          </div>

          {/* Features Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-secondary-800 mb-4">
              주요 기능 미리보기
            </h3>
            
            {/* Attendance Button Demo */}
            <div className="card">
              <h4 className="font-medium text-secondary-800 mb-3">출석 체크</h4>
              <button className="btn-attendance w-full">
                오늘 출석하기 📚
              </button>
            </div>

            {/* Status Demo */}
            <div className="card">
              <h4 className="font-medium text-secondary-800 mb-3">출석 현황</h4>
              <div className="flex space-x-2">
                <span className="attendance-status present">출석</span>
                <span className="attendance-status absent">결석</span>
              </div>
            </div>

            {/* Study Card Demo */}
            <div className="study-card">
              <h4 className="font-medium text-secondary-800 mb-2">
                AI 스터디 📖
              </h4>
              <p className="text-secondary-600 text-sm mb-3">
                매일 AI 공부하는 스터디입니다.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary-500">5명 참여중</span>
                <span className="text-xs text-success-600 font-medium">85% 출석률</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation Demo */}
      <nav className="mobile-nav">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-1 text-secondary-600">
            <span className="text-lg">🏠</span>
            <span className="text-xs">홈</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-primary-600">
            <span className="text-lg">📚</span>
            <span className="text-xs">스터디</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-secondary-600">
            <span className="text-lg">📊</span>
            <span className="text-xs">통계</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-secondary-600">
            <span className="text-lg">👤</span>
            <span className="text-xs">마이</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
