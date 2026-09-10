# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-10-p3-2b.md`

## Standing context

- **Phase 2 (project-config replication)** — complete, pushed. Not merged to
  `main`. Plan/spec under
  `docs/superpowers/{plans,specs}/2026-09-06-equilibrium-config-replication*`.
- **P3.1a (Payload backend + admin + Clerk→Payload auth cutover)** — done,
  verified (`test:int` green against Atlas). Commits `b8e64f3..92a89c7`.
- **P3.2 (Payload-only site — kill the old stack)** — done. Old
  `src/`/`prisma/`/`admin-route-components/` deleted, public site on Payload's
  local API, blog frontend + `/search` built, ~65 dead deps pruned. Commits
  `7dc0289..783cde1`.
- **P3.2b (legacy data migration)** — **done**. `aolausoro` db content reshaped
  into `portfolio` (2 users / 7 projects / 6 jobs / 12 wiki / 2 cvs / 5
  messages), admin logins seeded, junk users cleaned. Binaries still Cloudinary
  text URLs. Commits `44c3866..HEAD`. See the dated handoff for temp passwords
  and loose ends.
- **Green + blocking in CI:** `tsc` 0, `next build` (standalone), `test:int`
  19/19. `pnpm run lint` still has ~19 pre-existing errors, non-blocking
  (deployment-plan follow-up f).
- **Homepage is `force-dynamic`** — reads live CMS data; build stays
  DB-independent.
- `.env` + `.env.local` `DATABASE_URL` now both point at `portfolio`;
  `LEGACY_DATABASE_URL` (the `aolausoro` string) is the migration source.
- **Next: P3.3** — Cloudinary → DO Spaces (the URLs now stored as text),
  restore `upload` fields for wiki/CVs, drop `legacyId` fields, delete the
  `aolausoro` db, Sentry keep/drop, provision deploy infra + enable
  `deploy-production.yml`. `docs/deployment-plan.md` follow-ups a–f.
- SDD/execution ledgers under `.superpowers/sdd/` — gitignored, local only.
