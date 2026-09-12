# Claude Code

Payload CMS + Next.js (App Router) portfolio site. MongoDB. Package manager is `pnpm`.
`AGENT.md` is the full orientation doc — read it first. This file is the index.

**Migration in progress:** Clerk + Prisma + Redux + inversify → Payload CMS,
**not finished**. Legacy deps (Clerk, Prisma, Redux, inversify, Sentry,
Cloudinary) are still installed and imported. Phase 2 (config replication) is
done; Phase 3 (prune + finish) is scoped only. See
`docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`,
`docs/superpowers/plans/2026-09-06-equilibrium-config-replication.md`, and
`docs/payload-cms-integration.md`.

`pnpm run lint`, `pnpm exec tsc --noEmit`, and `pnpm run build` all currently
fail on pre-existing legacy-code errors — that is Phase 3 work, not a regression
to chase. `AGENT.md` § Migration in progress has the detail.

## Commands

See `AGENT.md` § Commands.

## Handoff Protocol

At the end of every session, update
`.claude/hand-off/handoff-aolausoro-<YYYY-MM-DD>.md` (contents spec'd in
`AGENT.md` § Handoff Protocol). `.claude/hand-off/HANDOFF.md` holds the current
session-to-session state.

## Deployment

Production only (`portfolio.aolausoro.tech`), off `main` — trigger is
`workflow_dispatch` only until infra is provisioned. Read
`docs/deployment-plan.md` before changing `deploy/`, `.github/workflows/`,
`Dockerfile`, or `next.config.mjs`. No staging environment.

## Agent skills

### Payload CMS

Start at `.claude/skills/payload/SKILL.md`, then `.claude/skills/payload/reference/`
for detail. Use for `payload.config.ts`, collections, fields, hooks, access
control, and Payload API / query work.

### CMS migration

`.claude/skills/cms-migration/SKILL.md` — importing content from another CMS.

### Health check

`/health-check` or `bash .claude/skills/health-check/scripts/check.sh` before
starting any implementation plan.

### Issue tracker

Engineering issues live as GitHub Issues on `nucternal18/aolausoro.tech-2`,
managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

`CONTEXT.md` + `docs/adr/` at the repo root, grown lazily by `/domain-modeling`.
See `docs/agents/domain.md`.
