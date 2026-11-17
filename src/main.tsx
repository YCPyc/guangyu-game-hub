import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

// Anonymous usage analytics (see AGENTS.md → Analytics). Without the two variables, nothing is sent.
if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: '2026-08-30',
    // No screen recordings: they are heavy to upload from China and more than "anonymous usage stats".
    disable_session_recording: true,
  })
  posthog.register({ app: 'hub' })
} else if (import.meta.env.DEV) {
  console.warn('PostHog is off: set VITE_PUBLIC_POSTHOG_PROJECT_TOKEN and VITE_PUBLIC_POSTHOG_HOST in .env to send events.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <App />
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
)
