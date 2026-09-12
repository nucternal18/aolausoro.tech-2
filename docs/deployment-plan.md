# Deployment Plan — aolausoro.tech

**Scope:** Production only — `portfolio.aolausoro.tech`. No staging environment.
**Status:** **Live.** `portfolio.aolausoro.tech` serves the Dockerized Payload
site; the pm2-hosted pre-migration app is decommissioned. Push-to-`main` now
builds and deploys automatically — verified working end-to-end (2026-09-12).
`tsc`, `next build` (standalone), `test:int`, and `pnpm run lint` all pass and
are blocking in CI (see follow-up f).

**Correction to earlier drafts of this doc:** the production host is **not**
a DigitalOcean droplet — it's a VM (`portfolio-webserver-vm-1`, Ubuntu
24.04) on a locally-hosted Proxmox server, reachable via router port-forward
(not cloud provider networking / no DO Cloud Firewall). The architecture
diagram and `setup-droplet.sh` below describe the intended shape (nginx +
UFW + fail2ban + Cloudflare Origin CA + self-hosted runner) and still apply —
only the hosting layer differs from what was originally planned. DO Spaces
(media storage, P3.3a) is unaffected and is genuinely DigitalOcean.

## Overview

Moves the site off its old deploy — `.github/workflows/node.js.yml` ran
`pnpm build` then `pm2 restart portfolio-client` on a self-hosted runner — to a
Docker image built in CI, pushed to GHCR
(`ghcr.io/nucternal18/aolausoro.tech-2`), and rolled out on a DigitalOcean
host by a self-hosted GitHub Actions runner. Shipping a change is now a push
to `main` — the pipeline builds, pushes, and rolls out automatically.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Reverse proxy | Nginx | Pairs with Cloudflare Full (strict); org convention |
| TLS | Cloudflare Origin CA certificate | Issued once, ~15-year validity, no renewal cron |
| Database | MongoDB Atlas — db name `portfolio` | Replica set out of the box, which Payload's transactional writes expect. `portfolio` is a fresh Payload database; the pre-migration Prisma data stays in its own db name in the same cluster (P3.1b migration source) |
| Media | DigitalOcean Spaces via `@payloadcms/storage-s3` (done, P3.3a) | Host disk holds no uploads; survives redeploys. Cloudinary is fully removed |
| Deploy trust boundary | Self-hosted runner registration (no SSH keys) | Runner on the host pulls + restarts; nothing else has shell access |

## Architecture (target)

```
Internet
  → Cloudflare (DNS · Full (strict) TLS, scoped via a Configuration Rule
    to portfolio.aolausoro.tech — the zone default stays Flexible for the
    owner's other, differently-hosted domains · proxied)
  → Router port-forward (443, 80 → the VM's LAN IP; no cloud firewall — this
    host is a Proxmox VM, not a DO droplet, see the note above)
  → Host — Nginx (Origin CA cert · UFW mirrors the port-forward · fail2ban)
  → portfolio.aolausoro.tech → app container (127.0.0.1:3000)
  → MongoDB Atlas (direct multi-host connection string — see follow-up g)
```

fail2ban, UFW, unattended-upgrades, and key-only SSH come from
`deploy/scripts/setup-droplet.sh`.

## Where this lives

- `deploy/docker-compose.production.yml` — the runtime stack (pulls the image, never builds).
- `deploy/nginx/production.conf` — the reverse-proxy config.
- `deploy/scripts/setup-droplet.sh` — one-time OS-level droplet bootstrap (adapted from `nucternal18/ttt-vps-scripts`).
- `docker-compose.yml` + `Dockerfile` — local dev stack and the multi-stage standalone image build.
- `.github/workflows/ci.yml` — lint (non-blocking) / type-check / integration tests / build, on every push to `main` + every PR.
- `.github/workflows/deploy-production.yml` — build + push + rollout. Triggers on push to `main` and via `workflow_dispatch`.

## Implementation status

| Item | Status |
|---|---|
| `next.config.mjs` `output: 'standalone'` | ✅ enabled |
| Multi-stage `Dockerfile` (non-root `nextjs` user) | ✅ |
| `app/api/health/route.ts` (`/api/health`) | ✅ (see follow-up d) |
| `deploy/docker-compose.production.yml` | ✅ |
| `deploy/nginx/production.conf` | ✅ |
| `deploy/scripts/setup-droplet.sh` | ✅ (see Security notes) |
| `.github/workflows/ci.yml` | ✅ — Lint / Type-check / Integration tests / Build all blocking (follow-up f resolved); `Generate Prisma client` step removed |
| `.github/workflows/deploy-production.yml` | ✅ live — push-to-`main` **and** `workflow_dispatch` both enabled; `build` job already had `packages: write` (follow-up c stale, removed) |
| CI green baseline (tsc + build + test:int pass, blocking) | ✅ |
| P3.2b — legacy content migrated `aolausoro` → `portfolio` | ✅ 2/7/6/12/2/5 (users/projects/jobs/wiki/cvs/messages) |
| P3.3a — Media/CVs on DO Spaces; Cloudinary removed | ✅ `s3Storage` for `media`+`cvs` (bucket `aolausorotech`, `lon1`, CDN); 21 assets migrated → 19 media docs + 2 CV PDFs; `cloudinary` dep + `lib/cloudinary.ts` + `lib/env.ts` gone |
| Sentry modernized for SDK 10 / Next 16 (`onRequestError`, `instrumentation-client.ts`, env-driven DSN/sample rate) | ✅ (P3.3b) |
| P3.3c — production host cutover | ✅ Cloudflare Origin CA cert issued + installed; router port-forward for 443 added; ufw + fail2ban on the host; Cloudflare Configuration Rule (SSL Full-strict, scoped to `portfolio.aolausoro.tech` only — zone default untouched); runner labeled `production`; `/opt/aolausoro` prepared; pm2's `portfolio-client` decommissioned |
| MongoDB Atlas cluster | ✅ (has been live all along — `portfolio` db) |
| GitHub Actions secrets populated | ✅ — added `NEXT_PUBLIC_SERVER_URL`, `DO_SPACES_REGION`; `DATABASE_URL` switched from `mongodb+srv://` to the direct multi-host form (see follow-up g) |
| Push-to-`main` deploy trigger | ✅ enabled and verified (`gh run list --branch main` shows a successful `Deploy Production` run from the merge push) |

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
- **(c) GHCR push permissions — resolved / was never actually missing.** The
  `build` job already had `permissions: { contents: read, packages: write }`;
  this note in earlier drafts was stale.
- **(d) `/api/health` route coexistence — resolved.** `next build` resolves
  `/api/health` (route table: `ƒ /api/health`) alongside the Payload catch-all
  with no parallel-routes error.
- **(e) `Dockerfile` build — resolved.** Prisma, Clerk and the old
  `src/`/`admin-route-components/` stack have been removed; `pnpm run build`
  succeeds and produces `.next/standalone`. The builder stage passes a
  disposable `DATABASE_URL`/`PAYLOAD_SECRET` because `/posts` still
  prerenders via `generateStaticParams`; the homepage is `force-dynamic`.
- **(f) `pnpm run lint` — resolved.** The 20 pre-existing eslint errors
  (`react-hooks` rules-of-hooks/purity/set-state-in-effect, `react/display-name`,
  `require()` in `tailwind.config.js`) are fixed:
  `components/navigation/nav-components.tsx`'s `Nav.X` compound-component
  properties are now named function declarations (fixes `display-name` +
  lets `Nav.SideNav`'s hooks be recognized); `components/ui/sidebar.tsx`'s
  random skeleton width moved from `useMemo` to a lazy `useState` initializer
  (the React-sanctioned place for a one-time impure call);
  `providers/Theme/index.tsx`'s redundant effect removed (the theme is
  already resolved pre-hydration by `providers/Theme/InitTheme`, so
  `useState`'s initializer reading `data-theme` off the DOM is sufficient —
  no second `setState` needed); `components/Card/index.tsx`'s two ref props
  keep a targeted `eslint-disable-next-line react-hooks/refs` (the rule can't
  trace a ref through a custom hook's return object; React Compiler itself is
  off — `next.config.mjs` `reactCompiler: false` — so this is lint-only, not
  a runtime risk); `tailwind.config.js` plugins moved from `require()` to
  `import`. `continue-on-error` dropped from the `Lint` step in `ci.yml` —
  it's now blocking like the other three checks.
- **(g) `DATABASE_URL` must use the direct multi-host form, not
  `mongodb+srv://`.** Discovered during the P3.3c cutover: the production
  container couldn't resolve the Atlas SRV DNS record
  (`querySrv ECONNREFUSED _mongodb._tcp.cluster0.hdg3l.mongodb.net`) — a
  Docker-networking/DNS quirk on this host, the same class of issue the
  sandbox environment hit all through this migration. The `DATABASE_URL`
  secret is now the direct multi-host connection string
  (`mongodb://…@cluster0-shard-00-00.hdg3l.mongodb.net:27017,…/portfolio?...`)
  and works. If this host's Docker DNS setup ever changes, this is the first
  thing to re-check.
- **(h) `/opt/aolausoro` needs to exist and be owned by the runner's user
  before the first deploy.** `setup-droplet.sh` does this for a fresh
  droplet; it was a one-time manual step here (`sudo mkdir -p /opt/aolausoro
  && sudo chown <user>:<user> /opt/aolausoro`) since this host was never run
  through that script. Already done; noted for the record.
- **(i) `environment: production` must match the GitHub environment's name
  exactly (case-sensitive).** The repo's environment is named `Production`
  (capital P); the workflow originally said `production` and never actually
  applied any environment-scoped protection. Fixed in P3.3c.

## Migrating from the old deploy — done

The previous `.github/workflows/node.js.yml` ran `pnpm build` then
`pm2 restart portfolio-client` on a self-hosted runner. That workflow file is
gone. The `pm2` process itself was decommissioned during the P3.3c cutover
(2026-09-12), after the container deploy was verified healthy and serving —
`pm2 delete portfolio-client` + `pm2 save`, old build directory removed.
