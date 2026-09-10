# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-11-p3-3a.md`

## Standing context

- **Phase 2 (project-config replication)** — complete, pushed. Not merged to
  `main`. Plan/spec under
  `docs/superpowers/{plans,specs}/2026-09-06-equilibrium-config-replication*`.
- **P3.1a (Payload backend + admin + Clerk→Payload auth cutover)** — done,
  verified. Commits `b8e64f3..92a89c7`.
- **P3.2 (Payload-only site — kill the old stack)** — done. Commits
  `7dc0289..783cde1`.
- **P3.2b (legacy data migration)** — done. `aolausoro` content reshaped into
  `portfolio` (2 users / 7 projects / 6 jobs / 12 wiki / 2 cvs / 5 messages),
  admin logins seeded. Commits `44c3866..df3816e`.
- **P3.3a (Media → DO Spaces + Cloudinary teardown)** — done. `s3Storage` for
  `media`+`cvs` (bucket `aolausorotech`, `lon1`, CDN); 21 Cloudinary assets
  migrated (19 media docs + 2 CV PDFs); `Wiki.image` / `Projects.screenshot`
  (upload) replace the old text fields; `cloudinary` dep + `lib/cloudinary.ts`
  - `lib/env.ts` removed. Commits `e4a20d0..HEAD`. See the dated handoff.
- **Green + blocking in CI:** `tsc` 0, `next build` (standalone), `test:int`
  24/24. `pnpm run lint` still ~19 pre-existing errors, non-blocking
  (deployment-plan follow-up f).
- **Homepage is `force-dynamic`** — reads live CMS data; build stays
  DB-independent. All media serves from the Spaces CDN.
- `.env` + `.env.local` `DATABASE_URL` → `portfolio`; `LEGACY_DATABASE_URL` →
  `aolausoro` (P3.2b source); full `DO_SPACES_*` block in both.
- **Next: P3.3b** (Sentry — decision: _keep_; verify wiring) then **P3.3c**
  (deploy infra: droplet/Cloudflare/runner/secrets via an owner runbook;
  enable `deploy-production.yml`; strip Clerk+Cloudinary vars from the workflow
  - `Dockerfile`; drop `legacyId` fields; delete the `aolausoro` db; harden
    `setup-droplet.sh`). `docs/deployment-plan.md` follow-ups a–f.
- SDD/execution ledgers under `.superpowers/sdd/` — gitignored, local only.
