# Handoff — 2026-09-12 — P3.3c: Production cutover complete — Phase 3 done

Branch: `main` (merged from `feature/refactor-portfolio` — `2a02ac5`).
Previous handoff: `handoff-aolausoro-2026-09-12-p3-3b.md`.

Spec: `docs/superpowers/specs/2026-09-12-p3-3c-deploy-infra-design.md`
Plan: `docs/superpowers/plans/2026-09-12-p3-3c-deploy-infra.md` (9 tasks, all done)

**This is the last P3.x sub-project. `portfolio.aolausoro.tech` is live on the
new Payload/Docker stack, and `feature/refactor-portfolio` is merged into
`main`.** Phase 3 (the Clerk/Prisma/Redux/inversify → Payload CMS migration)
is complete end-to-end: code, data, media, observability, and deploy.

## What happened

### Ground-truth surprise

The production host (`portfolio-webserver-vm-1`) turned out to be **already
serving the site live** via pm2 — not a fresh droplet as earlier phases
assumed. It's also a **Proxmox-hosted VM on a home/office network**, not a
DigitalOcean droplet — `docs/deployment-plan.md` has a correction note at the
top. This changed P3.3c from "provision a fresh box" into a live, staged
cutover with real downtime risk if sequenced wrong.

### The cutover (all owner-executed via SSH/dashboard, checkpointed)

1. Cloudflare Origin CA certificate issued and installed.
2. `ufw allow 443/tcp` + fail2ban installed — previously only 22/80 were open.
3. nginx got a second `server` block for 443, added _alongside_ the existing
   port-80 proxy (no redirect yet) — verified with a direct-to-origin `curl`
   bypassing Cloudflare.
4. **Router port-forwarding gap discovered**: the Virgin Media router only had
   `external 8080 → local 80` forwarded (not a standard `80→80`), and no rule
   at all for 443 — first Cloudflare attempt got a `522` (connection timeout).
   Fixed by adding direct `443→443` and `80→80` forwards to the VM's LAN IP
   (`192.168.0.129`, confirmed via `ip -4 addr show` on `ens18` — a bridged
   Proxmox network, so the VM has its own real LAN address).
5. Cloudflare **Configuration Rule** (`Porfolio Config rule`) created — SSL/TLS
   → Full (strict), scoped to `portfolio.aolausoro.tech` only, **not** the
   zone default (the owner has other, differently-hosted domains on the same
   zone that this must not touch).
6. nginx port-80 block switched to a redirect once 443 was proven working.
7. First `workflow_dispatch` deploy — hit two real, sequential blockers:
   - `mkdir: /opt/aolausoro: Permission denied` — the runner's user
     (`nucternal18`, not `aolausoro`) had no rights under `/opt`.
     `setup-droplet.sh` does this for a fresh droplet; done manually here.
   - `failed to bind host port 127.0.0.1:3000/tcp: address already in use` —
     pm2's `portfolio-client` still held port 3000. The plan had assumed the
     new container could be health-checked _before_ touching pm2; that's
     never actually possible since they share a port. Ruling, confirmed with
     the owner: `pm2 stop` (not delete) to free the port, redeploy, verify,
     _then_ `pm2 delete` — accepting a brief real-downtime window instead.
8. With pm2 stopped, the deploy got further but the container's **health
   check failed** — `querySrv ECONNREFUSED _mongodb._tcp.cluster0.hdg3l.mongodb.net`.
   The container can't resolve Atlas's SRV DNS record on this host (Docker
   networking/DNS quirk — the same class of problem this whole migration hit
   in the sandbox). **The site was down at this point** (pm2 stopped, new
   container unhealthy). Fixed by switching the `DATABASE_URL` GH secret from
   `mongodb+srv://` to the direct multi-host connection string, then
   redeploying — this time it went healthy immediately.
9. Confirmed via `curl` (both `/api/health` → `{"status":"ok"}` and the
   homepage showing `SteppingStonesapp`, a real migrated project) that the
   new site was live and correct, _then_ `pm2 delete portfolio-client` +
   `pm2 save` + removed the old build directory.
10. Enabled the push-to-`main` trigger, ran full local verification, merged
    `feature/refactor-portfolio` → `main` (one conflict, on
    `deploy-production.yml` itself — resolved by taking the feature branch's
    fully-fixed version; a narrow prior commit had put an early copy directly
    on `main` to unblock `workflow_dispatch` registration — see below).
11. Pushed to `main` — **the push-triggered deploy ran and succeeded**,
    proving the full pipeline (build → push → rollout → health check) works
    unattended.

### A GitHub Actions quirk worth remembering

`gh workflow run <file>.yml` (and the Actions API generally) only recognizes
workflows that exist **on the default branch**. `deploy-production.yml` had
only ever lived on `feature/refactor-portfolio`, so it was completely
invisible to `workflow_dispatch` (`HTTP 404: workflow ... not found on the
default branch`) until a narrow, owner-approved commit
(`8dd8e3e chore(ci): add deploy-production.yml`) put just that one file on
`main` ahead of the real merge — the push-to-`main` trigger stayed commented
out in that commit, so nothing on `main` could auto-deploy from it. The real
merge later replaced it with the fully up-to-date version.

`ci.yml`'s very first invocation (also never having run before — it only
triggers on push-to-`main`/PRs) hit a `startup_failure` with zero jobs
scheduled on the merge push. Looked like the same "GitHub hasn't finished
registering a workflow that just landed" class of issue. **Check
`gh run list --repo nucternal18/aolausoro.tech-2 --branch main` after reading
this** — it should show a clean `CI` run on this handoff's own docs commit;
if not, that's the one loose end to chase.

## Verified

- `tsc` 0, `test:int` 24/24, `build` green — on `main`, post-merge.
- `portfolio.aolausoro.tech` serves the new site over HTTPS with a valid
  Cloudflare Origin CA cert; `/api/health` returns `{"status":"ok"}`.
- pm2 fully decommissioned (`pm2 list` empty).
- Push-to-`main` → automatic deploy confirmed working (the merge push itself
  triggered and completed a successful `Deploy Production` run).

## Loose ends / next things to look at

- **Confirm `ci.yml` is green on its next `main` run** (see above).
- **`legacyId` fields**: dropped from the six collections in P3.3c Task 2 —
  done. `payload/scripts/migrate-legacy-data.ts` keeps its own references as
  frozen historical record (never re-run; one `as never` cast where the
  removed field made it a type error).
- **`aolausoro` database**: per the plan's Task 9, deletion is deliberately
  last-priority and not yet done — it's inert now that nothing reads it. Run
  when convenient:
  ```bash
  mongosh "mongodb+srv://aolausoro:<pass>@cluster0.hdg3l.mongodb.net/aolausoro?retryWrites=true&w=majority" --eval 'db.dropDatabase()'
  ```
- **`portfolio_migration_dryrun` scratch DB** (from P3.2b) — still needs
  dropping from the Atlas UI (the API user lacks `dropDatabase`).
- **Lint debt (follow-up f in deployment-plan.md)** — ~19 pre-existing eslint
  errors, non-blocking, unrelated to this migration. Worth a dedicated pass
  sometime.
- **`setup-droplet.sh` hardening (follow-ups a/b)** — sudo+docker group scope
  and unverified-download pinning. Only matters for a _future_ fresh host;
  this one was configured manually and those don't apply retroactively.
- **`feature/refactor-portfolio`** — merged, not deleted. Delete whenever
  confidence is high; nothing depends on it continuing to exist.

## Constraints (unchanged, now largely moot post-merge)

- `.env`/`.env.local` are gitignored, hold real credentials — never commit.
- MongoDB MCP `drop-database`/`delete-many` are denied — the owner runs those.
- Commits `--no-verify` with the `Co-Authored-By` + `Claude-Session` trailers
  (one merge commit in this session briefly forgot `--no-verify` and got
  blocked by husky/lint-staged on the ~19 pre-existing lint issues — redone
  correctly; worth remembering for any future merge commit on this repo).
