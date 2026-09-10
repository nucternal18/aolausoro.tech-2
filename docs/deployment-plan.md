# Deployment Plan — aolausoro.tech

**Scope:** Production only — `portfolio.aolausoro.tech`. No staging environment.
**Status:** Pipeline landed and inert; infrastructure provisioning pending.
The Payload migration has landed a green baseline — `tsc`, `next build`
(standalone) and `test:int` all pass and are blocking in CI. `pnpm run lint`
remains non-blocking against ~19 pre-existing eslint errors (see follow-up f).

## Overview

Moves the site off its old deploy — `.github/workflows/node.js.yml` ran
`pnpm build` then `pm2 restart portfolio-client` on a self-hosted runner — to a
Docker image built in CI, pushed to GHCR
(`ghcr.io/nucternal18/aolausoro.tech-2`), and rolled out on a DigitalOcean
droplet by a self-hosted GitHub Actions runner. The intended end state is:
shipping a change is a push to `main`. That trigger is **not live yet** (see
Implementation status).

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Reverse proxy | Nginx | Pairs with Cloudflare Full (strict); org convention |
| TLS | Cloudflare Origin CA certificate | Issued once, ~15-year validity, no renewal cron |
| Database | MongoDB Atlas — db name `portfolio` | Replica set out of the box, which Payload's transactional writes expect. `portfolio` is a fresh Payload database; the pre-migration Prisma data stays in its own db name in the same cluster (P3.1b migration source) |
| Media | DigitalOcean Spaces via `@payloadcms/storage-s3` (Phase 3) | Host disk holds no uploads; survives redeploys. Cloudinary is still the live media backend until Phase 3 |
| Deploy trust boundary | Self-hosted runner registration (no SSH keys) | Runner on the droplet pulls + restarts; nothing else has shell access |

## Architecture (target)

```
Internet
  → Cloudflare (DNS · Full (strict) TLS · proxied)
  → DigitalOcean Cloud Firewall (22 / 80 / 443 only)
  → Droplet — Nginx (Origin CA cert · UFW mirrors the firewall)
  → portfolio.aolausoro.tech → app container (127.0.0.1:3000)
  → MongoDB Atlas
```

fail2ban, UFW, unattended-upgrades, and key-only SSH come from
`deploy/scripts/setup-droplet.sh`.

## Where this lives

- `deploy/docker-compose.production.yml` — the runtime stack (pulls the image, never builds).
- `deploy/nginx/production.conf` — the reverse-proxy config.
- `deploy/scripts/setup-droplet.sh` — one-time OS-level droplet bootstrap (adapted from `nucternal18/ttt-vps-scripts`).
- `docker-compose.yml` + `Dockerfile` — local dev stack and the multi-stage standalone image build.
- `.github/workflows/ci.yml` — lint / type-check / prisma generate / vitest int / build, on every push to `main` + every PR.
- `.github/workflows/deploy-production.yml` — build + push + rollout. Trigger is `workflow_dispatch` only right now.

## Implementation status

| Item | Status |
|---|---|
| `next.config.mjs` `output: 'standalone'` | ✅ enabled |
| Multi-stage `Dockerfile` (non-root `nextjs` user) | ✅ |
| `app/api/health/route.ts` (`/api/health`) | ✅ (see follow-up d) |
| `deploy/docker-compose.production.yml` | ✅ |
| `deploy/nginx/production.conf` | ✅ |
| `deploy/scripts/setup-droplet.sh` | ✅ (see Security notes) |
| `.github/workflows/ci.yml` | ✅ — Type-check / Integration tests / Build are blocking; Lint is `continue-on-error` (follow-up f); `Generate Prisma client` step removed |
| `.github/workflows/deploy-production.yml` | ✅ authored, ⚠️ `workflow_dispatch` only; push-to-`main` commented out; `build` job missing `packages: write` (follow-up c) |
| CI green baseline (tsc + build + test:int pass, blocking) | ✅ |
| DigitalOcean droplet provisioned | ⬜ |
| MongoDB Atlas cluster | ⬜ |
| Cloudflare Origin CA cert + DNS for `portfolio.aolausoro.tech` | ⬜ |
| GitHub Actions self-hosted runner (label `production`) | ⬜ |
| GitHub Actions secrets populated | ⬜ |
| Media moved off Cloudinary to DO Spaces (Phase 3) | ⬜ |

The push-to-`main` deploy trigger is re-enabled only once **all** of: the
droplet, the self-hosted runner labeled `production`, and the GH Actions secrets
listed in `deploy-production.yml` exist. Until then, deploys are manual
(`workflow_dispatch`) and will fail at the `deploy` job for want of a runner.

## Known follow-ups / Security notes

- **(a) `setup-droplet.sh` privileges.** The deploy user is added to both the
  `sudo` and `docker` groups — that is root-equivalent. Intended for a
  single-purpose deploy droplet; inherited from the `ttt-vps-scripts` base.
  Acceptable for this use, not for a shared host.
- **(b) Unverified downloads in `setup-droplet.sh`.** Docker is installed via
  `curl https://get.docker.com | sh` and the GitHub Actions runner tarball is
  downloaded without checksum verification (both inherited from the
  equilibrium / `ttt-vps-scripts` base). Acceptable for now; worth hardening
  with pinned versions + checksum checks before this is run on anything but a
  throwaway droplet.
- **(c) GHCR push permissions.** `deploy-production.yml`'s `build` job needs a
  `permissions: { contents: read, packages: write }` block before the GHCR push
  will work under GitHub's restricted default `GITHUB_TOKEN` permissions. Add it
  when the workflow goes live.
- **(d) `/api/health` route coexistence — resolved.** `next build` resolves
  `/api/health` (route table: `ƒ /api/health`) alongside the Payload catch-all
  with no parallel-routes error.
- **(e) `Dockerfile` build — resolved.** Prisma, Clerk and the old
  `src/`/`admin-route-components/` stack have been removed; `pnpm run build`
  succeeds and produces `.next/standalone`. The builder stage passes a
  disposable `DATABASE_URL`/`PAYLOAD_SECRET` because `/posts` still
  prerenders via `generateStaticParams`; the homepage is `force-dynamic`.
- **(f) `pnpm run lint` non-blocking.** ~19 pre-existing eslint errors remain
  across template-derived and legacy UI files (`react-hooks` rules-of-hooks
  and react-compiler correctness, `react/display-name`, `require()` in
  `tailwind.config.js`). None are P3.2 regressions. Fix them, then drop
  `continue-on-error` from the `Lint` step in `ci.yml`.

## Migrating from the old deploy

The previous `.github/workflows/node.js.yml` ran `pnpm build` then
`pm2 restart portfolio-client` on a self-hosted runner. That workflow has been
removed. Decommission the `pm2` process on the current host only after the
container deploy is verified healthy on the new droplet.
