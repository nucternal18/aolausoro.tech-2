# Design: Replicate `equilibrium` project config into `aolausoro.tech-2`

**Date:** 2026-09-06
**Branch:** `feature/refactor-portfolio`
**Status:** Draft — awaiting review

## Context

`aolausoro.tech-2` is a personal portfolio/CMS site being migrated from a
Clerk + Prisma + Redux + clean-architecture (`inversify` DI) stack onto Payload
CMS 3.x. The migration is in progress and not complete — code still imports
`@clerk/nextjs`, `@prisma/client`, `inversify`, and `@sentry/nextjs`.

`equilibrium` (`/Users/adewoyinoladipupo-usoro/devprojects/equilibrium`,
`github.com/EquilibriumStartupLab/equilibrium`) is a sibling project built from
the same Payload Website Template, already carrying a production-grade tooling,
CI/CD, and AI-agent scaffold. This spec replicates that scaffold here.

The WIP migration was checkpointed in commit `248757c` so this work lands as a
clean, separate diff.

## Goals

1. Match `equilibrium`'s **tooling and config conventions** (lint, format,
   editorconfig, npmrc, pnpm workspace, TS compiler options, scripts).
2. Swap the test stack from **jest + cypress** to **vitest + playwright**, as
   in `equilibrium`.
3. Replicate the **deploy model**: Docker image → GHCR → self-hosted runner on
   a DigitalOcean droplet + Nginx, with `ci.yml` / `deploy-staging.yml` /
   `deploy-production.yml` and a `deploy/` directory.
4. Establish the **AI-agent + docs folder structure**: `.claude/`, `.agents/`,
   `docs/`, `AGENT.md`, `CLAUDE.md`, `CONTEXT.md`, `skills-lock.json`.
5. Install the Payload agent skills (`payload`, `cms-migration`).
6. **Add** the dependencies `equilibrium` carries that this repo needs (Payload
   3.86, vitest, playwright, etc.) and align shared-package versions.
7. Adopt `equilibrium`'s Prettier config and reformat the entire repo once.

## Non-goals

- **Restructuring the app into `src/`.** `equilibrium` is `src/`-based; this
  repo keeps its app at the root. Moving it is a separate, large refactor.
- **Copying `equilibrium`'s domain content** (`CONTEXT.md` glossary, ADRs,
  collections). This repo gets its own.
- **Phase 3 (dependency prune).** Removing Clerk / Prisma / Redux / inversify /
  Sentry / tiptap / jest / cypress requires the migration code that still
  imports them to be finished first. This spec *scopes* the prune (§8) but does
  not execute it.

## Approach

Three phases, each its own commit(s):

| Phase | Scope | Status |
|---|---|---|
| **1. Checkpoint WIP** | Commit the in-progress migration as-is | ✅ done (`248757c`) |
| **2. Config + scaffold replication** | Everything in §1–§7 of this spec. Dependency **additions and version alignment only** — no removals. Build must stay green. | this spec |
| **3. Dependency prune** | §8. Executed later, together with finishing the migration. Own brainstorm. | scoped only |

Verification gate for Phase 2: `pnpm install`, `pnpm exec tsc --noEmit`, and
`pnpm run build` must all still succeed (build against a reachable local Mongo).

## Phase 2 — detailed file plan

### 2.1 Package manager & workspace

| File | Action |
|---|---|
| `.npmrc` | **Create.** `legacy-peer-deps=true` + `enable-pre-post-scripts=true` (verbatim from `equilibrium`). |
| `pnpm-workspace.yaml` | **Create.** `allowBuilds:` map — `esbuild`, `sharp`, `unrs-resolver`, plus this repo's existing built deps still in use: keep from current `onlyBuiltDependencies` those that remain (`@prisma/client`, `@prisma/engines`, `@sentry/cli`, `msw` stay until Phase 3). Keep `pnpm.onlyBuiltDependencies` in `package.json` in sync — pnpm 9/10 reads that; `allowBuilds` in the workspace file is the newer form the Dockerfile comment references. Set both. |
| `package.json` → `pnpm` block | Keep `onlyBuiltDependencies`. Drop `overrides` for `rollup-plugin-terser` / `source-map` / `rimraf` / `glob` only if nothing breaks; otherwise leave. Decide during implementation with `pnpm install` output. |

### 2.2 EditorConfig / Prettier

| File | Action |
|---|---|
| `.editorconfig` | **Create**, verbatim from `equilibrium` (2-space, LF, final newline, trim trailing ws). |
| `.prettierrc.json` | **Create**: `{ "singleQuote": true, "trailingComma": "all", "printWidth": 100, "semi": false }`. Note: drops `prettier-plugin-tailwindcss` from current implicit setup — re-add the plugin key (`"plugins": ["prettier-plugin-tailwindcss"]`) so Tailwind class sorting is retained. Keep `prettier-plugin-tailwindcss` in devDependencies. |
| `.prettierignore` | **Create** from `equilibrium` (payload-types, build, dist, node_modules, docs, tsconfig.json) + this repo's generated files: `payload-types.ts`, `types/payload-types.ts`, `prisma/generated/`, `pnpm-lock.yaml`. |
| whole repo | **Reformat once**: `pnpm exec prettier --write .` after the config lands. One large mechanical commit, isolated from logic changes. |

### 2.3 ESLint

Replace the legacy `.eslintrc.js` (which disables ~40 rules and is `next lint`
only — deprecated in Next 16) with `equilibrium`'s flat config.

| File | Action |
|---|---|
| `.eslintrc.js` | **Delete.** |
| `eslint.config.mjs` | **Create** from `equilibrium`: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` flat imports, the four `@typescript-eslint` warn-rules, and the `no-unused-vars` `^_` ignore pattern. `ignores`: `.next/`, `payload-types.ts`, `types/payload-types.ts`, `prisma/generated/`, `deploy/`. |
| devDeps | Drop `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-react`, `eslint-plugin-jest`, `eslint-plugin-testing-library`, `@tanstack/eslint-plugin-query`, `@payloadcms/eslint-config` (jest/testing-library plugins go with the test-stack swap; the rest are unused by the flat config). Keep `eslint`, `eslint-config-next`, `eslint-plugin-react-hooks` (pulled by core-web-vitals). |
| `package.json` scripts | `"lint": "cross-env NODE_OPTIONS=--no-deprecation eslint ."`, add `"lint:fix": "... eslint . --fix"`. |

Expect new lint errors to surface (the old config muted everything). Rules are
all `warn`, so this does not fail CI initially; triage in a follow-up.

### 2.4 TypeScript

Keep this repo's path-alias map (the app depends on `@components/*` etc.), but
align compiler-option style with `equilibrium`.

| Change | Detail |
|---|---|
| `moduleResolution` | `"Bundler"` → keep (both already use it). |
| `paths` | Keep existing aliases. Fix `@payload-config` to point at `./payload.config.ts` (already correct). Add `"@payload-config": ["./payload.config.ts"]` is present. Leave the rest. |
| `include` | Add `next-sitemap.config.cjs`, `redirects.ts`, `.next/dev/types/**/*.ts`; drop `.eslintrc.js`, `jest.config.js`, `cypress/...` entries. |
| `verbatimModuleSyntax` | Currently `true` here, absent in `equilibrium`. **Keep `true`** — it's stricter and the codebase already satisfies it. |
| `noUncheckedIndexedAccess` | Currently `true` here, absent in `equilibrium`. **Keep.** |

Net: minimal edits — mostly `include`/`exclude` cleanup tied to the test-stack
swap.

### 2.5 Test stack: jest + cypress → vitest + playwright

| File | Action |
|---|---|
| `jest.config.js`, `jest.setup.ts`, `tsconfig.jest.json` | **Delete.** |
| `cypress/`, `cypress.json` | **Delete.** |
| `vitest.config.mts` | **Create** from `equilibrium` (jsdom, `tsconfigPaths()`, `react()`, `setupFiles: ['./vitest.setup.ts']`, `include: ['tests/int/**/*.int.spec.ts']`). |
| `vitest.setup.ts` | **Create**: `import 'dotenv/config'`. |
| `test.env` | **Create**: `NODE_OPTIONS="--no-deprecation --no-experimental-strip-types"`. |
| `playwright.config.ts` | **Create** from `equilibrium` (`testDir: './tests/e2e'`, chromium project, `webServer: pnpm dev`). |
| `tests/` | **Create** `tests/int/`, `tests/e2e/`, `tests/helpers/` with placeholder specs mirroring `equilibrium`'s (`api.int.spec.ts`, `frontend.e2e.spec.ts`, `admin.e2e.spec.ts`, `helpers/login.ts`, `helpers/seedUser.ts`). Adapt to this repo's collections/routes or leave as `test.skip` stubs — decide in implementation. |
| existing `__tests__` / `*.test.tsx` | Inventory during implementation. Migrate trivially (jest globals → vitest are near-identical with `globals: true`) or move under `tests/int` and mark `skip` with a TODO. Not a goal to port all tests in this pass. |
| devDeps add | `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@playwright/test`, `tsx`, `cross-env` (also a runtime dep in `equilibrium` — put in deps). Keep `@testing-library/react`, `@testing-library/jest-dom` (works with vitest), `@testing-library/user-event`. |
| devDeps remove | `jest`, `babel-jest`, `ts-jest`, `@types/jest`, `jest-environment-jsdom` (if present), `cypress`, `identity-obj-proxy`, `react-test-renderer`, `whatwg-fetch`, `@testing-library/dom` (transitive). `msw` — keep for now (may be used by remaining tests); revisit Phase 3. |
| `package.json` scripts | Remove `test:ci`, `cypress`. Add `"test": "pnpm run test:int && pnpm run test:e2e"`, `"test:int": "cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts"`, `"test:e2e": "cross-env NODE_OPTIONS=\"--no-deprecation --import=tsx/esm\" playwright test --config=playwright.config.ts"`. |

### 2.6 Next.js / build config

| File | Action |
|---|---|
| `next.config.mjs` | **Edit, not replace** (this repo's config carries MDX + Sentry wiring that stays until Phase 3). Apply from `equilibrium`: `output: 'standalone'` (currently commented out — **enable**, required by the new Dockerfile), `reactStrictMode: true` (already), keep `withPayload(...)`. Merge the duplicated `experimental` key (bug: declared twice). Add `turbopack.root`. Leave Sentry + MDX wrappers in place. Update `images.remotePatterns` to add the DO Spaces CDN host pattern like `equilibrium` (keep existing hosts until Phase 3). |
| `redirects.ts` | **Create** from `equilibrium` (IE-incompatible redirect). Wire into `next.config.mjs` `redirects`. |
| `next-sitemap.config.js` → `next-sitemap.config.cjs` | **Rename + rewrite** from `equilibrium`'s `.cjs` (robots.txt policies, sitemap excludes for `pages-sitemap.xml` / `posts-sitemap.xml`, `additionalSitemaps`). Update `postbuild` script path. |
| `postcss.config.js` | **Replace** with `equilibrium`'s minimal `{ plugins: { '@tailwindcss/postcss': {} } }`. Drop `postcss-flexbugs-fixes`, `postcss-preset-env`, `postcss-simple-vars` deps (Tailwind v4 handles autoprefix/nesting). |
| `tailwind.config.js` → keep `.js` | This repo's Tailwind config is substantive (shadcn theme tokens, keyframes). **Keep it.** Optionally rename to `.mjs` for consistency and merge `equilibrium`'s `typography` extensions. Low priority. |
| `components.json` | **Align** `tailwind.config` key if renamed; keep this repo's aliases (`@/components` etc. differ from equilibrium's `@/utilities/ui` — keep ours). |
| `instrumentation.ts` | **Keep** (Sentry register hook) until Phase 3. |

### 2.7 Docker & deploy

| File | Action |
|---|---|
| `Dockerfile` | **Replace** with `equilibrium`'s multi-stage standalone build: `node:22-alpine` base, `deps` / `builder` / `runner` stages, non-root `nextjs` user, `COPY .next/standalone`. Add build args this repo needs: `NEXT_PUBLIC_SERVER_URL`, `DATABASE_URL`, `PAYLOAD_SECRET`, plus (until Phase 3) `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, Cloudinary public vars, `SENTRY_AUTH_TOKEN`. Drop `npx prisma generate` once Prisma is gone (Phase 3); keep for now. |
| `docker-compose.yml` | **Replace** with a local dev stack (`equilibrium` doesn't have a root one — it has `deploy/docker-compose.{staging,production}.yml`). Provide app + `mongo:latest` service for local Payload dev. |
| `deploy/docker-compose.staging.yml` | **Create** from `equilibrium`. Image `ghcr.io/nucternal18/aolausoro.tech-2:staging`, container `aolausoro-staging`, bind `127.0.0.1:3001:3000`, healthcheck against `/api/health`. |
| `deploy/docker-compose.production.yml` | **Create**. `127.0.0.1:3000:3000`, container `aolausoro-production`. |
| `deploy/nginx/staging.conf` | **Create** from `equilibrium`. `server_name staging.aolausoro.tech` (confirm subdomain in review), proxy to `127.0.0.1:3001`, Cloudflare Origin CA cert paths, `X-Forwarded-Proto`/`X-Forwarded-Host` set. |
| `deploy/nginx/production.conf` | **Create**. `server_name portfolio.aolausoro.tech` (current `homepage` in package.json), proxy to `127.0.0.1:3000`. |
| `deploy/scripts/setup-droplet.sh` | **Copy + adapt** `equilibrium`'s (rename Equilibrium→aolausoro, `/opt/aolausoro`, runner labels `staging`/`production`, domains). It's already adapted from `nucternal18/ttt-vps-scripts` — same author. |
| `.dockerignore` | **Review/expand** to match `equilibrium`'s exclusions. |

### 2.8 GitHub Actions

| File | Action |
|---|---|
| `.github/workflows/node.js.yml` | **Delete.** |
| `.github/workflows/ci.yml` | **Create** from `equilibrium`: runs on push + PR. Steps: pnpm setup, install `--frozen-lockfile`, `pnpm run lint`, `pnpm exec tsc --noEmit`, `pnpm run test:int` against a throwaway `mongo` service container, `pnpm run build` (with build-only env: `DATABASE_URL` → service, `PAYLOAD_SECRET` → dummy). Keep this repo's `HUSKY: 0`. Runner: `ubuntu-latest` (drop `self-hosted` for CI). |
| `.github/workflows/deploy-staging.yml` | **Create** from `equilibrium`: push to `staging` → build+push image to GHCR (plain docker CLI, throwaway Mongo for build-time Payload init) → deploy job on self-hosted runner labeled `staging` (`docker compose pull && up -d`, health-check gate). |
| `.github/workflows/deploy-production.yml` | **Create** from `equilibrium`: push to `main` → same shape, runner labeled `production`, `environment: production`. |
| branch note | This introduces a `staging` branch to the workflow. Document in `CLAUDE.md` / `docs/deployment-plan.md`. |

### 2.9 Dependencies — additions & alignment only (no removals in Phase 2)

**Align to `equilibrium` versions (pin exact where `equilibrium` pins exact):**

- `@payloadcms/*` and `payload`: `^3.65.0` → `3.86.0` (all: admin-bar, db-mongodb,
  email-resend, live-preview-react, next, plugin-form-builder, plugin-nested-docs,
  plugin-redirects, plugin-search, plugin-seo, richtext-lexical, ui).
- `next`: `16.0.10` → `16.2.6`; `eslint-config-next`: `16.2.6`.
- `react` / `react-dom`: `^19.2.0` → `19.2.6`.
- `@types/react` `19.2.14`, `@types/react-dom` `19.2.3`, `@types/node` `22.19.9`
  (this repo is on `@types/node@^24` — align down to 22 to match `engines` /
  `equilibrium`, or keep 24; decide in review).
- `typescript`: align to `5.7.3` (this repo `^5.9.3` — keep newer unless it
  breaks; TS is backward-compatible enough).

**Add (present in `equilibrium`, needed here):**

- deps: `@payloadcms/storage-s3@3.86.0` (this repo's `plugins/index.ts` will need
  S3 storage for the Phase-3 Cloudinary→Spaces move; add now so the plugin file
  can be written), `@payloadcms/plugin-form-builder` (have), `payload-totp@3.0.1`
  (if adopting TOTP admin auth — **optional, confirm in review**), `cross-env`,
  `geist` (optional — only if adopting equilibrium's font setup; this repo has
  its own `fonts/`), `graphql` (have).
- devDeps: `@playwright/test@1.58.2`, `vitest@^4`, `@vitejs/plugin-react@4.5.2`,
  `vite-tsconfig-paths@6.0.5`, `jsdom@^28`, `tsx@4.22.4`, `@tailwindcss/postcss`
  (have), `@tailwindcss/typography` (have), `tw-animate-css` (have).

**Keep untouched in Phase 2** (removed in Phase 3): everything Clerk / Prisma /
Redux / RTK Query / inversify / Sentry / tiptap / tremor / contentlayer /
next-auth / next-pwa / cloudinary / axios / moment / jest / cypress.

**`update-dep.sh`** at repo root: **delete** (obsolete bulk-upgrade script,
superseded by explicit version management).

### 2.10 `.gitignore`

Merge `equilibrium`'s entries into this repo's (keep this repo's Sentry / PWA /
firebase-adminsdk / `yarn.lock` lines until Phase 3):

- add: `.env.*.local`, `/test-results/`, `/playwright-report/`, `/blob-report/`,
  `/playwright/.cache/`, `*.tsbuildinfo` (this repo commits `tsconfig.tsbuildinfo`
  — **untrack it**), `generated-schema.graphql`, `next-env.d.ts`.
- `deploy/scripts/` one-off migration script ignore line, if such a script is
  added.

### 2.11 Misc root files

| File | Action |
|---|---|
| `.vscode/settings.json` | **Replace** with `equilibrium`'s (already nearly identical — the WIP commit modified it). |
| `.vscode/extensions.json` | **Create**: `{ "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"] }`. |
| `README.md` | **Rewrite** — brief project description, stack, `pnpm` commands, pointer to `AGENT.md` / `CLAUDE.md` / `docs/`. Don't copy `equilibrium`'s Payload-template boilerplate wholesale. |
| `.env.example` | **Create** — this repo has none. Document every key from `.env` / `.env.local` with placeholder values: `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SERVER_URL`, `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`, DO Spaces block, recaptcha keys, and (until Phase 3) Clerk + Cloudinary + Sentry keys. Mark the Phase-3-transitional ones with a comment. |
| `PAYLOAD_CMS_INTEGRATION.md` | **Move** to `docs/payload-cms-integration.md`. |

### 2.12 Package.json scripts — final shape

```jsonc
{
  "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
  "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
  "postbuild": "next-sitemap --config next-sitemap.config.cjs",
  "start": "cross-env NODE_OPTIONS=--no-deprecation next start",
  "lint": "cross-env NODE_OPTIONS=--no-deprecation eslint .",
  "lint:fix": "cross-env NODE_OPTIONS=--no-deprecation eslint . --fix",
  "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
  "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
  "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
  "test": "pnpm run test:int && pnpm run test:e2e",
  "test:int": "cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts",
  "test:e2e": "cross-env NODE_OPTIONS=\"--no-deprecation --import=tsx/esm\" playwright test --config=playwright.config.ts",
  "reinstall": "cross-env NODE_OPTIONS=--no-deprecation rm -rf node_modules && rm pnpm-lock.yaml && pnpm --ignore-workspace install",
  "prepare": "husky",
  "lint-staged": "lint-staged"
}
```

Keep `generate` (prisma) until Phase 3. Keep husky + lint-staged.

### 2.13 Husky / lint-staged

- `.husky/pre-commit`: update to modern husky v9 form (drop the deprecated
  `. "$(dirname "$0")/_/husky.sh"` line — the WIP is on husky `^9`).
- `lint-staged` config in `package.json`: align to `equilibrium`'s pattern
  `{ "*.(tsx|ts)": "eslint --fix", "*": "prettier --write --ignore-unknown" }`.

## Phase 2 — AI-agent & docs scaffold

### 3.1 Folder structure created

```
.claude/
  hand-off/
    HANDOFF.md                    # session-to-session state, seeded
    handoff-aolausoro-2026-09-06.md
  skills/
    payload -> ../../.agents/skills/payload          # symlink
    cms-migration -> ../../.agents/skills/cms-migration   # symlink
    health-check/
      SKILL.md                    # adapted: drop Python/monorepo checks
      scripts/check.sh
.agents/
  skills/
    payload/         # from payloadcms/skills @ pinned hash
    cms-migration/   # from payloadcms/skills @ pinned hash
docs/
  agents/
    domain.md         # ~verbatim from equilibrium
    issue-tracker.md  # adapted: repo = nucternal18/aolausoro.tech-2
  adr/
    .gitkeep          # created lazily by /domain-modeling
  deployment-plan.md  # adapted for aolausoro infra
  payload-cms-integration.md   # moved from root
  superpowers/
    specs/
      2026-09-06-equilibrium-config-replication-design.md   # this file
AGENT.md
CLAUDE.md
CONTEXT.md
skills-lock.json
```

### 3.2 `skills-lock.json`

Copy `equilibrium`'s structure. Same two skills, same source
(`payloadcms/skills`, `github`), same `skillPath`s. Recompute `computedHash`
from the actual pulled files (or copy `equilibrium`'s hashes if pulling the same
revision — verify).

### 3.3 Installing the skills

`equilibrium`'s `.agents/skills/{payload,cms-migration}` contain the full skill
trees (`SKILL.md` + `reference/`). Two options, decide in implementation:

1. **Copy from `equilibrium`** (`cp -R ../equilibrium/.agents/skills/payload
   .agents/skills/`). Fastest, guaranteed identical to the sibling project.
2. **Pull fresh** from `github.com/payloadcms/skills` at the revision recorded
   in `equilibrium/skills-lock.json`, then recompute hashes.

Recommend **option 1** for exact parity, then verify `skills-lock.json` hashes
match. Then recreate the `.claude/skills/*` symlinks.

### 3.4 `AGENT.md`

Adapt `equilibrium`'s. Sections: one-line stack description (Payload CMS +
Next.js App Router, MongoDB, `pnpm`), pointer to `CLAUDE.md` + `docs/`, **Handoff
Protocol** (identical mechanism, path `.claude/hand-off/handoff-aolausoro-<YYYY-MM-DD>.md`),
**Commands** (the §2.12 script list with one-liner explanations), **Deployment**
(pointer to `docs/deployment-plan.md`; note `staging` branch), **Conventions**
(env vars in `.env.example`, `.env.local` gitignored, secrets only on target
host). Write per the `writing-for-agents` skill.

### 3.5 `CLAUDE.md`

Adapt `equilibrium`'s. Sections: stack line + **note that the Clerk/Prisma/Redux
→ Payload migration is in progress** (link this spec + `docs/payload-cms-integration.md`),
Handoff Protocol pointer, Deployment pointer, **Agent skills** (issue tracker =
GitHub Issues on `nucternal18/aolausoro.tech-2` via `gh`; domain docs =
`CONTEXT.md` + `docs/adr/`), pointer to `.agents/skills/payload/SKILL.md`.
Keep it short — it's an index, per `writing-for-agents`.

### 3.6 `CONTEXT.md`

New domain glossary for the portfolio's own concepts. Seed from the Payload
collections that exist: **Project**, **Job**, **Message**, **Wiki**, **Issue**,
**Post**, **Page**, **Media**, **User**. One paragraph each + `_Avoid_:` synonym
list. Keep minimal — `/domain-modeling` grows it.

### 3.7 `docs/agents/*`

- `domain.md`: copy from `equilibrium` verbatim (it's project-agnostic).
- `issue-tracker.md`: copy, change repo references to
  `nucternal18/aolausoro.tech-2`, keep the `gh` CLI conventions and the
  wayfinder section.

### 3.8 `docs/deployment-plan.md`

Adapt `equilibrium`'s. Same architecture (Cloudflare → DO firewall → droplet →
Nginx → app container → MongoDB Atlas), same key decisions table, this repo's
domains (`portfolio.aolausoro.tech` prod, `staging.aolausoro.tech` staging —
confirm). Implementation-status table starts mostly ⬜. Note the migration from
the current `pm2` + `pnpm build` deploy to the Docker/GHCR model.

### 3.9 `.claude/skills/health-check/SKILL.md`

Adapt: this is a single Next.js app, not a Python monorepo. Keep checks:
`pnpm audit --audit-level=high`, `pnpm outdated`, `pnpm run lint`,
`pnpm exec tsc --noEmit`, `pnpm run test:int`. Drop `uv` / `pip-audit` /
`ruff` / `check-types` (rename to `tsc --noEmit`). Rewrite `scripts/check.sh`
accordingly.

## Phase 3 — Dependency prune (SCOPED ONLY, NOT EXECUTED)

Prerequisite: the migration code no longer imports these. Each removal paired
with deleting/rewriting the importing code, verified by `tsc --noEmit` + `build`.

**Remove (deps):** `@auth/prisma-adapter`, `@clerk/nextjs`, `@next-auth/prisma-adapter`,
`next-auth`, `@prisma/client`, `@reduxjs/toolkit`, `react-redux`,
`next-redux-wrapper`, `inversify`, `@tanstack/react-query`,
`@tanstack/react-query-devtools`, `@tremor/react`, `contentlayer`, `@tiptap/*`
(9 packages — replaced by Payload Lexical), `@sentry/nextjs` (if dropping Sentry;
**confirm — user may want to keep observability**), `next-pwa`, `cloudinary`
(→ `@payloadcms/storage-s3`), `axios`, `bcryptjs`, `jsonwebtoken`, `svix`,
`cookie`, `nookies`, `set-cookie-parser`, `moment`, `mongodb` (direct — Payload
owns the driver), `express`, `@react-email/*` + `react-email` (if contact form
moves to Payload form-builder), `swr`, `next-mdx-remote` (if blog moves to
Payload), `patch-package` + `postinstall`.

**Remove (devDeps):** `prisma`, `@fullhuman/postcss-purgecss`,
`postcss-flexbugs-fixes`, `postcss-preset-env`, `postcss-simple-vars`,
`@tailwindcss/aspect-ratio`, `@tailwindcss/line-clamp` (dep), `msw`,
`@types/nodemailer`, `@types/js-cookie`, `@types/set-cookie-parser`,
`@types/react-draft-wysiwyg`, `@types/styled-components`, `baseline-browser-mapping`.

**Remove (files):** `prisma/`, `prisma.config.ts`, `lib/prismadb.ts`,
`lib/prisma.ts`, `payload/access/clerk-auth.ts`, `payload/hooks/sync-prisma.ts`,
`src/di/`, `sentry.*.config.ts` (if dropping Sentry), `instrumentation.ts`
(if dropping Sentry), `next.config.mjs` Sentry wrapper.

**Config follow-ups:** remove Clerk/Cloudinary/Sentry/Prisma vars from
`.env.example`, `Dockerfile` build args, `ci.yml`; drop `npx prisma generate`
from Dockerfile; remove `serverExternalPackages: ['@prisma/client', 'bcryptjs']`
from `next.config.mjs`; prune `pnpm.onlyBuiltDependencies`.

Phase 3 gets its own brainstorm — it's "finish the Payload migration," not a
config task.

## Testing & verification (Phase 2 gate)

Run after each logical commit, all must pass:

1. `pnpm install` — clean, no peer-dep hard failures, lockfile updates committed.
2. `pnpm exec tsc --noEmit` — no new type errors vs. the `248757c` baseline.
3. `pnpm run build` — succeeds against a reachable local Mongo
   (`docker compose up mongo` or Atlas dev URI in `.env`).
4. `pnpm run lint` — runs (warnings acceptable; no crash).
5. `pnpm run test:int` — the placeholder int spec passes/ skips cleanly.
6. `pnpm exec prettier --check .` — clean after the reformat commit.
7. `docker build .` — the new Dockerfile builds (may defer if no local Docker).
8. `nginx -t` on the `deploy/nginx/*.conf` (syntax) — defer to a container check
   if nginx not local.
9. `docker compose config` on `deploy/docker-compose.*.yml` — valid.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Payload `3.65 → 3.86` has breaking changes (config API, plugin signatures). | Read Payload 3.66–3.86 changelog / migration notes via context7 before bumping. Bump in its own commit; `tsc` + `build` gate. |
| `output: 'standalone'` + `withSentryConfig` + `withPayload` + `withMDX` wrapper order breaks the build. | Test build immediately after enabling. Sentry's wrapper must stay outermost. |
| Prettier reformat creates a 500-file diff that buries real changes. | Isolated commit, nothing else in it. Done right after the config file lands. |
| Flat ESLint config surfaces hundreds of warnings. | All rules `warn`, CI non-blocking. Separate triage task, not this spec. |
| `equilibrium`'s skills pinned to an old `payloadcms/skills` revision. | Copy from `equilibrium` for parity (option 1, §3.3); note the revision; upgrade later. |
| Deploy workflows reference infra (droplet, GHCR, runner) that doesn't exist yet. | `docs/deployment-plan.md` status table marks it all ⬜. Workflows are inert until a `staging` branch is pushed / runner registered. |
| `@types/node` 24 → 22 downgrade breaks something. | Keep 24 unless it conflicts; `equilibrium` parity isn't worth a regression here. |
| Test migration: existing jest tests silently dropped. | Inventory `__tests__` in implementation; move-and-skip with TODOs rather than delete. |

## Open questions for review

1. **Domains** — confirm `portfolio.aolausoro.tech` (production) and
   `staging.aolausoro.tech` (staging) for the Nginx configs and deployment plan.
   Current `package.json` `homepage` is `https://portfolio.aolausoro.tech`.
2. **`payload-totp`** — adopt TOTP-enforced admin auth like `equilibrium`, or
   keep it out for now?
3. **Sentry** — keep it through Phase 2 (planned) and decide its fate in Phase 3,
   or is dropping it already decided?
4. **`@types/node`** — align down to 22 for `equilibrium` parity, or keep 24?
5. **GHCR image path** — `ghcr.io/nucternal18/aolausoro.tech-2` — confirm the
   org/name (repo is under `nucternal18`).
6. **Test porting** — acceptable to move existing jest tests to `tests/int` as
   `describe.skip` with TODOs rather than fully port them in this pass?
