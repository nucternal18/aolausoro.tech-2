# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-08.md`

## Standing context

- **Phase 2 (project-config replication) is complete and pushed.** Branch
  `feature/refactor-portfolio` on `origin`. Not yet merged to `main` — hold
  until Phase 3 lands a green build. Plan/spec under
  `docs/superpowers/{plans,specs}/2026-09-06-equilibrium-config-replication*`.
- **Phase 3 is decomposed into P3.1a / P3.1b / P3.2 / P3.3** (see the latest
  dated handoff). **P3.1a is implemented** (Payload backend + admin + full
  Clerk→Payload auth cutover, `payload-totp` enforced, `beforeDashboard` stat
  panel) — commits `b8e64f3..92a89c7`. Its DB-dependent verification
  (`pnpm run test:int`, manual `/admin`) has NOT been run — this environment
  can't reach Atlas. **First task: run that verification against Atlas.**
- P3.1b (frontend port + data migration), P3.2 (delete the old stack), P3.3
  (storage + Sentry + deploy) are scoped in the handoff but have no spec/plan.
- `pnpm run generate:types` succeeds (config loads); `tsc --noEmit` is 148
  (down from 154); `pnpm run build` is still red on pre-existing Prisma-6
  wasm resolution in P3.2-owned code — no regression from P3.1a.
- `.env` `DATABASE_URL` db name is now `portfolio` (fresh Payload db); the old
  Prisma data is untouched in the `aolausoro` db name (P3.1b migration source).
- Deploy infra (droplet, Atlas, Cloudflare, runner, secrets) still unprovisioned;
  `deploy-production.yml` is `workflow_dispatch`-only; CI's lint/typecheck/build/
  prisma steps are `continue-on-error`. `docs/deployment-plan.md` tracks it.
- The Phase-2 SDD execution ledger is at
  `.superpowers/sdd/2026-09-06-equilibrium-config-replication/` — gitignored,
  local only.
