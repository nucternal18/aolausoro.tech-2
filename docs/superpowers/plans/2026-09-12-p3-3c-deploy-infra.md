# P3.3c — Deploy Infra Cutover + Final Merge — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **This plan is not fully self-executing.** Several steps in Tasks 3–7 run on
> a live production box over SSH or in the Cloudflare dashboard — the owner
> executes those and reports the result back before the next step proceeds.
> Steps marked **[owner]** are handed to the owner verbatim; steps marked
> **[agent]** the executing agent runs directly (repo edits, `gh` CLI calls
> that don't touch the droplet). Do not skip an **[owner]** step's checkpoint.

**Goal:** Cut `portfolio.aolausoro.tech` over from the pm2-hosted old app to the new Dockerized Payload site on the already-live `portfolio-webserver-vm-1` droplet, fix the deploy workflow's stale/missing env wiring, drop migration-provenance fields, and land `feature/refactor-portfolio` on `main`.

**Architecture:** No new subsystem — a staged, checkpointed cutover on existing infrastructure (see spec §Ground truth), plus a bundle of small, low-risk repo fixes that unblock it.

**Tech Stack:** Docker/Docker Compose, nginx, Cloudflare (Origin CA cert + Configuration Rules), GitHub Actions (self-hosted runner), Payload CMS/MongoDB Atlas.

**Spec:** `docs/superpowers/specs/2026-09-12-p3-3c-deploy-infra-design.md`

## Global Constraints

- No **[owner]** step's follow-on step runs until the owner has reported that
  step's checkpoint output back and it matches what's expected.
- `pm2 delete portfolio-client` (Task 7) is the one deliberately irreversible
  step in this plan — it runs only after Task 6 confirms the new container is
  `healthy` **and** a manual content check confirms it's actually serving the
  new site (not a stale cache).
- The Cloudflare SSL/TLS change is a **Configuration Rule scoped to
  `portfolio.aolausoro.tech`** (Task 5) — never the zone-wide default. Do not
  suggest or accept a zone-wide mode change as a shortcut.
- `pnpm exec tsc --noEmit` → 0 and `pnpm run test:int` stays green after every
  code task (1, 2, 8).
- Commits `--no-verify`, ending with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
  ```
- `gh` CLI is authenticated as `nucternal18` with repo-admin access
  (verified during brainstorming: added the runner's `production` label
  successfully). Task 3's secret-setting and Task 6's workflow dispatch use it
  directly — no owner action needed for those specific calls.

---

### Task 1: Workflow + Dockerfile fixes [agent]

**Files:**
- Modify: `Dockerfile`
- Modify: `.github/workflows/deploy-production.yml`

**Interfaces:** none (config-only; no code consumes these files).

- [ ] **Step 1: `Dockerfile` — swap dead build-args for the missing one**

Remove:
```dockerfile
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLOUDINARY_NAME
ENV NEXT_PUBLIC_CLOUDINARY_NAME=$NEXT_PUBLIC_CLOUDINARY_NAME
```
Add, in their place:
```dockerfile
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
```

- [ ] **Step 2: `deploy-production.yml` — environment name**

Change `environment: production` to `environment: Production` in **both**
the `build` and `deploy` jobs (2 occurrences).

- [ ] **Step 3: `deploy-production.yml` — build-args**

In the `build` job's `docker buildx build` step, remove:
```
            --build-arg "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}" \
            --build-arg "NEXT_PUBLIC_CLOUDINARY_NAME=${{ secrets.NEXT_PUBLIC_CLOUDINARY_NAME }}" \
```
Add, after the `NEXT_PUBLIC_SERVER_URL` line:
```
            --build-arg "NEXT_PUBLIC_SENTRY_DSN=${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}" \
            --build-arg "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${{ secrets.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }}" \
```

- [ ] **Step 4: `deploy-production.yml` — runtime `.env` heredoc**

In the `deploy` job's "Write runtime .env from secrets" step, remove these
lines:
```
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY=${{ secrets.CLERK_SECRET_KEY }}
          CLERK_WEBHOOK_SECRET=${{ secrets.CLERK_WEBHOOK_SECRET }}
          CLOUDINARY_NAME=${{ secrets.CLOUDINARY_NAME }}
          CLOUDINARY_API_KEY=${{ secrets.CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET=${{ secrets.CLOUDINARY_API_SECRET }}
          NEXT_PUBLIC_CLOUDINARY_NAME=${{ secrets.NEXT_PUBLIC_CLOUDINARY_NAME }}
          NEXT_PUBLIC_CLOUDINARY_PRESET=${{ secrets.NEXT_PUBLIC_CLOUDINARY_PRESET }}
```
Add, near the other `DO_SPACES_*` lines:
```
          DO_SPACES_REGION=${{ secrets.DO_SPACES_REGION }}
```
Add, near `SENTRY_AUTH_TOKEN`:
```
          NEXT_PUBLIC_SENTRY_DSN=${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}
```

- [ ] **Step 5: Verify + commit**

```bash
pnpm exec tsc --noEmit   # 0 (these files aren't type-checked, but confirms no collateral damage)
pnpm exec prettier --check .github/workflows/deploy-production.yml
git add Dockerfile .github/workflows/deploy-production.yml
git commit --no-verify -m "$(cat <<'EOF'
fix(deploy): drop dead Clerk/Cloudinary env wiring; add missing Sentry/reCAPTCHA build-args

- Dockerfile + deploy-production.yml: remove NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  and NEXT_PUBLIC_CLOUDINARY_NAME (both dead since P3.1a/P3.3a)
- add NEXT_PUBLIC_SENTRY_DSN and NEXT_PUBLIC_RECAPTCHA_SITE_KEY as build
  args — the reCAPTCHA one was a real pre-existing bug: a NEXT_PUBLIC_*
  var must be baked in at build time, and it never was, so the deployed
  contact form's reCAPTCHA would silently get undefined
- runtime .env: add DO_SPACES_REGION, NEXT_PUBLIC_SENTRY_DSN; drop the
  Clerk/Cloudinary lines
- environment: production -> Production, matching the existing GH
  environment (was case-mismatched, never actually applied)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin feature/refactor-portfolio
```

---

### Task 2: Drop `legacyId` fields [agent]

**Files:**
- Modify: `payload/collections/Projects/index.ts`, `Jobs/index.ts`, `Wiki/index.ts`, `Messages/index.ts`, `CVs/index.ts`, `Users/index.ts`
- Regenerate: `payload-types.ts`

**Interfaces:** removes `legacyId?: string | null` from the `Project`, `Job`,
`Wiki`, `Message`, `Cv`, `User` generated types. No other code reads
`legacyId` (verify with the grep in Step 2) — safe to remove.

- [ ] **Step 1: Remove the field from each collection**

In each of the six files, delete the `import { legacyIdField } from '@fields/legacyId'`
line and the `legacyIdField,` entry in the `fields` array.

- [ ] **Step 2: Confirm nothing else references it, then delete the field def**

```bash
git grep -n "legacyId" -- '*.ts' '*.tsx' | grep -v payload-types.ts
```
Expected: no hits outside `payload/scripts/` (the migration scripts
legitimately reference `legacyId` — leave those files alone, they're
historical record of how the migration worked, not live code paths).
```bash
git rm fields/legacyId.ts
```

- [ ] **Step 3: Regenerate + verify**

```bash
pnpm run generate:types
pnpm exec tsc --noEmit           # 0
pnpm run test:int                # green
pnpm run build                   # green
pnpm exec prettier --write . && pnpm exec prettier --check .
```

- [ ] **Step 4: Commit + push**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
chore(cms): drop legacyId migration-provenance fields

P3.2b/P3.3a's legacyId fields (projects/jobs/wiki/messages/cvs/users)
are no longer needed now that the aolausoro source db is about to be
deleted (Task 9). The migration scripts under payload/scripts/ keep
their own legacyId references as historical record.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin feature/refactor-portfolio
```

---

### Task 3: Missing secrets + Cloudflare cert + firewall/fail2ban

**A.7 [agent] — add the two missing GH secrets**

- [ ] **Step 1:**
```bash
gh secret set NEXT_PUBLIC_SERVER_URL --repo nucternal18/aolausoro.tech-2 --body "https://portfolio.aolausoro.tech"
gh secret set DO_SPACES_REGION --repo nucternal18/aolausoro.tech-2 --body "lon1"
gh secret list --repo nucternal18/aolausoro.tech-2 | grep -E "NEXT_PUBLIC_SERVER_URL|DO_SPACES_REGION"
```
Expected: both now listed.

**A.1 [owner] — Cloudflare Origin CA certificate**

- [ ] **Step 2:** Hand the owner: "Cloudflare dashboard → SSL/TLS → Origin
Server → Create Certificate. Hostname `portfolio.aolausoro.tech`, key type
RSA (2048), validity 15 years. Save both the certificate and private key it
shows you (shown once)."

- [ ] **Step 3:** Hand the owner, to run on `portfolio-webserver-vm-1`:
```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo tee /etc/ssl/cloudflare/portfolio.aolausoro.tech.pem   # paste the certificate, then Ctrl-D
sudo tee /etc/ssl/cloudflare/portfolio.aolausoro.tech.key   # paste the private key, then Ctrl-D
sudo chmod 600 /etc/ssl/cloudflare/portfolio.aolausoro.tech.key
sudo ls -la /etc/ssl/cloudflare/
```
**Checkpoint:** owner reports the `ls -la` output — expect both files
present, `.key` mode `600`. No traffic-affecting change yet — wait for
confirmation before Step 4.

**A.2 [owner] — firewall + fail2ban**

- [ ] **Step 4:** Hand the owner:
```bash
sudo ufw allow 443/tcp
sudo ufw status verbose
sudo apt-get update && sudo apt-get install -y fail2ban
sudo systemctl enable --now fail2ban
sudo systemctl is-active fail2ban
```
**Checkpoint:** owner reports `ufw status` (22, 80, 443 all `ALLOW IN`) and
`fail2ban` active. No traffic-affecting change — nothing listens on 443 yet.

---

### Task 4: nginx TLS block + verify origin directly [owner]

**A.3**

- [ ] **Step 1:** Hand the owner the file to edit,
`/etc/nginx/sites-available/aolausoro.tech` (keep this filename — it's
already correctly symlinked into `sites-enabled/`), instructing them to
**add** this second `server` block below the existing port-80 one, leaving
that one untouched:
```nginx
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
**Checkpoint:** owner reports `nginx -t` succeeded and the reload had no
errors.

**A.4**

- [ ] **Step 2:** Hand the owner:
```bash
curl -vk --resolve portfolio.aolausoro.tech:443:127.0.0.1 https://portfolio.aolausoro.tech/api/health
```
**Checkpoint — gate:** owner reports the output. Expect a valid TLS
handshake (the cert chain shown should be the Cloudflare Origin CA one) and
`200`/healthy JSON from `/api/health` (still the old pm2 app underneath at
this point — that's expected and fine, this step only proves TLS termination
works). **Do not proceed to Task 5 without this confirmed.**

---

### Task 5: Cloudflare Configuration Rule + redirect [owner]

**A.5**

- [ ] **Step 1:** Hand the owner: "Cloudflare dashboard → Rules →
Configuration Rules → Create rule. Field: Hostname, operator 'equals', value
`portfolio.aolausoro.tech`. Setting: SSL/TLS → Full (strict). Save. Do **not**
change the zone-level default SSL/TLS setting — only this rule."

- [ ] **Step 2:** Hand the owner (from their own machine, not the droplet —
this goes through Cloudflare):
```bash
curl -I https://portfolio.aolausoro.tech/api/health
```
**Checkpoint — gate:** owner reports `200`. If it fails (525/526 handshake
errors are the common Cloudflare-side symptom of a cert mismatch), stop —
do not proceed to the redirect step with 443 unverified end-to-end.

**A.6**

- [ ] **Step 3:** Once Step 2 is confirmed, hand the owner the edit to the
same nginx file — change the **existing port-80 block** from proxying to a
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
curl -I http://portfolio.aolausoro.tech
```
**Checkpoint:** owner reports a `301` to `https://...`.

---

### Task 6: First deploy via `workflow_dispatch` [agent triggers, owner confirms]

**A.8**

- [ ] **Step 1 [agent]:** Confirm Tasks 1–5 are all merged into this branch
(Task 1 already pushed), then:
```bash
gh workflow run deploy-production.yml --ref feature/refactor-portfolio --repo nucternal18/aolausoro.tech-2
gh run watch --repo nucternal18/aolausoro.tech-2
```

- [ ] **Step 2 [agent]:** Watch the `build` job (GitHub-hosted runner) to
completion, then the `deploy` job (runs on `portfolio-webserver-vm-1`, gated
by the compose healthcheck hitting `/api/health`).

- [ ] **Step 3 — checkpoint, gate:** If the run fails, read the failing
step's log (`gh run view --log-failed`), fix, and re-dispatch — do not touch
pm2 until this run succeeds green end-to-end. If it fails at the `deploy`
job's health-check wait loop specifically, the old pm2 process is still
serving on port 3000 underneath (the new container never bound successfully)
— nothing is broken for site visitors at this point.

- [ ] **Step 4 [owner], once the run is green:**
```bash
curl -s https://portfolio.aolausoro.tech/ | grep -o "SteppingStonesapp\|portfolio-client"
```
**Checkpoint:** owner reports which string appears. `SteppingStonesapp` (a
real migrated project name) confirms the new Payload site is live;
`portfolio-client` or neither means the container isn't actually being
served yet (stale cache, nginx pointed wrong, or the container crashed after
passing its health check) — **do not proceed to Task 7** until this shows the
new site.

---

### Task 7: Remove pm2 [owner] — irreversible, gated

**A.9**

- [ ] **Step 1:** Only after Task 6 Step 4 confirms the new site is live, hand
the owner:
```bash
pm2 delete portfolio-client
pm2 save
rm -rf ~/actions-runner/portfolio/aolausoro.tech-2
pm2 list
```
**Checkpoint:** owner reports `pm2 list` shows no `portfolio-client` process,
and a fresh `curl https://portfolio.aolausoro.tech/` still returns the new
site (confirms nginx/Docker path is fully independent of the now-deleted pm2
process).

---

### Task 8: Enable the push trigger, final verification, merge to `main` [agent]

**Files:**
- Modify: `.github/workflows/deploy-production.yml`

- [ ] **Step 1: Uncomment the push trigger**

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```
(remove the `# TODO(phase-3)` comment block above it too).

- [ ] **Step 2: Full local verification**

```bash
pnpm install --frozen-lockfile   # clean
pnpm exec tsc --noEmit           # 0
pnpm run test:int                # green, zero skips
pnpm run build                   # green
pnpm exec prettier --check .     # clean
```

- [ ] **Step 3: Commit the trigger change**

```bash
git add .github/workflows/deploy-production.yml
git commit --no-verify -m "$(cat <<'EOF'
feat(deploy): enable push-to-main deploy trigger

The droplet, self-hosted runner (production label), Cloudflare TLS,
and GH Actions secrets are all verified working end-to-end (Tasks 3-7).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin feature/refactor-portfolio
```

- [ ] **Step 4: Merge to `main`**

```bash
git fetch origin
git checkout main
git pull origin main
git merge --no-ff feature/refactor-portfolio
git push origin main
```

- [ ] **Step 5: Verify on `main`**

```bash
gh run list --repo nucternal18/aolausoro.tech-2 --branch main --limit 5
```
Expected: `ci.yml` and `deploy-production.yml` both appear and are green (the
merge commit push should trigger both). If `deploy-production.yml` runs,
watch it the same way as Task 6.

- [ ] **Step 6: Update the deployment plan + write the closing handoff**

`docs/deployment-plan.md`: flip the remaining ⬜ rows (droplet provisioned,
Cloudflare cert/DNS, self-hosted runner, GH secrets populated) to ✅; update
the top-of-file Status line to reflect Phase 3 complete.

New handoff `.claude/hand-off/handoff-aolausoro-<today>-p3-3c.md`: the full
cutover narrative, that `main` now carries everything, that
`feature/refactor-portfolio` can be deleted once confidence is high (not done
automatically here — leave that decision to the owner). Update
`.claude/hand-off/HANDOFF.md` to reflect Phase 3 as complete and point at
this handoff.

```bash
git add docs/deployment-plan.md .claude/hand-off
git commit --no-verify -m "$(cat <<'EOF'
docs(p3.3c): deploy-infra cutover complete — Phase 3 closing handoff

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin main
```

---

## Self-Review

**Spec coverage:**
- §A.1–A.9 → Tasks 3–7, in the spec's exact order, each gate preserved as an
  explicit checkpoint ✓
- §A.5's hostname-scoped Configuration Rule (never zone-wide) → Task 5 Step 1,
  restated in Global Constraints ✓
- §B (Dockerfile/workflow fixes) → Task 1 ✓
- §C (legacyId drop, aolausoro deletion) → Task 2 (legacyId only — see below)
- §D (enable trigger, merge) → Task 8 ✓

**Gap found in self-review:** the spec's §C also calls for deleting the
`aolausoro` database via `mongosh`, but no task above does it. Fixing: add it
as Task 9, after the merge, since it's genuinely last-priority (the db is
inert now that the app never reads it) and independent of everything else —
no reason to gate the merge on it.

### Task 9: Delete the `aolausoro` database [owner]

- [ ] **Step 1:** Hand the owner (only after Task 8 is fully done — this db
is the final fallback and there's no reason to rush it):
```bash
mongosh "mongodb+srv://aolausoro:<pass>@cluster0.hdg3l.mongodb.net/aolausoro?retryWrites=true&w=majority" --eval 'db.dropDatabase()'
```
**Checkpoint:** owner confirms the command returned `{ ok: 1, dropped: 'aolausoro' }`.

- [ ] **Step 2:** Note it in a short follow-up commit to
`docs/deployment-plan.md` marking Phase 3 fully closed out, or fold it into
the Task 8 Step 6 handoff if that commit hasn't landed yet.

**Placeholder scan:** no TBDs; the `<pass>` in Task 9's `mongosh` command is
intentionally elided (a real password never belongs in a committed plan) —
the owner has it from `.env`/`.env.local`.

**Type consistency:** n/a (no shared interfaces between tasks beyond the
git history itself — Task 6 depends on Tasks 1–5's commits existing on the
branch, Task 7 depends on Task 6's checkpoint, Task 8 depends on 1–7).

**Known soft spot:** Task 6/7's checkpoints depend on the owner accurately
reporting curl output back — there's no way to verify the live site
programmatically from this environment. Each checkpoint names exactly what
string/status to look for so the report is unambiguous either way.
