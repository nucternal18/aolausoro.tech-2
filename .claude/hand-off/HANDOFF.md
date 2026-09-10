# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-10.md`

## Standing context

- **Phase 2 (project-config replication) is complete and pushed.** Branch
  `feature/refactor-portfolio` on `origin`. Not yet merged to `main`. Plan/spec
  under `docs/superpowers/{plans,specs}/2026-09-06-equilibrium-config-replication*`.
- **P3.1a (Payload backend + admin + full Clerk→Payload auth cutover)** is
  implemented and verified — `test:int` 12/12 green against Atlas. Commits
  `b8e64f3..92a89c7`.
- **P3.2 ("Payload-only site — kill the old stack") is complete.** Commits
  `7dc0289..HEAD`. The old `src/`/`prisma/`/`admin-route-components/` stack is
  deleted, the public site runs on Payload's local API, the Payload blog
  frontend + `/search` are built, ~65 dead deps pruned.
- **Build/typecheck/tests are green and blocking in CI.** `tsc --noEmit` 0,
  `pnpm run build` produces `.next/standalone`, `test:int` 15/15, prettier
  clean. `pnpm run lint` has 19 pre-existing (non-P3.2) errors and stays
  `continue-on-error` — see follow-up f in `docs/deployment-plan.md`.
- **Homepage is `force-dynamic`** — it reads live CMS data; build stays
  DB-independent. See the dated handoff for why (`.env.local` points at the
  un-migrated Prisma db during build).
- **Next: P3.2b** (data migration `aolausoro` db → `portfolio` db,
  Prisma-shaped → Payload-shaped) and **P3.3** (Cloudinary→DO Spaces + SSRF
  fix, Sentry decision, provision deploy infra, enable
  `deploy-production.yml`). Neither has a spec/plan yet.
- `.env` `DATABASE_URL` db name is `portfolio`; old Prisma data untouched in
  the `aolausoro` db name (P3.2b migration source). 6 dummy test users need
  cleaning out of `portfolio` (command in the dated handoff).
- Deploy infra (droplet, Atlas, Cloudflare, runner, secrets) still
  unprovisioned; `deploy-production.yml` is `workflow_dispatch`-only.
  `docs/deployment-plan.md` tracks it (follow-ups a–f).
- SDD execution ledgers live under `.superpowers/sdd/` — gitignored, local only.
