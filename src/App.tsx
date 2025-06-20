// 메인 앱 컴포넌트

import { useEffect } from 'react';
import { AppRouter } from './router';
import { setupAuthListener } from './utils/supabase-test';
import './App.css';

function App() {
  useEffect(() => {
    // Auth 리스너 설정
    const unsubscribe = setupAuthListener();

    // 컴포넌트 언마운트 시 정리
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
