---
name: health-check
description: Runs a pre-plan health check for this Next.js + Payload app — dependency CVE audit (pnpm audit), outdated package scan, ESLint, TypeScript type-check, and the Vitest integration suite. Use when the user asks to run health checks, before starting any implementation plan, after dependency changes, or when the user types /health-check.
---

# Health Check

## Quick start

```bash
bash .claude/skills/health-check/scripts/check.sh
```

Resolve every `✗` (failure) before proceeding. Discuss every `⚠` (warning) with the user.

## What the script checks

| # | Check | Tool | Blocks? |
|---|-------|------|---------|
| 1 | Dependency CVEs | `pnpm audit --audit-level=high` | Warn |
| 2 | Outdated packages | `pnpm outdated` | Warn only |
| 3 | Lint | `pnpm run lint` | Yes |
| 4 | Type-check | `pnpm exec tsc --noEmit` | Yes |
| 5 | Integration tests | `pnpm run test:int` (needs a reachable Mongo) | Yes |

## Acting on results

- **CVEs** — `high`/`critical` must be resolved or explicitly accepted by the user before work starts.
- **Outdated packages** — flag any package where `current` and `latest` differ by a major version. Report; do not auto-upgrade without approval.
- **Lint / type errors** — fix all errors before starting implementation. Never build on a broken baseline.
- **Integration tests** — a failure usually means the DB is unreachable; fix `.env` / start Mongo (`docker run -d -p 27017:27017 mongo:latest`) before assuming the code is broken.

## Dev server (manual check)

The script does not start `pnpm dev`. After dependency changes or new Next.js config, run it manually and watch the first 15s for Turbopack or missing-module errors.
