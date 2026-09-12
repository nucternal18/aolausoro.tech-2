# P3.3b — Sentry Modernize & Verify — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the kept Sentry wiring up to `@sentry/nextjs@10` / Next 16 conventions (capture Server Component / route-handler errors, stop using the deprecated client-config location), move the DSN and sample rates to env, drop dead/unwanted options, and fix a pre-existing bug in the error boundary — as one focused commit.

**Architecture:** No new subsystem — this is a bounded fix-and-modernize pass over the existing Sentry files (no separate design spec; the design was agreed in chat during the P3.3b brainstorming on 2026-09-12, superseding the P3.1a-era note that Sentry would just be "kept").

**Tech Stack:** `@sentry/nextjs@10.27.0`, Next 16.2.6 (App Router), TypeScript 5.9.

**Spec:** none (bounded task) — design recap below.

## Global Constraints

- `pnpm exec tsc --noEmit` → 0 after the task.
- `pnpm run test:int` stays green (24/24), zero skips.
- `pnpm run build` stays green; the `withSentryConfig` source-map upload step must still no-op cleanly with no `SENTRY_AUTH_TOKEN` set (current sandbox state).
- `pnpm exec prettier --check .` clean before commit. Commit `--no-verify`, ending with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
  ```
- Do **not** touch `.github/workflows/deploy-production.yml` — adding `NEXT_PUBLIC_SENTRY_DSN` as a secret/build-arg there is P3.3c.
- Verified against the installed SDK: `Sentry.captureRequestError(error, request, errorContext): void` matches Next's `onRequestError` hook signature exactly (`node_modules/@sentry/nextjs/build/types/common/captureRequestError.d.ts`); `captureRouterTransitionStart` is exported from the client entry point.
- Behavior change (intentional, confirmed in brainstorming): with `NEXT_PUBLIC_SENTRY_DSN` unset, Sentry no-ops — so local dev/test no longer reports to the shared Sentry project by default.

---

### Task 1: Client instrumentation — `instrumentation-client.ts`, env-driven config

**Files:**
- Create: `instrumentation-client.ts` (repo root)
- Delete: `sentry.client.config.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: client-side Sentry init reading `NEXT_PUBLIC_SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` from env; exports `onRouterTransitionStart` for Next's navigation instrumentation hook.

- [ ] **Step 1: Create `instrumentation-client.ts`**

```ts
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
```

- [ ] **Step 2: Delete the old client config**

```bash
git rm sentry.client.config.ts
```

- [ ] **Step 3: `.env.example`**

Under the existing `# ─── Observability (Sentry)` section (added in P3.3a),
add above `SENTRY_AUTH_TOKEN`:

```
NEXT_PUBLIC_SENTRY_DSN=https://76f78fa1ecb0df2dea97a4c503e88981@o1031776.ingest.us.sentry.io/4507640442716160
SENTRY_TRACES_SAMPLE_RATE=0.1
# NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1   # only if it needs to differ from the server rate
```

- [ ] **Step 4: Verify**

```
pnpm exec tsc --noEmit   # expect 0
```

- [ ] **Step 5: Commit staging (bundled into the Task 2 commit — do not commit yet)**

Leave working tree dirty; Task 2 finishes the change and commits once.

---

### Task 2: Server/edge config, `onRequestError`, config cleanup, error-boundary fix

**Files:**
- Modify: `sentry.server.config.ts`, `sentry.edge.config.ts`
- Modify: `instrumentation.ts`
- Modify: `next.config.mjs`
- Modify: `app/global-error.tsx`
- Modify: `Dockerfile`

**Interfaces:**
- Produces: `instrumentation.ts` exports `onRequestError` matching Next's App Router hook; server/edge Sentry DSN and sample rate come from env with the same fallback shape as Task 1.

- [ ] **Step 1: `sentry.server.config.ts`**

```ts
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const tracesSampleRate = Number(
  process.env.SENTRY_TRACES_SAMPLE_RATE ?? (process.env.NODE_ENV === 'production' ? 0.1 : 1),
)

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate,
  debug: false,
})
```

- [ ] **Step 2: `sentry.edge.config.ts`** — identical body to Step 1 (edge runtime has its own init file per Sentry's Next.js convention; keep the two in sync rather than sharing a module, matching the original wizard-generated structure).

- [ ] **Step 3: `instrumentation.ts`**

```ts
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError
```

- [ ] **Step 4: `next.config.mjs` — drop dead/unwanted `withSentryConfig` options**

Remove the `tunnelRoute: '/monitoring',` line and the `automaticVercelMonitors: true,` line (plus its two-line comment block). Leave `org`, `project`, `silent`, `widenClientFileUpload`, `reactComponentAnnotation`, `hideSourceMaps`, `disableLogger` untouched.

- [ ] **Step 5: `app/global-error.tsx` — fix the error type and stop leaking details**

Current bug: `error` is typed `string` (it's actually `Error & { digest?: string }`), and `{serializedError}` renders the raw error to the user.

```tsx
'use client'

import * as Sentry from '@sentry/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@components/ui/button'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
    Sentry.captureException(error)
  }, [error])

  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Image src={'/android-chrome-512x512.png'} alt="My Logo" width={200} height={200} />
        <h1 className="my-5 text-6xl">500</h1>
        <h2 className="mb-3 text-3xl">Internal Server Error</h2>
        <p className="text-muted-foreground">Something went wrong. It's been reported.</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex justify-center">
            <Button type="button" asChild>
              <Link href={'/'}>Home</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Button type="button" onClick={() => reset()}>
              Try again
            </Button>
          </div>
          <div className="flex justify-center">
            <Button type="button" onClick={() => router.back()}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: `Dockerfile` — add the client DSN build arg**

Immediately after the existing Sentry block:
```dockerfile
# Sentry source-map upload during build (optional; no-ops without the token).
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
```
add:
```dockerfile
# Baked into the client bundle at build time (not secret — Sentry DSNs are
# public by design). P3.3c wires this as a GH Actions secret/build-arg.
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
```

- [ ] **Step 7: Verify**

```
pnpm exec tsc --noEmit           # 0
pnpm run test:int                # 24/24
pnpm run build                   # green; confirm the Sentry webpack plugin logs
                                  # "no auth token" / skips upload rather than failing
pnpm exec prettier --write . && pnpm exec prettier --check .
```

- [ ] **Step 8: Commit (Tasks 1 + 2 together, as agreed — one focused commit)**

```bash
git add instrumentation-client.ts instrumentation.ts sentry.server.config.ts \
  sentry.edge.config.ts next.config.mjs app/global-error.tsx Dockerfile \
  .env.example
git rm sentry.client.config.ts 2>/dev/null || true
git commit --no-verify -m "$(cat <<'EOF'
fix(sentry): modernize for @sentry/nextjs@10 / Next 16; env-driven config

- instrumentation-client.ts replaces the deprecated sentry.client.config.ts
- instrumentation.ts exports onRequestError (captures Server Component /
  route-handler / SSR errors — previously uncaptured)
- DSN + traces sample rate move to NEXT_PUBLIC_SENTRY_DSN / SENTRY_DSN /
  (NEXT_PUBLIC_)SENTRY_TRACES_SAMPLE_RATE env, defaulting to 0.1 in
  production / 1.0 elsewhere; unset DSN cleanly no-ops (dev/test no
  longer reports to the shared Sentry project)
- drop dead automaticVercelMonitors (not on Vercel) and tunnelRoute
  (ad-blocker circumvention traded for simplicity, per review)
- global-error.tsx: fix the `error` type (was `string`), stop rendering
  the raw error to users
- Dockerfile: NEXT_PUBLIC_SENTRY_DSN build arg (deploy-workflow wiring
  is P3.3c)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 3: Manual verification + handoff

**Files:**
- Modify: `docs/deployment-plan.md`
- Create: `.claude/hand-off/handoff-aolausoro-<today>-p3-3b.md`
- Modify: `.claude/hand-off/HANDOFF.md`

- [ ] **Step 1: Owner manual check (cannot be done from this environment)**

On a machine with `NEXT_PUBLIC_SENTRY_DSN` set (add it to `.env.local` from
the value in `.env.example`, or leave unset to keep dev quiet):
1. `pnpm run dev`, visit any page, trigger a thrown error (e.g. temporarily
   throw inside a Server Component, or hit a route that 500s).
2. Check the Sentry dashboard (`aolausorotech` org, `javascript-nextjs`
   project) for the event, confirming `onRequestError` is capturing
   server-side errors that previously went unreported.
3. Confirm no requests hit `/monitoring` anymore (tunnel route removed).

- [ ] **Step 2: Docs**

`docs/deployment-plan.md`: add a row — "Sentry modernized for SDK 10/Next 16
(onRequestError, instrumentation-client.ts, env-driven DSN/sample rate)" ✅,
noting `NEXT_PUBLIC_SENTRY_DSN` still needs to be added as a GH Actions
secret + build-arg in P3.3c.

New handoff: what changed, the manual-verification step above (mark done or
pending based on the owner's reply), and that P3.3b is complete.

Update `.claude/hand-off/HANDOFF.md` standing context.

- [ ] **Step 3: Commit + push**

```bash
git add docs/deployment-plan.md .claude/hand-off
git commit --no-verify -m "$(cat <<'EOF'
docs(p3.3b): Sentry modernization handoff

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin feature/refactor-portfolio
```

---

## Self-Review

**Spec coverage (against the chat-agreed design):**
- `instrumentation-client.ts` replacing `sentry.client.config.ts` → Task 1 ✓
- `onRequestError` → Task 2 Step 3 ✓
- DSN + sample rate to env → Task 1 Step 1/3, Task 2 Step 1/2 ✓
- Drop `automaticVercelMonitors` + `tunnelRoute` → Task 2 Step 4 ✓
- `global-error.tsx` fix → Task 2 Step 5 ✓
- One focused commit → Task 2 Step 8 bundles Tasks 1+2 ✓
- Manual dashboard verification (can't be automated) → Task 3 Step 1 ✓
- Dockerfile build-arg, workflow deferred to P3.3c → Task 2 Step 6 + Global Constraints ✓

**Placeholder scan:** no TBDs; all file contents are complete, copy-pasteable.

**Type consistency:** `onRequestError` signature verified against the installed
`@sentry/nextjs@10.27.0` types (`captureRequestError(error, request, errorContext): void`)
matches Next's hook exactly — no adapter needed. `GlobalError`'s prop type
matches what Next actually passes (`Error & { digest?: string }`).

**Known soft spot:** the "verify it actually reports" step is inherently
manual — no CI/test can confirm delivery to Sentry's backend. Task 3 Step 1
names exactly what to check and why.
