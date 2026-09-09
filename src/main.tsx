import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BlogProvider } from './context/BlogContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BlogProvider>
        <App />
      </BlogProvider>
    </ErrorBoundary>
  </StrictMode>,
);
