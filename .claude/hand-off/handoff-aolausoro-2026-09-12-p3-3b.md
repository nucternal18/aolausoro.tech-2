# Handoff — 2026-09-12 — P3.3b: Sentry modernized

Branch: `feature/refactor-portfolio` (origin). Not merged to `main`.
Previous handoff: `handoff-aolausoro-2026-09-11-p3-3a.md`.

Plan: `docs/superpowers/plans/2026-09-12-p3-3b-sentry-modernize.md` (bounded
task — brainstormed in chat, no separate spec file). Commit: `6cf57a8`.

## What changed

- **`instrumentation-client.ts`** (new) replaces the deprecated
  `sentry.client.config.ts`. DSN and traces sample rate now come from
  `NEXT_PUBLIC_SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`, default
  0.1 in production / 1.0 elsewhere. Exports `onRouterTransitionStart` for
  Next's navigation instrumentation.
- **`instrumentation.ts`** now exports `onRequestError = Sentry.captureRequestError`
  — this is the real fix. Before, errors thrown in Server Components, route
  handlers, or during SSR were **not** reaching Sentry at all; only
  `global-error.tsx` (client-boundary) and explicit `captureException` calls
  were captured.
- **`sentry.server.config.ts` / `sentry.edge.config.ts`** — same env-driven
  DSN/rate pattern (`SENTRY_DSN` ?? `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`).
- **`next.config.mjs`** — dropped `automaticVercelMonitors` (dead, not on
  Vercel) and `tunnelRoute: '/monitoring'` (traded ad-blocker circumvention
  for simplicity — no more `/monitoring` proxy route or its server cost).
- **`app/global-error.tsx`** — fixed a pre-existing bug: `error` was typed
  `string` (it's actually `Error & { digest?: string }`), and the raw
  serialized error was rendered to users. Now shows a generic message.
- **`Dockerfile`** — added `ARG`/`ENV NEXT_PUBLIC_SENTRY_DSN` next to the
  existing `SENTRY_AUTH_TOKEN`, since it must be baked into the client bundle
  at build time.
- **`.env.example`** — documents `NEXT_PUBLIC_SENTRY_DSN` (current DSN as the
  example value — Sentry DSNs are not secret) and `SENTRY_TRACES_SAMPLE_RATE`.

**Behavior change:** with no `NEXT_PUBLIC_SENTRY_DSN` set, Sentry cleanly
no-ops. Local dev/test no longer reports to the shared Sentry project unless
you opt in by setting the DSN in `.env.local`.

## Verified here

`tsc` 0 · `test:int` 24/24 · `build` green (standalone + sitemap; no
Sentry-related build errors — source-map upload silently no-ops without
`SENTRY_AUTH_TOKEN`, as before) · `prettier` clean.

## Still needed from you (can't be done from this environment)

1. Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local` (value in `.env.example`) if
   you want dev-time error reporting; leave unset to keep dev quiet.
2. `pnpm run dev`, trigger a thrown error somewhere server-side (a Server
   Component or route handler), and confirm it now shows up in the
   `aolausorotech` / `javascript-nextjs` Sentry project — this is the
   `onRequestError` fix actually working.
3. Confirm no requests hit `/monitoring` anymore (removed).

## Still open (P3.3c)

- Add `NEXT_PUBLIC_SENTRY_DSN` as a GH Actions secret + build-arg in
  `deploy-production.yml` (alongside the existing `SENTRY_AUTH_TOKEN` wiring).
- Everything else from prior handoffs: provision droplet/Cloudflare/runner/
  secrets, enable the push-to-`main` trigger, strip Clerk+Cloudinary vars from
  the workflow + `Dockerfile`, drop `legacyId` fields, delete `aolausoro`.
