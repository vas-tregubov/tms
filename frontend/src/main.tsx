import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'
import App from '@/app/App'
import ErrorBoundary from '@/app/error-boundary/ErrorBoundary'
import ErrorFallback from '@/app/error-boundary/ErrorFallback'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
