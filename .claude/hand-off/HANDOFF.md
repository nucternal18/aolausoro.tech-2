# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-12-p3-3c.md`

## Standing context

**Phase 3 is complete. `portfolio.aolausoro.tech` is live on the new
Payload/Docker stack, and `feature/refactor-portfolio` is merged into
`main` (`2a02ac5`).** This is the terminal state of the multi-phase
Clerk/Prisma/Redux/inversify → Payload CMS migration that occupied this
project since Phase 2.

- **Phase 2 → P3.3b**: all complete, see the dated handoffs
  (`handoff-aolausoro-2026-09-{06..12}*.md`) for the full history — config
  replication, Payload backend + auth cutover, killing the old stack,
  legacy-data migration, media → DO Spaces, Sentry modernization.
- **P3.3c (production cutover)** — done. The host
  (`portfolio-webserver-vm-1`) turned out to be a **Proxmox VM on a
  home/office network already serving the site live via pm2** — not a fresh
  DigitalOcean droplet as earlier docs assumed (`docs/deployment-plan.md` has
  a correction note). Cutover required: Cloudflare Origin CA cert, a router
  port-forward fix (only 8080→80 existed, nothing for 443), a
  hostname-scoped Cloudflare Configuration Rule (Full-strict, **not** the
  zone default — other unrelated domains live on the same zone), a real
  `DATABASE_URL` fix (`mongodb+srv://` couldn't resolve inside this host's
  Docker networking — switched to the direct multi-host form), and a brief
  real-downtime pm2-stop→redeploy→pm2-delete sequence once it became clear
  the old and new app can't coexist on port 3000. Full blow-by-blow in the
  dated handoff.
- **Green + blocking in CI:** `tsc` 0, `next build` (standalone), `test:int`
  24/24, verified on `main` post-merge. `pnpm run lint` still ~19
  pre-existing errors, non-blocking (deployment-plan follow-up f).
- Push-to-`main` deploy trigger is **enabled and proven** — the merge push
  itself triggered and completed a successful `Deploy Production` run.

## Loose ends (none blocking, all optional cleanup)

- Confirm `ci.yml`'s first real `main` run went green (its very first
  invocation raced a `startup_failure` with zero jobs — likely a
  just-registered-workflow blip; check `gh run list --branch main`).
- Delete the `aolausoro` database (owner-run `mongosh ... dropDatabase()` —
  inert now, no rush) and the `portfolio_migration_dryrun` scratch DB.
- ~19 pre-existing lint errors (follow-up f) — unrelated to this migration.
- `setup-droplet.sh` hardening notes (follow-ups a/b) — only relevant to a
  _future_ fresh host.
- `feature/refactor-portfolio` branch — merged, not deleted; delete whenever.

## Where things live

- `docs/deployment-plan.md` — the living infra doc, now reflecting reality
  (Proxmox host, Cloudflare Configuration Rule scoping, all the P3.3c
  follow-ups g/h/i).
- SDD/execution ledgers under `.superpowers/sdd/` — gitignored, local only.
