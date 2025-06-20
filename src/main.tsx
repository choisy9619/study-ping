import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { validateEnv, logEnvStatus } from './config/env';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';

// 개발용 헬퍼 함수들 로드
import('./utils/dev-helpers');

// Validate environment variables before starting the app
try {
  validateEnv();
  logEnvStatus();
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  // In production, you might want to show an error page instead
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
