// Client-side Sentry init. Next.js auto-loads this file (the successor to
// the deprecated sentry.client.config.ts location).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const tracesSampleRate = Number(
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ??
    (process.env.NODE_ENV === 'production' ? 0.1 : 1),
)

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
