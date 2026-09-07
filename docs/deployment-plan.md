# Deployment Plan — aolausoro.tech

**Scope:** Production only — `portfolio.aolausoro.tech`. No staging environment.
**Status:** Pipeline landed and inert; infrastructure provisioning pending; CI
gates soft until the Payload migration lands a green baseline.

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
| Database | MongoDB Atlas | Replica set out of the box, which Payload's transactional writes expect |
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
| `.github/workflows/ci.yml` | ✅ — Lint / Type-check / Build steps are `continue-on-error` until Phase 3 |
| `.github/workflows/deploy-production.yml` | ✅ authored, ⚠️ `workflow_dispatch` only; push-to-`main` commented out; `build` job missing `packages: write` (follow-up c) |
| CI green baseline (lint + tsc + build all pass) | ⬜ Phase 3 |
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
- **(d) `/api/health` route coexistence.** `app/api/health/route.ts` (static
  `/api/health`) sits alongside the Payload catch-all
  `app/(protected)/api/[...slug]/route.ts`. The first successful production
  build must confirm Next resolves `/api/health` without a "parallel routes"
  error; if it does not, relocate the route under `app/(home)/api/health/`.
- **(e) `Dockerfile` omits `prisma generate`.** The production `Dockerfile`
  builder stage deliberately does not run `prisma generate` (the current
  `prisma.config.ts` is broken and Prisma is being removed in Phase 3). The
  image build will not succeed until the Phase-3 Prisma removal + Clerk
  async-Server-Action fixes land.

## Migrating from the old deploy

The previous `.github/workflows/node.js.yml` ran `pnpm build` then
`pm2 restart portfolio-client` on a self-hosted runner. That workflow has been
removed. Decommission the `pm2` process on the current host only after the
container deploy is verified healthy on the new droplet.
