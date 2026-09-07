# Agent instructions

Payload CMS + Next.js (App Router) portfolio site. MongoDB. Package manager is `pnpm`.
Orientation document for AI agents picking up work in this repository.
Read `CLAUDE.md` for the skills index and `CONTEXT.md` for domain vocabulary before starting any task.

## Migration in progress

This repo is mid-migration from a Clerk + Prisma + Redux + inversify-DI stack
onto Payload CMS. It is **not** finished. Clerk, Prisma, Redux, inversify,
Sentry, and Cloudinary are all still installed and still imported — do not
assume any of them are gone.

- **Phase 2** (tooling + config replication from the `equilibrium` sibling
  project) is complete.
- **Phase 3** (dependency prune + finishing the Payload migration) is scoped
  but not started.

Read `docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`
(§ Phase 3 — Dependency prune) and its plan
`docs/superpowers/plans/2026-09-06-equilibrium-config-replication.md`, then
`docs/payload-cms-integration.md`, before touching migration-related code.

Known broken until Phase 3 lands a green baseline (do not "fix" as a side quest):

- `pnpm run lint` exits 1 (ESLint errors from legacy code).
- `pnpm exec tsc --noEmit` reports pre-existing errors.
- `pnpm run build` fails at a Clerk async-Server-Actions + Prisma-6 wasm
  resolution point.
- `payload.config.ts` does not fully load — `Posts` declares a relationship to
  an unregistered `categories` collection.

## Handoff Protocol

At the end of every session, update the handoff document at
`.claude/hand-off/handoff-aolausoro-<YYYY-MM-DD>.md` (today's date). If today's
file exists, update it in place; otherwise create it — previous files stay for
history. `.claude/hand-off/HANDOFF.md` holds the current session-to-session state
and points at the latest dated file.

The handoff must cover: what changed this session (files, decisions); key design
decisions and why; pre-existing known issues relevant to active work; next steps
not completed; a "Suggested Skills" section listing `/skills` the next agent
should invoke.

Do not duplicate content already in committed files, docs, or plans — reference
them by path. Redact all secrets, keys, and PII.

## Commands

These match `package.json` scripts as of Phase 2:

- `pnpm dev` — local dev server (needs a reachable Mongo; `docker compose up -d mongo`)
- `pnpm run build` — production build (Payload connects to `DATABASE_URL` during static generation — a reachable Mongo is required, not optional)
- `pnpm start` — serve the production build
- `pnpm run lint` / `pnpm run lint:fix` — ESLint (flat config, `eslint.config.mjs`)
- `pnpm exec tsc --noEmit` — type-check
- `pnpm run test:int` — Vitest integration tests (needs a real reachable Mongo)
- `pnpm run test:e2e` — Playwright e2e tests (spins up its own dev server)
- `pnpm test` — runs `test:int` then `test:e2e`
- `pnpm run generate` — `prisma generate` (legacy; removed in Phase 3)
- `pnpm run generate:types` — regenerate `payload-types.ts` (Payload CLI)
- `pnpm run generate:importmap` — regenerate the admin `importMap.js` (Payload CLI)
- `pnpm run payload <cmd>` — run an arbitrary Payload CLI command

## Deployment

Production only — `portfolio.aolausoro.tech`, deployed off `main` by
`.github/workflows/deploy-production.yml` (Docker image → GHCR → self-hosted
runner on a DigitalOcean droplet + Nginx). The push-to-`main` trigger is
currently commented out (`workflow_dispatch` only) pending infra provisioning.
Read `docs/deployment-plan.md` before touching `deploy/`, `.github/workflows/`,
`Dockerfile`, or `next.config.mjs`. There is no staging environment.

## Conventions

- Env vars are documented in `.env.example`; nothing outside it should be assumed at runtime.
- `.env`, `.env.local`, `.env.*.local` are gitignored — never commit real secrets into any `.env*` file.
- Secrets for production live only in the `.env` on the droplet, written from GitHub Actions secrets on each deploy.
- Use the vocabulary in `CONTEXT.md` for domain concepts; read `docs/agents/domain.md` for how domain docs and `docs/adr/` are consumed.
- Engineering issues are GitHub Issues on `nucternal18/aolausoro.tech-2` via the `gh` CLI — see `docs/agents/issue-tracker.md`.

## Skills

This project ships skills under `.claude/skills/` (see `CLAUDE.md` for the index):

- `.claude/skills/payload/SKILL.md` — Payload CMS work (collections, fields, hooks, access control, queries).
- `.claude/skills/cms-migration/SKILL.md` — importing content from another CMS.
- `.claude/skills/health-check/SKILL.md` — pre-plan health check; run before starting any implementation plan.
