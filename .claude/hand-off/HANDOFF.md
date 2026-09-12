# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-12-p3-3c.md`

## Standing context

**Phase 3 is complete. `portfolio.aolausoro.tech` is live on the new
Payload/Docker stack, `feature/refactor-portfolio` is merged into `main`
and deleted, and the ~19 pre-existing lint errors are fixed with Lint now
blocking in CI.** This is the terminal state of the multi-phase
Clerk/Prisma/Redux/inversify → Payload CMS migration that occupied this
project since Phase 2 — the repo is fully clean.

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
- **`ci.yml`'s first two runs on `main` hit `startup_failure`** (zero jobs) —
  root cause: the repo's Actions policy allows only GitHub-owned actions
  (`allowed_actions: selected`, `verified_allowed: false`), and `ci.yml` used
  `pnpm/action-setup@v4`, which isn't GitHub-owned. Fixed by activating pnpm
  via `corepack enable` instead (no marketplace action needed).
- **All ~19 pre-existing lint errors fixed** (commit `462fd3d`) — compound
  components in `nav-components.tsx` rewritten as named functions, a random
  skeleton width moved from `useMemo` to a lazy `useState` initializer, a
  redundant setState-in-effect removed from the Theme provider (the value
  was already resolved pre-hydration by `InitTheme`'s inline script), a
  targeted `eslint-disable` on `Card/index.tsx`'s two refs (the rule can't
  trace a ref through a custom hook's return shape; React Compiler itself is
  off, so this is lint-only), `tailwind.config.js`'s `require()` → `import`.
  `continue-on-error` dropped from `ci.yml`'s Lint step — all four checks
  (Lint/Type-check/Integration tests/Build) are now blocking.
- **`feature/refactor-portfolio` branch deleted** (local + remote) — fully
  absorbed into `main`, zero unique commits, safe.
- **Green + blocking in CI, all four checks:** `pnpm run lint` (0 errors),
  `tsc` (0), `test:int` (24/24), `next build` (standalone) — all verified
  passing on GitHub Actions against `main`, not just locally.
- Push-to-`main` deploy trigger is **enabled and proven** — three separate
  pushes to `main` this session each triggered and completed a successful
  `Deploy Production` run.

## Loose ends (none blocking, genuinely optional)

- Delete the `aolausoro` database (owner-run `mongosh ... dropDatabase()` —
  inert now, no rush) and the `portfolio_migration_dryrun` scratch DB. MCP
  `drop-database` is denied in this session — can't be done from here.
- `setup-droplet.sh` hardening notes (deployment-plan.md follow-ups a/b) —
  only relevant to a _future_ fresh host, not this already-configured one.
- Other stale branches on the remote (`add-mongodb`, `feature/server-actions`,
  `testing`) predate this session's work and weren't touched — not part of
  this migration's scope.

## Where things live

- `docs/deployment-plan.md` — the living infra doc, fully current (Proxmox
  host, Cloudflare Configuration Rule scoping, follow-ups a–i, all resolved
  except a/b which are fresh-host-only).
- SDD/execution ledgers under `.superpowers/sdd/` — gitignored, local only.
