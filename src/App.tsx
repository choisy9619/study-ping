// 메인 앱 컴포넌트 (개발용 단순화 버전)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage, DashboardPage, NotFoundPage } from './pages'
import { ROUTES } from './constants'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 홈 라우트 */}
          <Route path={ROUTES.HOME} element={<DashboardPage />} />
          
          {/* 로그인 페이지 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          
          {/* 대시보드 페이지 */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          
          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
