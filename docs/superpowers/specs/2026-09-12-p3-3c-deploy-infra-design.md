# P3.3c — Deploy Infra Cutover + Workflow Fixes + Final Merge

**Status:** design — approved to write up 2026-09-12
**Phase:** 3, sub-project P3.3c (last of the P3.3 trio)
**Depends on:** P3.3a (done — media on Spaces), P3.3b (done — Sentry modernized)
**Ends:** Phase 3 — merges `feature/refactor-portfolio` into `main`

## Problem

The last P3.x piece: get the Payload site actually serving `portfolio.aolausoro.tech`
in production, replacing the pm2-hosted old Next.js app that's live there today,
then land the branch on `main`.

## Ground truth (inventoried live, 2026-09-12 — not assumptions)

- **`portfolio-webserver-vm-1`** (Ubuntu 24.04.5, Docker 29.8.0, Compose v5.5.1,
  nginx 1.24.0) is **not a fresh droplet** — it's the box already serving
  `portfolio.aolausoro.tech` live via pm2.
- Deploy user is **`nucternal18`** (already in the `docker` group), not the
  `aolausoro` user `setup-droplet.sh` assumes. That script is **not** used here
  — this is a manual, in-place hardening + cutover on an existing box.
  `setup-droplet.sh` remains the reference for a genuinely fresh droplet.
- pm2 process `portfolio-client` is running, nginx proxies
  `portfolio.aolausoro.tech` (port 80 only) to `localhost:3000` — the exact
  port the new Docker container will bind to. **They cannot run concurrently.**
- Cloudflare currently terminates TLS in **Flexible** mode for this host (no
  origin cert exists on the box; nginx has no port-443 block at all).
- **ufw is active**: only 22/tcp and 80/tcp open (+ v6). 443 is closed.
  fail2ban is not installed.
- A GitHub Actions self-hosted runner (`portfolio-webserver-vm-1`, id 22) is
  registered and online, running as a systemd service under `nucternal18`.
  It was missing the `production` label the `deploy` job requires — **already
  fixed** via `gh api …/runners/22/labels` during brainstorming (verified:
  labels now `self-hosted, Linux, X64, production`).
- 17 repo-level secrets already exist (`DATABASE_URL`, all `DO_SPACES_*` except
  `DO_SPACES_REGION`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`,
  `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`,
  `RESEND_API_KEY`, `RECAPTCHA_SITE_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`,
  `REPO_TOKEN`, `NEXT_TELEMETRY_DISABLED`, `NEXT_PUBLIC_API_URL` — dead, the
  code reads `NEXT_PUBLIC_SERVER_URL`, which does **not** exist as a secret).
  Missing: `NEXT_PUBLIC_SERVER_URL`, `DO_SPACES_REGION`.
- A GitHub environment named **`Production`** (capital P) exists. The workflow
  references `environment: production` (lowercase) — mismatched.
- `deploy-production.yml` does not exist on `main` (only on this branch) — it
  404s from the Actions API. `main` is still on the old `node.js.yml` CI.
- Other, unrelated hosts are live on the same Cloudflare zone, on **different
  infrastructure** (not this droplet). A zone-wide SSL/TLS mode change is
  therefore not obviously safe to reason about from here — scope the change
  to this one hostname instead (see §A.5).
- The Dockerfile and workflow both still reference the dead
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `NEXT_PUBLIC_CLOUDINARY_NAME` build
  args, and are **missing** `NEXT_PUBLIC_SENTRY_DSN` and
  `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` as build args — the latter is a real
  pre-existing bug (a `NEXT_PUBLIC_*` var must be baked in at build time; today
  the deployed contact form's reCAPTCHA would silently get `undefined`).

## Decisions (from brainstorming)

1. Other live hosts on the zone are on different infrastructure — use a
   Cloudflare **Configuration Rule** scoped to `portfolio.aolausoro.tech` to
   set SSL/TLS mode to Full (strict) for *this hostname only*, leaving the
   zone default (Flexible) untouched. Sidesteps any risk to the other hosts
   entirely, whether they're proxied or not.
2. Runner label fixed via API (done).
3. Cutover is **guided, step-by-step** — the owner executes each command over
   SSH, verifies, reports back, before the next step. No step that could
   affect the live site runs unattended.
4. pm2's `portfolio-client` is **deleted immediately** once the new container
   is confirmed healthy and serving — no fallback window kept.
5. P3.3c **ends with merging `feature/refactor-portfolio` into `main`** — the
   push-to-`main` trigger cannot function otherwise (the workflow file must
   exist on the default branch), and this is the natural end of Phase 3.

## §A — Infra cutover runbook (owner executes via SSH; I hand over exact commands per step, checkpoint before the next)

All commands run as `nucternal18` on `portfolio-webserver-vm-1` unless noted `sudo`.

**A.1 — Cloudflare Origin CA certificate**
Cloudflare dashboard → SSL/TLS → Origin Server → Create Certificate, hostname
`portfolio.aolausoro.tech` (or `*.aolausoro.tech` if others will need one
later), RSA 2048, 15-year validity. Save the cert + key. Owner installs:
```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo tee /etc/ssl/cloudflare/portfolio.aolausoro.tech.pem   # paste cert, Ctrl-D
sudo tee /etc/ssl/cloudflare/portfolio.aolausoro.tech.key   # paste key, Ctrl-D
sudo chmod 600 /etc/ssl/cloudflare/portfolio.aolausoro.tech.key
```
*No traffic-affecting change yet.*

**A.2 — Firewall + fail2ban**
```bash
sudo ufw allow 443/tcp
sudo ufw status verbose   # confirm 22, 80, 443 all allowed, nothing else
sudo apt-get update && sudo apt-get install -y fail2ban
sudo systemctl enable --now fail2ban
```
*No traffic-affecting change — 443 was closed, now open; nothing listens
there yet so this is inert until A.3.*

**A.3 — nginx TLS server block (HTTP untouched)**
Edit `/etc/nginx/sites-available/aolausoro.tech` in place (keep the existing
filename — it's already correctly symlinked) to **add** a second `server`
block for 443, leaving the existing port-80 block exactly as-is (no redirect
yet):
```nginx
server {
        listen 80;
        listen [::]:80;
        server_name portfolio.aolausoro.tech;
        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}

server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name portfolio.aolausoro.tech;

        ssl_certificate     /etc/ssl/cloudflare/portfolio.aolausoro.tech.pem;
        ssl_certificate_key /etc/ssl/cloudflare/portfolio.aolausoro.tech.key;
        ssl_protocols TLSv1.2 TLSv1.3;

        client_max_body_size 20m;

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Forwarded-Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
```
*Still no traffic-affecting change to what's live on port 80 — this only adds
a new listener on 443, which nothing external can validate yet since
Cloudflare hasn't been told to speak HTTPS to the origin.*

**A.4 — Verify the origin's HTTPS directly (bypass Cloudflare)**
```bash
curl -vk --resolve portfolio.aolausoro.tech:443:127.0.0.1 https://portfolio.aolausoro.tech/api/health
```
Expect a valid TLS handshake presenting the Cloudflare Origin CA cert and a
200 from the still-running pm2 app (proxied same as port 80). **Stop and
report back here before A.5** — this is the gate that confirms 443 actually
works before Cloudflare is told to rely on it.

**A.5 — Cloudflare Configuration Rule (scoped, not zone-wide)**
Cloudflare dashboard → Rules → Configuration Rules → Create rule:
- Field: Hostname, operator "equals", value `portfolio.aolausoro.tech`
- Setting: SSL/TLS → **Full (strict)**
Save. This overrides the zone default (which stays Flexible) for only this
hostname. Wait ~30s for edge propagation, then:
```bash
curl -I https://portfolio.aolausoro.tech/api/health
```
from your own machine (through Cloudflare this time). Expect 200. **Report
back before A.6.**

**A.6 — HTTP→HTTPS redirect**
Now that 443 is confirmed working end-to-end, change the port-80 block to
redirect:
```nginx
server {
        listen 80;
        listen [::]:80;
        server_name portfolio.aolausoro.tech;
        return 301 https://$host$request_uri;
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
curl -I http://portfolio.aolausoro.tech   # expect 301 -> https
```

**A.7 — Add the two missing GH secrets**
```bash
gh secret set NEXT_PUBLIC_SERVER_URL --repo nucternal18/aolausoro.tech-2 --body "https://portfolio.aolausoro.tech"
gh secret set DO_SPACES_REGION --repo nucternal18/aolausoro.tech-2 --body "lon1"
```
(I can run these — they're additive, not traffic-affecting, and use the same
`gh` session already used to add the runner label.)

**A.8 — First real deploy, manual trigger**
After §B (workflow/Dockerfile fixes) is committed and pushed to this branch:
```bash
gh workflow run deploy-production.yml --ref feature/refactor-portfolio --repo nucternal18/aolausoro.tech-2
gh run watch --repo nucternal18/aolausoro.tech-2
```
Watch the `build` job (GitHub-hosted) then the `deploy` job (runs on
`portfolio-webserver-vm-1`). The compose healthcheck (`/api/health`) gates
`docker compose up -d` success. **Report the run URL / outcome before A.9** —
if the health check fails, the old pm2 process is still serving on port 3000
underneath (the container failed to bind or crashed), so nothing is broken
yet; debug from the container logs (`docker compose logs`).

**A.9 — Cutover: remove pm2**
Only once A.8 shows the container `healthy` and a manual
`curl https://portfolio.aolausoro.tech` confirms the new Payload site
(distinguishable — it will show real migrated project data, not the old
site's content):
```bash
pm2 delete portfolio-client
pm2 save
# Old build output — the exact path nginx's original (pre-A.3) `root` directive
# named: /home/nucternal18/actions-runner/portfolio/aolausoro.tech-2/aolausoro.tech-2
rm -rf ~/actions-runner/portfolio/aolausoro.tech-2
```
*Deliberately no fallback window (per the brainstorming decision) — if
anything is wrong post-cutover, redeploy is `gh workflow run
deploy-production.yml` again after a fix, same as any future deploy.*

## §B — Workflow + Dockerfile fixes (code, one commit)

**`Dockerfile`**
- Remove `ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / its `ENV` line.
- Remove `ARG NEXT_PUBLIC_CLOUDINARY_NAME` / its `ENV` line.
- Add, near the other `NEXT_PUBLIC_*` args:
  ```dockerfile
  ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  ```

**`.github/workflows/deploy-production.yml`**
- `environment: production` → `environment: Production` (both jobs — match
  the existing GH environment exactly).
- `build` job's `docker buildx build` args:
  - remove `--build-arg "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=…"` and
    `--build-arg "NEXT_PUBLIC_CLOUDINARY_NAME=…"`.
  - add `--build-arg "NEXT_PUBLIC_SENTRY_DSN=${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}"`
    and `--build-arg "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${{ secrets.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }}"`.
- `deploy` job's runtime `.env` heredoc:
  - remove the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` /
    `CLERK_WEBHOOK_SECRET` / `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` /
    `CLOUDINARY_API_SECRET` / `NEXT_PUBLIC_CLOUDINARY_NAME` /
    `NEXT_PUBLIC_CLOUDINARY_PRESET` lines.
  - add `DO_SPACES_REGION=${{ secrets.DO_SPACES_REGION }}` and
    `NEXT_PUBLIC_SENTRY_DSN=${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}`.

## §C — Data cleanup

- Drop the `legacyId` field from `payload/collections/{Projects,Jobs,Wiki,Messages,CVs,Users}/index.ts`
  (import of `@fields/legacyId` and the field entry). Regenerate types.
- Delete the `aolausoro` database. MCP `drop-database` is denied — owner runs:
  ```bash
  mongosh "mongodb+srv://aolausoro:<pass>@cluster0.hdg3l.mongodb.net/aolausoro?retryWrites=true&w=majority" --eval 'db.dropDatabase()'
  ```
  after confirming the production `portfolio` db has everything needed
  (P3.2b's migration summary + this session's MCP spot-checks already did).

## §D — Enable the trigger, verify CI, merge

- Uncomment the `push: branches: [main]` trigger in
  `.github/workflows/deploy-production.yml` (only after §A.8 succeeds).
- Full local verification (tsc, build, test:int, prettier) one more time.
- Merge `feature/refactor-portfolio` → `main` via a regular merge commit (not
  squash) — matching this repo's own history (PRs #1–#3 were merged that
  way), and preferable here since the branch carries a meaningful, already-
  organized per-task commit history worth keeping intact.
- Confirm `main`'s `ci.yml` and the new `deploy-production.yml` both appear in
  the Actions tab; confirm the push-triggered deploy runs and succeeds (or
  stays green from the merge commit itself, since content is identical to
  what A.8 already verified).

## Verification

- Every §A step has its own inline checkpoint (curl checks, `nginx -t`,
  `ufw status`) — no step proceeds without the prior one confirmed.
- §B: `pnpm exec tsc --noEmit` (0), `pnpm run build` (green, local — Dockerfile
  changes aren't locally buildable without Docker, so this validates the
  Next.js side only; the real validation is A.8's CI build).
- §C: `pnpm run generate:types`, `tsc`, `test:int`, `build` all still green
  after the `legacyId` removal.
- Final: `portfolio.aolausoro.tech` serves the new Payload site over HTTPS,
  `/admin` reachable, a contact-form submission with reCAPTCHA succeeds
  (validates the previously-missing build-arg), Sentry receives a test error.

## Rollback

- §A.1–A.6 (cert, firewall, nginx, Cloudflare rule): each step is reversible
  independently — remove the Configuration Rule, revert the nginx block,
  close 443 — without touching the still-running pm2/port-80 path, right up
  until A.6's redirect. After A.6, port 80 no longer serves directly, but
  A.4's gate means 443 is already proven working by then.
- §A.8 (first deploy): if the health check fails, `docker compose down` on
  the droplet leaves port 3000 free again — but pm2 is still deleted only in
  A.9, so nothing is lost as long as A.9 hasn't run yet.
- §A.9 (pm2 removal) is the one irreversible step — by design, gated on A.8
  succeeding and a manual content check.
- §B/§C are ordinary git commits — revert if needed.
- §D's merge is the final, hardest-to-reverse step — done last, after
  everything above is verified.

## Out of scope

- Renaming/consolidating the `NEXT_PUBLIC_API_URL` dead secret (harmless
  leftover, not read by any code — clean up whenever, not blocking).
- `setup-droplet.sh` hardening follow-ups (a) sudo+docker group scope, (b)
  unverified-download pinning — that script targets a *fresh* droplet, not
  this already-provisioned one; still relevant for a future second
  environment, not touched here.
- Any other domains/subdomains on the same Cloudflare zone — explicitly not
  touched (§A.5's whole point).
