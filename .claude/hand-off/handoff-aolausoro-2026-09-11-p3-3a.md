# Handoff — 2026-09-11 — P3.3a: Media on DO Spaces + Cloudinary removed

Branch: `feature/refactor-portfolio` (origin). Not merged to `main`.
Previous handoff: `handoff-aolausoro-2026-09-10-p3-2b.md`.

Spec: `docs/superpowers/specs/2026-09-10-p3-3a-media-spaces-design.md`
Plan: `docs/superpowers/plans/2026-09-10-p3-3a-media-spaces.md` (6 tasks, all done)
Commits: `e4a20d0..HEAD`.

## What landed

- **`s3Storage` plugin** (`plugins/index.ts`, first in the array) backs the
  `media` and `cvs` collections with the DO Spaces bucket `aolausorotech`
  (region `lon1`, CDN enabled). Reads served from
  `https://aolausorotech.lon1.cdn.digitaloceanspaces.com/<prefix>/<file>`
  (`media/`, `cvs/` prefixes). `disableLocalStorage` defaults on — local
  `public/media` / `public/cvs` are no longer written.
- **Schema** — final shapes:
  - `Wiki.image` (`upload → media`), replaces the P3.2b `imageUrl` text field
  - `Projects.screenshot` (`upload → media`, **required**), replaces `url`
  - `CVs` is an `upload` collection again; `cvUrl` gone
- **Asset migration** (`payload/scripts/migrate-assets-to-spaces.ts`, run via
  `pnpm payload run`): fetched the 21 Cloudinary assets (host-validated,
  `redirect:'error'`, filename sanitized) → **19 media docs** (12 wiki + 7
  project images, each with Payload-generated `imageSizes`) + **2 CV PDFs**
  attached to the `cvs` docs. Idempotent (skips docs already linked). Verified:
  objects live on the CDN (HTTP 200), homepage renders the published project
  screenshot via `_next/image` from Spaces, **0 `res.cloudinary.com` refs** in
  the rendered HTML.
- **Cloudinary removed**: `cloudinary` dep, `lib/cloudinary.ts`, `lib/env.ts`
  (dead — only a type import, and its top-level `envSchema.parse` was a latent
  crash). `types/index.d.ts` lost the `ProcessEnv extends Env` augmentation →
  `components/contact-form.tsx` recaptcha `sitekey` now guards `?? ''`.
  `next.config.mjs` `remotePatterns` dropped `res.cloudinary.com` +
  `img.clerk.com` (kept `cdn.jsdelivr.net`, `source.unsplash.com`, the Spaces
  CDN conditional). `.env.example` Cloudinary block removed.

## Verified

- `pnpm exec tsc --noEmit` → 0
- `pnpm run test:int` → 24/24 (added `tests/int/media.int.spec.ts`,
  `tests/int/migration.int.spec.ts` +`guessMimeType`)
- `pnpm run build` → green, `.next/standalone/server.js` present, sitemap runs
- `pnpm exec prettier --check .` → clean
- Migration re-run → all skipped, exit 0 (idempotent)

## Environment

`.env` and `.env.local` now carry the full DO Spaces block:

```
DO_SPACES_KEY / DO_SPACES_SECRET       (real; the earlier "your-" prefix is fixed)
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://aolausorotech.lon1.cdn.digitaloceanspaces.com
DO_SPACES_BUCKET=aolausorotech
```

`.env.example` documents them.

## Still open

- **`res.cloudinary.com` remains in**: `deploy-production.yml` (build-arg +
  runtime `.env` block), `Dockerfile` (`NEXT_PUBLIC_CLOUDINARY_NAME` ARG/ENV),
  and the migration script's doc comment/host constant. The workflow + Dockerfile
  ones are **P3.3c**; the script one is correct (it's the source host).
- **`legacyId` fields** on projects/jobs/wiki/messages/cvs/users and the
  **`aolausoro` database** are still retained — dropped in P3.3c once the
  production deploy is verified.
- **P3.3b (Sentry)** — decision already made: **keep**. That sub-project just
  verifies the wiring post-migration and confirms DSN/org/project config.
- **P3.3c** — provision droplet / Cloudflare cert+DNS / self-hosted runner /
  GH secrets (owner does this against a runbook I write); enable the
  push-to-`main` trigger; strip Clerk + Cloudinary vars from
  `deploy-production.yml` and `Dockerfile`; drop `legacyId`; delete `aolausoro`;
  harden `setup-droplet.sh` (follow-ups a/b).

## Notes

- The Spaces bucket layout: `media/<filename>` + `media/<filename>-<WxH>.<ext>`
  derivatives; `cvs/<filename>.pdf`.
- `pnpm payload run <script> -- --flag` — the `--` is required for flags to
  reach the script (pnpm swallows them otherwise). This script takes no flags
  but `EXPECTED_DB=<name>` env overrides the `portfolio`-only target guard.
