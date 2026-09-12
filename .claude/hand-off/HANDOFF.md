# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-12-p3-3b.md`

## Standing context

- **Phase 2 (project-config replication)** — complete, pushed. Not merged to
  `main`. Plan/spec under
  `docs/superpowers/{plans,specs}/2026-09-06-equilibrium-config-replication*`.
- **P3.1a (Payload backend + admin + Clerk→Payload auth cutover)** — done,
  verified. Commits `b8e64f3..92a89c7`.
- **P3.2 (Payload-only site — kill the old stack)** — done. Commits
  `7dc0289..783cde1`.
- **P3.2b (legacy data migration)** — done. `aolausoro` content reshaped into
  `portfolio`. Commits `44c3866..df3816e`.
- **P3.3a (Media → DO Spaces + Cloudinary teardown)** — done. Commits
  `e4a20d0..cefd456`.
- **P3.3b (Sentry modernize)** — done. `instrumentation.ts` now exports
  `onRequestError` (Server Component / route-handler / SSR errors are
  actually captured now — they weren't before), client config moved to
  `instrumentation-client.ts`, DSN/sample-rate are env-driven, dropped
  `automaticVercelMonitors` + `/monitoring` tunnel route, fixed a
  `global-error.tsx` type bug. Commit `6cf57a8`. **Owner still needs to**:
  trigger a test server-side error and confirm it reaches the Sentry
  dashboard (can't be verified from this environment) — see the dated
  handoff.
- **Green + blocking in CI:** `tsc` 0, `next build` (standalone), `test:int`
  24/24. `pnpm run lint` still ~19 pre-existing errors, non-blocking
  (deployment-plan follow-up f).
- `.env` + `.env.local`: `DATABASE_URL` → `portfolio`; `LEGACY_DATABASE_URL` →
  `aolausoro`; full `DO_SPACES_*` block; add `NEXT_PUBLIC_SENTRY_DSN` if you
  want dev-time Sentry reporting (optional — unset is fine, no-ops cleanly).
- **Next: P3.3c** — provision droplet / Cloudflare cert+DNS / self-hosted
  runner / GH secrets (owner does this against a runbook to be written);
  enable `deploy-production.yml`'s push-to-`main` trigger; add
  `NEXT_PUBLIC_SENTRY_DSN` as a secret/build-arg there; strip Clerk +
  Cloudinary vars from the workflow + `Dockerfile`; drop `legacyId` fields;
  delete the `aolausoro` db; harden `setup-droplet.sh` (follow-ups a/b).
  `docs/deployment-plan.md` tracks it all.
- SDD/execution ledgers under `.superpowers/sdd/` — gitignored, local only.
