# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-07.md`

## Standing context

- The Payload CMS migration (off Clerk / Prisma / Redux / inversify) is **in
  progress and unfinished**. Phase 2 (project-config replication from the
  `equilibrium` sibling project) is complete; Phase 3 (dependency prune +
  finishing the migration) is scoped but not started — see
  `docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`
  and `docs/superpowers/plans/2026-09-06-equilibrium-config-replication.md`.
- `pnpm run lint`, `pnpm exec tsc --noEmit`, and `pnpm run build` all fail on
  pre-existing legacy-code errors. This is expected Phase 3 work — see
  `AGENT.md` § Migration in progress.
- Deployment infra (droplet, Atlas, Cloudflare, self-hosted runner, GH Actions
  secrets) is not yet provisioned, and `deploy-production.yml` is
  `workflow_dispatch`-only. `docs/deployment-plan.md` tracks status.
