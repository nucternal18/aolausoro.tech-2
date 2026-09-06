# Equilibrium Config Replication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the `equilibrium` project's tooling, CI/CD, deploy model, and AI-agent/docs scaffold into `aolausoro.tech-2` (Phase 2 of the spec — config + scaffold + dependency additions only, no dependency removals).

**Architecture:** `aolausoro.tech-2` is a Payload CMS + Next.js (App Router) site mid-migration off a Clerk + Prisma + Redux stack. `equilibrium` (`/Users/adewoyinoladipupo-usoro/devprojects/equilibrium`) is a sibling built from the same Payload Website Template with a production-grade scaffold already in place. This plan copies that scaffold — package-manager config, Prettier, flat ESLint, vitest+playwright, a standalone Docker/GHCR/self-hosted-runner deploy, and `.claude/`+`.agents/`+`docs/` agent infrastructure — adapting names, domains, and paths. The app's root-level layout is kept as-is (not moved to `src/`).

**Tech Stack:** Next.js 16.2.6, React 19.2.6, Payload CMS 3.86.0, MongoDB, pnpm, TypeScript 5.9, Vitest 4, Playwright 1.58, Docker (standalone output), GitHub Actions, Nginx, DigitalOcean.

**Spec:** `docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`

## Global Constraints

- **Package manager:** `pnpm` only. Every `package.json` script that runs a Node binary is prefixed `cross-env NODE_OPTIONS=--no-deprecation`.
- **No dependency removals in this plan.** Clerk / Prisma / Redux / inversify / Sentry / tiptap / tremor / contentlayer / next-auth / next-pwa / cloudinary / axios / moment stay in `package.json`. Removing them is Phase 3 (separate spec).
- **Build must stay green.** After every task that touches `package.json`, `tsconfig.json`, `next.config.mjs`, or `payload.config.ts`: `pnpm exec tsc --noEmit` and `pnpm run build` must pass against a reachable local MongoDB. Baseline commit is `248757c`.
- **Production only.** One domain: `portfolio.aolausoro.tech`. No staging environment, branch, workflow, nginx config, or compose file.
- **Versions (exact pins where equilibrium pins exact):** `payload` and all `@payloadcms/*` → `3.86.0`; `next` → `16.2.6`; `eslint-config-next` → `16.2.6`; `react`/`react-dom` → `19.2.6`; `@types/react` → `19.2.14`; `@types/react-dom` → `19.2.3`.
- **Keep:** `@types/node@^24`, `typescript@^5.9.3` (newer than equilibrium — do not downgrade).
- **GHCR image:** `ghcr.io/nucternal18/aolausoro.tech-2`.
- **Prettier:** `singleQuote: true`, `semi: false`, `printWidth: 100`, `trailingComma: "all"`, plus `prettier-plugin-tailwindcss`.
- **Commit trailers:** every commit message ends with:
  ```

  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
  ```
- **Reference repo path:** `/Users/adewoyinoladipupo-usoro/devprojects/equilibrium` (referred to below as `$EQ`).
- **`--no-verify` on commits** during this plan (husky pre-commit runs lint-staged which may choke mid-migration; the CI `ci.yml` is the real gate).

---

## File Structure

**Created:**

```
.npmrc                              # pnpm: legacy-peer-deps + pre/post scripts
.editorconfig                       # 2-space, LF, final newline
.prettierrc.json                    # semi-free, single-quote, width 100
.prettierignore
pnpm-workspace.yaml                 # allowBuilds map
eslint.config.mjs                   # flat config (replaces .eslintrc.js)
redirects.ts                        # IE-incompatible redirect for next.config
next-sitemap.config.cjs             # replaces next-sitemap.config.js
vitest.config.mts
vitest.setup.ts
test.env
playwright.config.ts
tests/int/api.int.spec.ts
tests/e2e/frontend.e2e.spec.ts
tests/helpers/login.ts
app/api/health/route.ts             # health endpoint for deploy healthcheck
.vscode/extensions.json
.env.example
Dockerfile                          # replaced (multi-stage standalone)
docker-compose.yml                  # replaced (local dev: app + mongo)
deploy/docker-compose.production.yml
deploy/nginx/production.conf
deploy/scripts/setup-droplet.sh
.github/workflows/ci.yml            # replaces node.js.yml
.github/workflows/deploy-production.yml
.agents/skills/payload/**           # copied from $EQ
.agents/skills/cms-migration/**     # copied from $EQ
.claude/skills/payload              # symlink -> ../../.agents/skills/payload
.claude/skills/cms-migration        # symlink -> ../../.agents/skills/cms-migration
.claude/skills/health-check/SKILL.md
.claude/skills/health-check/scripts/check.sh
.claude/hand-off/HANDOFF.md
.claude/hand-off/handoff-aolausoro-2026-09-06.md
skills-lock.json
AGENT.md
CLAUDE.md
CONTEXT.md
docs/agents/domain.md
docs/agents/issue-tracker.md
docs/deployment-plan.md
docs/adr/.gitkeep
docs/payload-cms-integration.md     # moved from repo root
```

**Modified:** `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.js`, `.gitignore`, `.husky/pre-commit`, `README.md`, `.vscode/settings.json`.

**Deleted:** `.eslintrc.js`, `jest.config.js`, `jest.setup.ts`, `tsconfig.jest.json`, `cypress.json`, `cypress/` (whole tree), `next-sitemap.config.js`, `update-dep.sh`, `PAYLOAD_CMS_INTEGRATION.md` (moved).

**Untracked (git rm --cached, keep on disk):** `tsconfig.tsbuildinfo`.

---

## Task 1: Package-manager & editor config

**Files:**
- Create: `.npmrc`, `.editorconfig`, `pnpm-workspace.yaml`, `.vscode/extensions.json`
- Modify: `.vscode/settings.json`

**Interfaces:**
- Produces: `.npmrc` with `legacy-peer-deps=true` (later tasks' `pnpm install` relies on this to resolve the React 19 / peer-dep graph).

- [ ] **Step 1: Create `.npmrc`**

```
legacy-peer-deps=true
enable-pre-post-scripts=true
```

- [ ] **Step 2: Create `.editorconfig`**

```
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf
max_line_length = null
```

- [ ] **Step 3: Create `pnpm-workspace.yaml`**

Mirrors equilibrium's `allowBuilds`, plus this repo's still-needed native builds (kept until Phase 3). This is the newer form; `package.json`'s `pnpm.onlyBuiltDependencies` (kept in sync in Task 4) is the pnpm 9/10 form.

```yaml
allowBuilds:
  esbuild: true
  sharp: true
  unrs-resolver: true
  '@prisma/client': true
  '@prisma/engines': true
  prisma: true
  '@sentry/cli': true
  '@clerk/shared': true
  msw: true
  cypress: true
```

- [ ] **Step 4: Create `.vscode/extensions.json`**

```json
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```

- [ ] **Step 5: Overwrite `.vscode/settings.json`** with equilibrium's exact content

Copy verbatim:

```bash
cp /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/.vscode/settings.json .vscode/settings.json
```

- [ ] **Step 6: Verify pnpm still resolves**

Run: `pnpm install --lockfile-only`
Expected: completes without error; `pnpm-lock.yaml` may change slightly (settings). If `ERR_PNPM_IGNORED_BUILDS` appears, add the named package to both `pnpm-workspace.yaml` `allowBuilds` and (Task 4) `onlyBuiltDependencies`.

- [ ] **Step 7: Commit**

```bash
git add .npmrc .editorconfig pnpm-workspace.yaml .vscode/ pnpm-lock.yaml
git commit --no-verify -m "$(cat <<'EOF'
chore: add pnpm workspace, npmrc, and editorconfig

Replicated from the equilibrium project: .npmrc (legacy-peer-deps +
pre/post scripts), .editorconfig (2-space/LF), pnpm-workspace.yaml
allowBuilds map, and the shared VS Code settings/extensions.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 2: Prettier config + one-time repo reformat

**Files:**
- Create: `.prettierrc.json`, `.prettierignore`
- Modify: every source file (mechanical reformat, isolated commit)

**Interfaces:**
- Consumes: nothing.
- Produces: repo-wide Prettier formatting that Task 9's `ci.yml` does **not** yet enforce (no `prettier --check` step added — out of scope), but that `lint-staged` (Task 3) applies to touched files.

- [ ] **Step 1: Confirm `prettier` and `prettier-plugin-tailwindcss` are already deps**

Run: `node -e "const p=require('./package.json');console.log(p.devDependencies.prettier, p.devDependencies['prettier-plugin-tailwindcss'])"`
Expected: prints two version strings (both are in `devDependencies` today). If either is missing, add in Task 4.

- [ ] **Step 2: Create `.prettierrc.json`**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Create `.prettierignore`**

```
**/payload-types.ts
types/payload-types.ts
payload-types.ts
generated-schema.graphql
prisma/generated/
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/docs/**
**/.next/**
pnpm-lock.yaml
tsconfig.json
tsconfig.tsbuildinfo
public/
cypress/
```

- [ ] **Step 4: Commit the config alone**

```bash
git add .prettierrc.json .prettierignore
git commit --no-verify -m "$(cat <<'EOF'
chore: adopt equilibrium prettier config (semi-free, single-quote, w100)

Config only; the repo-wide reformat is the next commit so it stays
isolated from any logic change.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

- [ ] **Step 5: Run the reformat**

Run: `pnpm exec prettier --write .`
Expected: rewrites hundreds of files. No errors. (Warnings about unparseable files are acceptable if they are in `.prettierignore` targets.)

- [ ] **Step 6: Verify clean**

Run: `pnpm exec prettier --check .`
Expected: `All matched files use Prettier code style!`

- [ ] **Step 7: Sanity-check the build still compiles**

Run: `pnpm exec tsc --noEmit`
Expected: same result as the `248757c` baseline (no *new* errors introduced by reformatting — Prettier does not change semantics). If new errors appear, inspect the diff for an ASI (automatic-semicolon-insertion) hazard introduced by `semi: false` and fix by hand.

- [ ] **Step 8: Commit the reformat**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
style: reformat entire repo with the new prettier config

Mechanical `prettier --write .` pass. No logic changes.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 3: Flat ESLint config

**Files:**
- Delete: `.eslintrc.js`
- Create: `eslint.config.mjs`
- Modify: `package.json` (scripts, `lint-staged`, remove dead eslint devDeps), `.husky/pre-commit`

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm run lint` = `eslint .` (flat config). Task 9's `ci.yml` calls `pnpm run lint`.

- [ ] **Step 1: Delete the legacy config**

```bash
git rm .eslintrc.js
```

- [ ] **Step 2: Create `eslint.config.mjs`**

```js
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: [
      '.next/',
      'payload-types.ts',
      'types/payload-types.ts',
      'generated-schema.graphql',
      'prisma/generated/',
      'deploy/',
      'cypress/',
      'coverage/',
    ],
  },
]

export default eslintConfig
```

- [ ] **Step 3: Update `package.json` scripts**

Set:
```jsonc
"lint": "cross-env NODE_OPTIONS=--no-deprecation eslint .",
"lint:fix": "cross-env NODE_OPTIONS=--no-deprecation eslint . --fix",
```
Remove: `"test:ci"`, `"cypress"`.

- [ ] **Step 4: Update `package.json` `lint-staged`**

Replace the `lint-staged` block with equilibrium's pattern:
```jsonc
"lint-staged": {
  "*.(ts|tsx)": "eslint --fix",
  "*": "prettier --write --ignore-unknown"
}
```

- [ ] **Step 5: Remove dead ESLint devDependencies from `package.json`**

Delete these keys from `devDependencies` (all superseded by `eslint-config-next` flat imports or tied to the removed jest/cypress stack):
`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-react`, `eslint-plugin-jest`, `eslint-plugin-testing-library`, `@tanstack/eslint-plugin-query`, `@payloadcms/eslint-config`.

Keep: `eslint`, `eslint-config-next`, `eslint-plugin-react-hooks`.

Bump: `eslint-config-next` → `16.2.6` (exact). Leave `eslint` at current `^9.39.0`.

- [ ] **Step 6: Modernize `.husky/pre-commit`** (husky v9 form)

Overwrite `.husky/pre-commit` with:
```sh
pnpm exec lint-staged
```

- [ ] **Step 7: Install & verify lint runs**

Run: `pnpm install`
Then: `pnpm run lint`
Expected: ESLint executes and exits 0 **or** exits non-zero with rule *warnings/errors* (not a config crash). A crash like `Cannot find package 'eslint-config-next'` means the install didn't complete — re-run. Rule violations are expected (the old config muted ~40 rules) and are triaged separately, not in this plan.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
chore: replace legacy .eslintrc.js with flat eslint.config.mjs

Adopts equilibrium's flat config (eslint-config-next core-web-vitals +
typescript, four warn-level TS rules, ^_ unused-var ignores). Drops the
now-unused typescript-eslint/react/jest/testing-library eslint plugins
and the @payloadcms/eslint-config dep. lint script is now `eslint .`;
husky pre-commit uses the v9 form.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 4: Payload / Next / React version alignment

**Files:**
- Modify: `package.json` (dependency versions, `pnpm.onlyBuiltDependencies`)
- Regenerate: `pnpm-lock.yaml`, `payload-types.ts`

**Interfaces:**
- Consumes: `.npmrc` (Task 1).
- Produces: Payload 3.86 API surface for Task 7 (`getPayload`) and Task 8's Docker build.

**Before starting:** read the Payload changelog for breaking changes between 3.65 and 3.86 via context7 (`mcp__plugin_context7_context7__query-docs` for `payload` — "migration 3.65 to 3.86 breaking changes") or `https://github.com/payloadcms/payload/releases`. Note anything touching `buildConfig`, plugin signatures, or `@payloadcms/db-mongodb`.

- [ ] **Step 1: Set exact versions in `package.json` `dependencies`**

Change every one of these to `"3.86.0"` (drop the `^`):
`@payloadcms/admin-bar`, `@payloadcms/db-mongodb`, `@payloadcms/email-resend`, `@payloadcms/live-preview-react`, `@payloadcms/next`, `@payloadcms/plugin-form-builder`, `@payloadcms/plugin-nested-docs`, `@payloadcms/plugin-redirects`, `@payloadcms/plugin-search`, `@payloadcms/plugin-seo`, `@payloadcms/richtext-lexical`, `@payloadcms/ui`, `payload`.

Also set in `devDependencies`: `payload` → `"3.86.0"`.

- [ ] **Step 2: Set Next / React versions**

`dependencies`: `"next": "16.2.6"`, `"react": "19.2.6"`, `"react-dom": "19.2.6"`.
`devDependencies`: `"@types/react": "19.2.14"`, `"@types/react-dom": "19.2.3"`, `"eslint-config-next": "16.2.6"` (if not already set in Task 3).

Leave `@types/node` at `^24`, `typescript` at `^5.9.3`.

- [ ] **Step 3: Add the new runtime dependency**

`dependencies`: `"@payloadcms/storage-s3": "3.86.0"`, `"payload-totp": "3.0.1"`, `"cross-env": "^7.0.3"`.

- [ ] **Step 4: Keep `pnpm.onlyBuiltDependencies` in sync**

Ensure the `pnpm.onlyBuiltDependencies` array contains at least: `@clerk/shared`, `@prisma/client`, `@prisma/engines`, `@sentry/cli`, `cypress`, `esbuild`, `msw`, `prisma`, `sharp`, `unrs-resolver`. (These match `pnpm-workspace.yaml` from Task 1. `cypress` is removed in Task 5 — drop it from both then.)

- [ ] **Step 5: Install**

Run: `pnpm install`
Expected: resolves. Peer-dep *warnings* are fine (`.npmrc` sets `legacy-peer-deps`). A hard `ERESOLVE`-style failure needs investigation — capture the output.

- [ ] **Step 6: Regenerate Payload types**

Run: `pnpm exec cross-env NODE_OPTIONS=--no-deprecation payload generate:types`
(Requires `DATABASE_URL` + `PAYLOAD_SECRET` in `.env` pointing at a reachable Mongo. Start one first: `docker run -d -p 27017:27017 --name aolausoro-mongo mongo:latest` and set `DATABASE_URL=mongodb://127.0.0.1:27017/aolausoro` in `.env`.)
Expected: `payload-types.ts` regenerated, no error.

- [ ] **Step 7: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no *new* errors vs. the pre-Task-4 baseline. If Payload 3.86 changed a plugin signature (`plugins/index.ts`) or `buildConfig` shape (`payload.config.ts`), fix those files minimally per the changelog notes from "Before starting". Record each fix in the commit message.

- [ ] **Step 8: Build**

Run: `pnpm run build`
Expected: succeeds (Mongo from Step 6 still running). If `next build` fails inside `withSentryConfig`/`withPayload`/`withMDX` wrapping, that is a Task 6 concern — note it and continue; re-run build at the end of Task 6.

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-lock.yaml payload-types.ts plugins/index.ts payload.config.ts
git commit --no-verify -m "$(cat <<'EOF'
chore: align Payload 3.86, Next 16.2.6, React 19.2.6 with equilibrium

Payload + all @payloadcms/* pinned to 3.86.0 (from ^3.65.0). Next
16.0.10 -> 16.2.6, React 19.2.x -> 19.2.6, @types/react(-dom) pinned.
Adds @payloadcms/storage-s3, payload-totp, and cross-env. No removals.

<note any plugins/index.ts or payload.config.ts fixes forced by the bump>

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 5: Swap test stack — jest+cypress → vitest+playwright

**Files:**
- Delete: `jest.config.js`, `jest.setup.ts`, `tsconfig.jest.json`, `cypress.json`, `cypress/` (tree)
- Create: `vitest.config.mts`, `vitest.setup.ts`, `test.env`, `playwright.config.ts`, `tests/int/api.int.spec.ts`, `tests/e2e/frontend.e2e.spec.ts`, `tests/helpers/login.ts`
- Modify: `package.json` (scripts, deps), `tsconfig.json` (include/exclude), `.gitignore`

**Interfaces:**
- Consumes: `@payload-config` tsconfig path alias (already present: `"@payload-config": ["./payload.config.ts"]`).
- Produces: `pnpm run test:int` and `pnpm run test:e2e`. Task 9's `ci.yml` runs `test:int`.

**Note:** the repo has **no jest test files** — only `jest.config.js`/`jest.setup.ts`/`tsconfig.jest.json` scaffolding and stock Cypress example specs plus `cypress/integration/aolausoro-tech/{home,Navbar}.spec.js`. Nothing to port; the two real cypress specs are recreated as one Playwright smoke test.

- [ ] **Step 1: Delete jest + cypress**

```bash
git rm jest.config.js jest.setup.ts tsconfig.jest.json cypress.json
git rm -r cypress
```

- [ ] **Step 2: Create `vitest.config.mts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'
```

- [ ] **Step 4: Create `test.env`**

```
NODE_OPTIONS="--no-deprecation --no-experimental-strip-types"
```

- [ ] **Step 5: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
  },
})
```

- [ ] **Step 6: Create `tests/helpers/login.ts`**

```ts
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export interface LoginOptions {
  page: Page
  serverURL?: string
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the Payload admin panel via the login page.
 */
export async function login({
  page,
  serverURL = 'http://localhost:3000',
  user,
}: LoginOptions): Promise<void> {
  await page.goto(`${serverURL}/admin/login`)

  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  await page.waitForURL(`${serverURL}/admin`)

  const dashboard = page.locator('span[title="Dashboard"]')
  await expect(dashboard).toBeVisible()
}
```

- [ ] **Step 7: Write the failing integration test — `tests/int/api.int.spec.ts`**

```ts
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Payload local API', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('initializes and can query the users collection', async () => {
    const users = await payload.find({ collection: 'users', limit: 0 })
    expect(users).toBeDefined()
    expect(typeof users.totalDocs).toBe('number')
  })
})
```

- [ ] **Step 8: Create the e2e smoke test — `tests/e2e/frontend.e2e.spec.ts`**

```ts
import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page).toHaveTitle(/.+/)
  await expect(page.locator('body')).toBeVisible()
})
```

- [ ] **Step 9: Update `package.json` deps**

Remove from `devDependencies`: `jest`, `babel-jest`, `ts-jest`, `@types/jest`, `jest-environment-jsdom` (if present), `cypress`, `identity-obj-proxy`, `react-test-renderer`, `whatwg-fetch`, `@testing-library/dom`.

Add to `devDependencies`:
```jsonc
"@playwright/test": "1.58.2",
"@vitejs/plugin-react": "4.5.2",
"vite-tsconfig-paths": "6.0.5",
"vitest": "4.0.18",
"jsdom": "28.0.0",
"tsx": "4.22.4"
```
Keep: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `dotenv` (add `"dotenv": "16.4.7"` to `devDependencies` if not resolvable — vitest.setup.ts imports it), `msw` (leave for now).

Also remove `cypress` from `pnpm.onlyBuiltDependencies` and `pnpm-workspace.yaml` `allowBuilds`.

- [ ] **Step 10: Update `package.json` scripts**

```jsonc
"test": "pnpm run test:int && pnpm run test:e2e",
"test:int": "cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts",
"test:e2e": "cross-env NODE_OPTIONS=\"--no-deprecation --import=tsx/esm\" playwright test --config=playwright.config.ts"
```
Remove the old `"test": "jest"`.

- [ ] **Step 11: Update `tsconfig.json`**

In `include`: remove `"jest.config.js"`, `"cypress/integration/aolausoro-tech/home.spec.js"`, `".eslintrc.js"`. Add `"next-sitemap.config.cjs"`, `"redirects.ts"`, `".next/dev/types/**/*.ts"`, `"tests/**/*.ts"`.
In `exclude`: keep `["node_modules"]`.

- [ ] **Step 12: Update `.gitignore`**

Add:
```
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

- [ ] **Step 13: Install + run the integration test**

```bash
pnpm install
# Mongo running from Task 4 Step 6; ensure .env has DATABASE_URL + PAYLOAD_SECRET
pnpm run test:int
```
Expected: PASS (`Payload local API › initializes and can query the users collection`). If it fails with a Payload init error, the DB isn't reachable — fix `.env`/Mongo, not the test.

- [ ] **Step 14: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
test: swap jest+cypress for vitest+playwright

Matches equilibrium's test setup. Removes the unused jest scaffolding
and the stock Cypress example suite; adds vitest (int) + playwright
(e2e) configs, a Payload local-API integration test, a home-page e2e
smoke test, and the admin login helper.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 6: Next.js build config, sitemap, postcss, gitignore

**Files:**
- Modify: `next.config.mjs`, `postcss.config.js`, `.gitignore`, `package.json` (postbuild script, postcss deps)
- Create: `redirects.ts`, `next-sitemap.config.cjs`
- Delete: `next-sitemap.config.js`
- Untrack: `tsconfig.tsbuildinfo`

**Interfaces:**
- Consumes: nothing.
- Produces: `output: 'standalone'` (Task 8's Dockerfile copies `.next/standalone`).

- [ ] **Step 1: Create `redirects.ts`**

```ts
import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)',
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)',
  }

  return [internetExplorerRedirect]
}
```

- [ ] **Step 2: Edit `next.config.mjs`**

Apply these changes to the existing file (keep the MDX + Sentry wrappers, keep `withPayload`):

1. Delete the **second** `experimental` key (the file currently declares `experimental` twice — a bug; the second, `{ reactCompiler: false }`, silently overrides the first). Merge into one:
   ```js
   experimental: {
     mdxRs: true,
     reactCompiler: false,
   },
   ```
2. Uncomment / set `output: 'standalone'` at the top level of `nextConfig`.
3. Add `import { redirects } from './redirects.ts'` near the other imports and add `redirects,` to `nextConfig`.
4. In `images.remotePatterns`, append (keep the existing cloudinary/unsplash/jsdelivr/clerk entries until Phase 3):
   ```js
   ...(process.env.DO_SPACES_CDN_ENDPOINT
     ? [
         {
           protocol: new URL(process.env.DO_SPACES_CDN_ENDPOINT).protocol.replace(':', ''),
           hostname: new URL(process.env.DO_SPACES_CDN_ENDPOINT).hostname,
         },
       ]
     : []),
   ```
5. Add `turbopack: { root: process.cwd() }` to `nextConfig`.

- [ ] **Step 3: Replace `postcss.config.js`**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

- [ ] **Step 4: Remove now-unused postcss deps from `package.json`**

`devDependencies`: remove `@fullhuman/postcss-purgecss`, `postcss-flexbugs-fixes`, `postcss-preset-env`, `postcss-simple-vars`.
`dependencies`: remove `postcss-flexbugs-fixes` if it also appears there.
Keep `postcss`, `autoprefixer` (transitive-safe), `@tailwindcss/postcss`.

- [ ] **Step 5: Rename the sitemap config**

```bash
git rm next-sitemap.config.js
```
Create `next-sitemap.config.cjs`:
```js
const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'https://portfolio.aolausoro.tech'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
```

- [ ] **Step 6: Update the `postbuild` script in `package.json`**

```jsonc
"postbuild": "next-sitemap --config next-sitemap.config.cjs"
```

- [ ] **Step 7: Update `.gitignore`**

Add (keep every existing line):
```
.env.*.local
*.tsbuildinfo
generated-schema.graphql
```

- [ ] **Step 8: Untrack the build-info file**

```bash
git rm --cached tsconfig.tsbuildinfo
```

- [ ] **Step 9: Install + build**

```bash
pnpm install
pnpm run build   # Mongo reachable via .env
```
Expected: build succeeds and prints `Creating an optimized production build` → `Compiled successfully`, and the output notes standalone generation. If the wrapper order (`withSentryConfig(withPayload(withMDX(...)))`) breaks, keep `withSentryConfig` outermost and `withPayload` inside it; test again.

- [ ] **Step 10: Verify standalone output exists**

Run: `ls .next/standalone/server.js`
Expected: file exists.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
build: standalone output, redirects, cjs sitemap, minimal postcss

Enables next output:'standalone' (needed by the new Dockerfile), adds
redirects.ts (IE redirect), renames next-sitemap.config.js -> .cjs with
production robots/sitemap policy, strips postcss config down to
@tailwindcss/postcss (Tailwind v4 handles the rest), merges the
duplicate `experimental` key, allow-lists the DO Spaces CDN host for
next/image, and untracks tsconfig.tsbuildinfo.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 7: Health endpoint

**Files:**
- Create: `app/api/health/route.ts`, `tests/int/health.int.spec.ts`

**Interfaces:**
- Consumes: `@payload-config` alias, Payload 3.86 `getPayload` (Task 4).
- Produces: `GET /api/health` → `200 {"status":"ok"}` when Payload initializes, `503 {"status":"error"}` otherwise. Task 8's compose healthcheck and Task 9's deploy workflow both poll this.

**Note:** this route must resolve at the **root** `/api/health`, not under the `(protected)` route group's `/admin` API. Placing it at `app/api/health/route.ts` gives the path `/api/health`. Confirm no existing `app/api/health` and no conflicting `app/(home)/api` route.

- [ ] **Step 1: Write the failing test — `tests/int/health.int.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { GET } from '@/../app/api/health/route'

describe('GET /api/health', () => {
  it('returns 200 with status ok when Payload initializes', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ status: 'ok' })
  })
})
```

If the `@/../app/...` specifier does not resolve under this repo's tsconfig paths, use a relative import: `import { GET } from '../../app/api/health/route'`.

- [ ] **Step 2: Run it — verify it fails**

Run: `pnpm run test:int -- tests/int/health.int.spec.ts`
Expected: FAIL — cannot resolve `app/api/health/route`.

- [ ] **Step 3: Create `app/api/health/route.ts`**

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  try {
    await getPayload({ config })
    return Response.json({ status: 'ok' })
  } catch {
    return Response.json({ status: 'error' }, { status: 503 })
  }
}
```

- [ ] **Step 4: Run it — verify it passes**

Run: `pnpm run test:int -- tests/int/health.int.spec.ts`
Expected: PASS (Mongo reachable).

- [ ] **Step 5: Full int suite + type-check**

Run: `pnpm run test:int && pnpm exec tsc --noEmit`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add app/api/health/route.ts tests/int/health.int.spec.ts
git commit --no-verify -m "$(cat <<'EOF'
feat: add /api/health endpoint for deploy health checks

Returns 200 {status:ok} once Payload initializes against the DB, 503
otherwise. Polled by the docker-compose healthcheck and the
deploy-production workflow's post-deploy gate.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 8: Dockerfile, local compose, deploy/ directory

**Files:**
- Replace: `Dockerfile`, `docker-compose.yml`
- Create: `deploy/docker-compose.production.yml`, `deploy/nginx/production.conf`, `deploy/scripts/setup-droplet.sh`, `.dockerignore` (review/expand existing)

**Interfaces:**
- Consumes: `output: 'standalone'` (Task 6), `/api/health` (Task 7).
- Produces: image `ghcr.io/nucternal18/aolausoro.tech-2:production` (built by Task 9's workflow); `deploy/` layout that `setup-droplet.sh` and the deploy workflow expect at `/opt/aolausoro`.

- [ ] **Step 1: Replace `Dockerfile`**

```dockerfile
# Multi-stage standalone build. Requires `output: 'standalone'` in next.config.mjs.
# Adapted from the Next.js with-docker example and the equilibrium project.
FROM node:22.19.0-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# pnpm-workspace.yaml carries the allowBuilds approvals — without it here,
# `pnpm i --frozen-lockfile` hard-fails with ERR_PNPM_IGNORED_BUILDS.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the build output — must be set before
# `next build`, not just at container runtime.
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLOUDINARY_NAME
ENV NEXT_PUBLIC_CLOUDINARY_NAME=$NEXT_PUBLIC_CLOUDINARY_NAME
ARG DO_SPACES_CDN_ENDPOINT
ENV DO_SPACES_CDN_ENDPOINT=$DO_SPACES_CDN_ENDPOINT

# Payload initializes against a real, reachable (disposable) DB during
# `next build` for generateStaticParams. These must NOT be real secrets.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET

# Sentry source-map upload during build (optional; no-ops without the token).
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm && pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
```

- [ ] **Step 2: Replace `docker-compose.yml`** (local dev only)

```yaml
# Local development stack. Production runs from deploy/docker-compose.production.yml.
services:
  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    command: ['--storageEngine=wiredTiger']
    volumes:
      - mongo-data:/data/db

  app:
    build: .
    depends_on:
      - mongo
    ports:
      - '3000:3000'
    env_file:
      - .env
    environment:
      DATABASE_URL: mongodb://mongo:27017/aolausoro

volumes:
  mongo-data:
```

- [ ] **Step 3: Create `deploy/docker-compose.production.yml`**

```yaml
# Production runtime stack. Deployed via .github/workflows/deploy-production.yml,
# which runs on a self-hosted GitHub Actions runner registered on this droplet.
# The .env file in this directory is generated fresh on every deploy from
# GitHub Actions secrets — do not hand-edit it, it will be overwritten.
# The image is built and pushed by CI; this file only ever pulls it.
services:
  app:
    image: ghcr.io/nucternal18/aolausoro.tech-2:production
    container_name: aolausoro-production
    restart: unless-stopped
    # Loopback only — Nginx is the sole entry point.
    ports:
      - '127.0.0.1:3000:3000'
    env_file:
      - .env
    healthcheck:
      test: ['CMD', 'node', '-e', "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s
```

- [ ] **Step 4: Create `deploy/nginx/production.conf`**

```nginx
# Nginx reverse proxy for portfolio.aolausoro.tech
# Cloudflare terminates edge TLS; this origin presents the Cloudflare Origin CA
# cert and Cloudflare is set to Full (strict) mode.

server {
    listen 80;
    server_name portfolio.aolausoro.tech;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name portfolio.aolausoro.tech;

    ssl_certificate     /etc/ssl/cloudflare/portfolio.aolausoro.tech.pem;
    ssl_certificate_key /etc/ssl/cloudflare/portfolio.aolausoro.tech.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

- [ ] **Step 5: Create `deploy/scripts/setup-droplet.sh`** (production-only adaptation)

Copy equilibrium's script as the base, then apply these edits:
```bash
cp /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/deploy/scripts/setup-droplet.sh deploy/scripts/setup-droplet.sh
chmod +x deploy/scripts/setup-droplet.sh
```
Then hand-edit `deploy/scripts/setup-droplet.sh`:
- Delete the entire **"0. ENVIRONMENT SELECTION"** `while`/`case` block. Replace with:
  ```bash
  ENVIRONMENT="production"
  DOMAIN="portfolio.aolausoro.tech"
  NGINX_CONF="production.conf"
  ```
- Replace every `Equilibrium` / `equilibrium` string with `aolausoro.tech` / `aolausoro`.
- Change the app directory from `/opt/equilibrium` to `/opt/aolausoro`.
- Change the runner label prompt/default from the environment variable to the literal `production`.
- Change the default deploy username default from `equilibrium` to `aolausoro`.
- Update the log file path to `/var/log/aolausoro-droplet-setup.log`.
- Keep every hardening step (SSH key-only, UFW, fail2ban, unattended-upgrades, Docker install, Nginx install, GitHub Actions runner registration) unchanged.

- [ ] **Step 6: Create/replace `.dockerignore`**

```
node_modules
.next
.git
.github
.husky
coverage
cypress
tests
test-results
playwright-report
.vscode
.claude
.agents
docs
*.md
!README.md
.env
.env.*
Dockerfile
docker-compose.yml
deploy
```

- [ ] **Step 7: Validate the compose files**

Run: `docker compose -f docker-compose.yml config` and `docker compose -f deploy/docker-compose.production.yml config`
Expected: both print resolved YAML, no error.

- [ ] **Step 8: Validate the Dockerfile builds** (if Docker available locally; else defer to CI)

Run:
```bash
docker build \
  --build-arg DATABASE_URL=mongodb://127.0.0.1:27017/build \
  --build-arg PAYLOAD_SECRET=build-only-not-real \
  --build-arg NEXT_PUBLIC_SERVER_URL=http://localhost:3000 \
  -t aolausoro-local-test .
```
Expected: build reaches the `runner` stage and succeeds. The build-time Payload init will connect to an empty/none DB and pre-render zero pages — that is fine and expected. If Docker is unavailable, note "deferred to CI" and continue.

- [ ] **Step 9: Nginx syntax check** (optional, via container)

Run: `docker run --rm -v "$PWD/deploy/nginx/production.conf:/etc/nginx/conf.d/test.conf:ro" nginx:alpine nginx -t`
Expected: `syntax is ok` / `test is successful` (it will warn about the missing SSL cert files — acceptable, they exist only on the droplet).

- [ ] **Step 10: Commit**

```bash
git add Dockerfile docker-compose.yml deploy/ .dockerignore
git commit --no-verify -m "$(cat <<'EOF'
build: standalone Dockerfile + production deploy/ scaffold

Replaces the old Prisma-era Dockerfile with a multi-stage standalone
build (non-root runner, .next/standalone). docker-compose.yml is now a
local dev stack (app + mongo). deploy/ holds the production compose
file (loopback-bound, /api/health healthcheck), the nginx reverse-proxy
config for portfolio.aolausoro.tech, and a production-only droplet
setup script adapted from equilibrium's.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 9: GitHub Actions — CI + production deploy

**Files:**
- Delete: `.github/workflows/node.js.yml`
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy-production.yml`

**Interfaces:**
- Consumes: `pnpm run lint` (Task 3), `pnpm run test:int` (Task 5), `pnpm run build` (Task 6), `/api/health` (Task 7), `deploy/docker-compose.production.yml` (Task 8), image name `ghcr.io/nucternal18/aolausoro.tech-2`.
- Produces: nothing downstream in this plan.

- [ ] **Step 1: Delete the old workflow**

```bash
git rm .github/workflows/node.js.yml
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

env:
  HUSKY: 0
  NODE_OPTIONS: --no-deprecation

jobs:
  verify:
    runs-on: ubuntu-latest

    services:
      mongo:
        image: mongo:latest
        ports:
          - 27017:27017

    env:
      DATABASE_URL: mongodb://127.0.0.1:27017/ci
      PAYLOAD_SECRET: ci-only-secret-not-for-real-use
      NEXT_PUBLIC_SERVER_URL: http://localhost:3000

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Type-check
        run: pnpm exec tsc --noEmit

      - name: Generate Prisma client
        run: pnpm run generate

      - name: Integration tests
        run: pnpm run test:int

      - name: Build
        run: pnpm run build
```

Note: `pnpm/action-setup` and `actions/setup-node` are GitHub-owned / pnpm-official and fine here (this repo has no Actions allow-list policy, unlike equilibrium). If a policy is later added, switch to the manual pnpm-on-PATH steps from the old `node.js.yml`.

- [ ] **Step 3: Create `.github/workflows/deploy-production.yml`**

```yaml
name: Deploy Production

# Triggers directly on push to main. The build job runs on a GitHub-hosted
# runner; the deploy job runs on a self-hosted runner labeled "production",
# registered on the droplet by deploy/scripts/setup-droplet.sh — no SSH keys,
# the runner registration is the trust boundary.
on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-production
  cancel-in-progress: true

env:
  IMAGE: ghcr.io/nucternal18/aolausoro.tech-2

jobs:
  build:
    name: Build and push image
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        run: echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u "${{ github.actor }}" --password-stdin

      - name: Set up Docker Buildx
        run: docker buildx create --use --driver-opt network=host

      - name: Start throwaway Mongo for build-time Payload init
        run: docker run -d --name build-mongo --network host mongo:latest

      - name: Wait for Mongo
        run: |
          for i in $(seq 1 15); do
            if docker exec build-mongo mongosh --eval 'db.runCommand("ping")' --quiet; then exit 0; fi
            sleep 2
          done
          echo "Mongo did not become ready" && exit 1

      - name: Build and push
        run: |
          docker buildx build \
            --push \
            --network=host \
            --tag "${{ env.IMAGE }}:production" \
            --tag "${{ env.IMAGE }}:production-${{ github.sha }}" \
            --build-arg "NEXT_PUBLIC_SERVER_URL=${{ secrets.NEXT_PUBLIC_SERVER_URL }}" \
            --build-arg "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}" \
            --build-arg "NEXT_PUBLIC_CLOUDINARY_NAME=${{ secrets.NEXT_PUBLIC_CLOUDINARY_NAME }}" \
            --build-arg "DO_SPACES_CDN_ENDPOINT=${{ secrets.DO_SPACES_CDN_ENDPOINT }}" \
            --build-arg "SENTRY_AUTH_TOKEN=${{ secrets.SENTRY_AUTH_TOKEN }}" \
            --build-arg "DATABASE_URL=mongodb://127.0.0.1:27017/build" \
            --build-arg "PAYLOAD_SECRET=build-only-secret-not-for-real-use" \
            --cache-from "type=registry,ref=${{ env.IMAGE }}:buildcache" \
            --cache-to "type=registry,ref=${{ env.IMAGE }}:buildcache,mode=max" \
            .

      - name: Stop throwaway Mongo
        if: always()
        run: docker rm -f build-mongo

  deploy:
    name: Deploy to droplet
    needs: build
    runs-on: [self-hosted, production]
    environment: production
    env:
      DEPLOY_PATH: /opt/aolausoro
    steps:
      - uses: actions/checkout@v4

      - name: Sync deploy files
        run: |
          mkdir -p "$DEPLOY_PATH"
          cp deploy/docker-compose.production.yml "$DEPLOY_PATH/docker-compose.yml"

      - name: Write runtime .env from secrets
        working-directory: ${{ env.DEPLOY_PATH }}
        run: |
          cat > .env <<'ENVEOF'
          DATABASE_URL=${{ secrets.DATABASE_URL }}
          PAYLOAD_SECRET=${{ secrets.PAYLOAD_SECRET }}
          PAYLOAD_PUBLIC_SERVER_URL=${{ secrets.NEXT_PUBLIC_SERVER_URL }}
          NEXT_PUBLIC_SERVER_URL=${{ secrets.NEXT_PUBLIC_SERVER_URL }}
          RESEND_API_KEY=${{ secrets.RESEND_API_KEY }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY=${{ secrets.CLERK_SECRET_KEY }}
          CLERK_WEBHOOK_SECRET=${{ secrets.CLERK_WEBHOOK_SECRET }}
          CLOUDINARY_NAME=${{ secrets.CLOUDINARY_NAME }}
          CLOUDINARY_API_KEY=${{ secrets.CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET=${{ secrets.CLOUDINARY_API_SECRET }}
          NEXT_PUBLIC_CLOUDINARY_NAME=${{ secrets.NEXT_PUBLIC_CLOUDINARY_NAME }}
          NEXT_PUBLIC_CLOUDINARY_PRESET=${{ secrets.NEXT_PUBLIC_CLOUDINARY_PRESET }}
          DO_SPACES_REGION=${{ secrets.DO_SPACES_REGION }}
          DO_SPACES_ENDPOINT=${{ secrets.DO_SPACES_ENDPOINT }}
          DO_SPACES_CDN_ENDPOINT=${{ secrets.DO_SPACES_CDN_ENDPOINT }}
          DO_SPACES_BUCKET=${{ secrets.DO_SPACES_BUCKET }}
          DO_SPACES_KEY=${{ secrets.DO_SPACES_KEY }}
          DO_SPACES_SECRET=${{ secrets.DO_SPACES_SECRET }}
          SENTRY_AUTH_TOKEN=${{ secrets.SENTRY_AUTH_TOKEN }}
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${{ secrets.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }}
          RECAPTCHA_SITE_KEY=${{ secrets.RECAPTCHA_SITE_KEY }}
          ENVEOF

      - name: Pull and restart
        working-directory: ${{ env.DEPLOY_PATH }}
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u "${{ github.actor }}" --password-stdin
          docker compose pull
          docker compose up -d --remove-orphans

      - name: Health check
        working-directory: ${{ env.DEPLOY_PATH }}
        run: |
          for i in $(seq 1 24); do
            status=$(docker inspect --format='{{.State.Health.Status}}' "$(docker compose ps -q app)" 2>/dev/null || echo "starting")
            if [ "$status" = "healthy" ]; then echo "healthy"; exit 0; fi
            echo "waiting: $status ($i/24)"; sleep 5
          done
          echo "app did not become healthy"; docker compose logs --tail=50; exit 1

      - name: Prune dangling images
        if: always()
        run: docker image prune -f
```

- [ ] **Step 4: Lint the workflows**

Run: `pnpm dlx @action-validator/cli .github/workflows/ci.yml && pnpm dlx @action-validator/cli .github/workflows/deploy-production.yml`
(or, if `actionlint` is installed: `actionlint`)
Expected: no errors. YAML must parse; job/step keys valid.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/
git commit --no-verify -m "$(cat <<'EOF'
ci: replace node.js.yml with ci.yml + deploy-production.yml

CI: lint, tsc --noEmit, prisma generate, vitest int tests against a
mongo service container, and a full next build — on push to main and
every PR. Deploy: push to main builds/pushes
ghcr.io/nucternal18/aolausoro.tech-2:production and rolls it out on a
self-hosted runner labeled "production" with a /api/health gate.
Production only; no staging workflow.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 10: Install the Payload agent skills

**Files:**
- Create: `.agents/skills/payload/**`, `.agents/skills/cms-migration/**` (copied from `$EQ`)
- Create: `.claude/skills/payload` + `.claude/skills/cms-migration` (symlinks), `.claude/skills/health-check/SKILL.md`, `.claude/skills/health-check/scripts/check.sh`
- Create: `skills-lock.json`
- Modify: `.gitignore` (ensure symlinks are not ignored)

**Interfaces:**
- Consumes: nothing.
- Produces: `.claude/skills/payload/SKILL.md` and `.agents/skills/payload/SKILL.md` (referenced by `CLAUDE.md` in Task 11).

- [ ] **Step 1: Copy the skill trees from equilibrium**

```bash
mkdir -p .agents/skills
cp -R /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/.agents/skills/payload .agents/skills/payload
cp -R /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/.agents/skills/cms-migration .agents/skills/cms-migration
```

- [ ] **Step 2: Create the `.claude/skills` symlinks**

```bash
mkdir -p .claude/skills
ln -s ../../.agents/skills/payload .claude/skills/payload
ln -s ../../.agents/skills/cms-migration .claude/skills/cms-migration
```

- [ ] **Step 3: Verify the symlinks resolve**

Run: `cat .claude/skills/payload/SKILL.md | head -5`
Expected: prints the skill's frontmatter.

- [ ] **Step 4: Create `skills-lock.json`**

Copy equilibrium's file and verify the hashes still describe the copied files:
```bash
cp /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/skills-lock.json skills-lock.json
```
Then confirm the copied `SKILL.md` files are byte-identical to equilibrium's (same source revision, so the recorded `computedHash` values still apply):
```bash
diff -r .agents/skills/payload /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/.agents/skills/payload && echo IDENTICAL
diff -r .agents/skills/cms-migration /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/.agents/skills/cms-migration && echo IDENTICAL
```
Expected: both print `IDENTICAL`. If not, note the divergence in the commit message (the lock file's hashes would then be stale — acceptable for now, flag for a follow-up `skills` re-sync).

- [ ] **Step 5: Create `.claude/skills/health-check/SKILL.md`** (single-app version, no Python/monorepo)

```markdown
---
name: health-check
description: Runs a pre-plan health check for this Next.js + Payload app — dependency CVE audit (pnpm audit), outdated package scan, ESLint, TypeScript type-check, and the Vitest integration suite. Use when the user asks to run health checks, before starting any implementation plan, after dependency changes, or when the user types /health-check.
---

# Health Check

## Quick start

```bash
bash .claude/skills/health-check/scripts/check.sh
```

Resolve every `✗` (failure) before proceeding. Discuss every `⚠` (warning) with the user.

## What the script checks

| # | Check | Tool | Blocks? |
|---|-------|------|---------|
| 1 | Dependency CVEs | `pnpm audit --audit-level=high` | Warn |
| 2 | Outdated packages | `pnpm outdated` | Warn only |
| 3 | Lint | `pnpm run lint` | Yes |
| 4 | Type-check | `pnpm exec tsc --noEmit` | Yes |
| 5 | Integration tests | `pnpm run test:int` (needs a reachable Mongo) | Yes |

## Acting on results

- **CVEs** — `high`/`critical` must be resolved or explicitly accepted by the user before work starts.
- **Outdated packages** — flag any package where `current` and `latest` differ by a major version. Report; do not auto-upgrade without approval.
- **Lint / type errors** — fix all errors before starting implementation. Never build on a broken baseline.
- **Integration tests** — a failure usually means the DB is unreachable; fix `.env` / start Mongo (`docker run -d -p 27017:27017 mongo:latest`) before assuming the code is broken.

## Dev server (manual check)

The script does not start `pnpm dev`. After dependency changes or new Next.js config, run it manually and watch the first 15s for Turbopack or missing-module errors.
```

- [ ] **Step 6: Create `.claude/skills/health-check/scripts/check.sh`**

```bash
#!/usr/bin/env bash
# aolausoro.tech health check
# Usage: bash .claude/skills/health-check/scripts/check.sh
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

RED='\033[0;31m'; YEL='\033[1;33m'; GRN='\033[0;32m'; BLD='\033[1m'; NC='\033[0m'
FAILS=0; WARNS=0
ok()   { printf "  ${GRN}✓${NC} %s\n" "$1"; }
warn() { printf "  ${YEL}⚠${NC} %s\n" "$1"; WARNS=$((WARNS+1)); }
fail() { printf "  ${RED}✗${NC} %s\n" "$1"; FAILS=$((FAILS+1)); }
hdr()  { printf "\n${BLD}── %s${NC}\n" "$1"; }

printf "${BLD}=== aolausoro.tech Health Check ===${NC}\n"

hdr "1. Dependency CVE audit (pnpm audit)"
if pnpm audit --audit-level=high; then ok "No high/critical CVEs"; else warn "High/critical CVEs found — review and resolve"; fi

hdr "2. Outdated packages (pnpm outdated)"
OUT=$(pnpm outdated 2>&1 || true)
if [ -z "$OUT" ]; then ok "All packages current"; else printf "%s\n" "$OUT"; warn "Outdated packages — flag major-version gaps to the user"; fi

hdr "3. Lint (pnpm run lint)"
if pnpm run lint; then ok "No ESLint errors"; else fail "ESLint errors — fix before starting"; fi

hdr "4. Type-check (tsc --noEmit)"
if pnpm exec tsc --noEmit; then ok "No TypeScript errors"; else fail "TypeScript errors — fix before starting"; fi

hdr "5. Integration tests (pnpm run test:int)"
if pnpm run test:int; then ok "Integration tests pass"; else fail "Integration tests failing — check DB reachability first"; fi

printf "\n${BLD}════════════════════════════════${NC}\n"
if [ "$FAILS" -eq 0 ] && [ "$WARNS" -eq 0 ]; then
  printf "${GRN}${BLD}All checks passed.${NC}\n"
elif [ "$FAILS" -eq 0 ]; then
  printf "${YEL}${BLD}%s warning(s). Review with user.${NC}\n" "$WARNS"
else
  printf "${RED}${BLD}%s failure(s), %s warning(s). Resolve before proceeding.${NC}\n" "$FAILS" "$WARNS"
  exit 1
fi
```

Then: `chmod +x .claude/skills/health-check/scripts/check.sh`

- [ ] **Step 7: Verify git tracks the symlinks as symlinks**

Run: `git add .claude .agents skills-lock.json && git ls-files -s .claude/skills/payload`
Expected: mode `120000` (symlink), not `100644`.

- [ ] **Step 8: Commit**

```bash
git add .claude .agents skills-lock.json .gitignore
git commit --no-verify -m "$(cat <<'EOF'
chore: install payload + cms-migration agent skills

Copies the payload and cms-migration skill trees from the equilibrium
project into .agents/skills/, symlinked from .claude/skills/, with the
matching skills-lock.json. Adds a single-app health-check skill (no
Python/monorepo checks) at .claude/skills/health-check/.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Task 11: Agent & project docs

**Files:**
- Create: `AGENT.md`, `CLAUDE.md`, `CONTEXT.md`, `docs/agents/domain.md`, `docs/agents/issue-tracker.md`, `docs/deployment-plan.md`, `docs/adr/.gitkeep`, `.claude/hand-off/HANDOFF.md`, `.claude/hand-off/handoff-aolausoro-2026-09-06.md`, `.env.example`
- Move: `PAYLOAD_CMS_INTEGRATION.md` → `docs/payload-cms-integration.md`
- Modify/replace: `README.md`
- Delete: `update-dep.sh`

**Interfaces:**
- Consumes: everything above (docs describe the finished scaffold).
- Produces: nothing downstream.

**Before starting:** invoke the `writing-for-agents` skill (required by its trigger — this task creates/edits `AGENT.md` and `CLAUDE.md`).

- [ ] **Step 1: `docs/agents/domain.md`** — copy verbatim from equilibrium (project-agnostic)

```bash
mkdir -p docs/agents docs/adr
cp /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/docs/agents/domain.md docs/agents/domain.md
touch docs/adr/.gitkeep
```

- [ ] **Step 2: `docs/agents/issue-tracker.md`** — copy, then swap repo references

```bash
cp /Users/adewoyinoladipupo-usoro/devprojects/equilibrium/docs/agents/issue-tracker.md docs/agents/issue-tracker.md
```
Hand-edit: replace `EquilibriumStartupLab/equilibrium` with `nucternal18/aolausoro.tech-2` everywhere it appears. Leave every `gh` command and the wayfinder section unchanged.

- [ ] **Step 3: Move the Payload integration doc**

```bash
git mv PAYLOAD_CMS_INTEGRATION.md docs/payload-cms-integration.md
```

- [ ] **Step 4: Delete the obsolete upgrade script**

```bash
git rm update-dep.sh
```

- [ ] **Step 5: Create `.env.example`**

```
# ─── Core ────────────────────────────────────────────────────────────────
# MongoDB connection string (Payload's database).
DATABASE_URL=mongodb://127.0.0.1:27017/aolausoro
# Encrypts Payload JWTs. Generate: openssl rand -hex 32
PAYLOAD_SECRET=YOUR_SECRET_HERE
# Public origin, no trailing slash. Used for CORS, sitemap, absolute links.
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# ─── Email (Resend) ──────────────────────────────────────────────────────
RESEND_API_KEY=YOUR_RESEND_API_KEY
EMAIL_FROM_ADDRESS=noreply@email.aolausoro.tech
EMAIL_FROM_NAME=aolausoro.tech

# ─── Media storage — DigitalOcean Spaces (S3-compatible) ─────────────────
DO_SPACES_REGION=us-east-1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://your-bucket.lon1.cdn.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket
DO_SPACES_KEY=YOUR_SPACES_ACCESS_KEY
DO_SPACES_SECRET=YOUR_SPACES_SECRET_KEY

# ─── reCAPTCHA (contact form) ────────────────────────────────────────────
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SECRET_KEY

# ─── Transitional — removed in Phase 3 of the Payload migration ──────────
# Clerk (auth, being replaced by Payload's own auth + payload-totp)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET=YOUR_CLERK_WEBHOOK_SECRET
# Cloudinary (media, being replaced by DO Spaces above)
CLOUDINARY_NAME=YOUR_CLOUDINARY_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLOUDINARY_NAME=YOUR_CLOUDINARY_NAME
NEXT_PUBLIC_CLOUDINARY_PRESET=YOUR_CLOUDINARY_PRESET
# Sentry (observability — fate decided in Phase 3)
SENTRY_AUTH_TOKEN=YOUR_SENTRY_AUTH_TOKEN
```

- [ ] **Step 6: Create `CONTEXT.md`**

```markdown
# aolausoro.tech

Personal portfolio and content site for Adewoyin Oladipupo-Usoro. Payload CMS
manages every content type; the Next.js App Router frontend renders the public
site and Payload serves the `/admin` panel.

## Language

**Project**:
A piece of work in the portfolio — the primary showcased content type. Layout-builder enabled.
_Avoid_: Portfolio item, work sample

**Post**:
A blog/article entry, published over time, layout-builder and draft enabled.
_Avoid_: Article, blog (as a content-type name — "Post" is the collection)

**Page**:
A standalone layout-builder page (e.g. About, Home sections).
_Avoid_: Route, screen

**Job**:
A work-history / experience entry.
_Avoid_: Role, position (in the data model — those are fields)

**Message**:
A contact-form submission captured from the public site.
_Avoid_: Contact, enquiry, lead

**Wiki**:
A long-form knowledge/notes entry, rich-text.
_Avoid_: Doc, note (as the collection name)

**Issue**:
An internally-tracked task or bug recorded as content (distinct from GitHub Issues, which are the engineering issue tracker — see `docs/agents/issue-tracker.md`).
_Avoid_: Ticket, task

**Media**:
The uploads collection. In production, files are stored in DigitalOcean Spaces, not on the host disk.
_Avoid_: Asset, file, upload (as the collection name)

**User**:
An auth-enabled account with `/admin` access.
_Avoid_: Admin, account
```

- [ ] **Step 7: Create `AGENT.md`** (per `writing-for-agents`)

```markdown
# Agent instructions

Payload CMS + Next.js (App Router) portfolio site. MongoDB. Package manager is `pnpm`.
Orientation document for AI agents picking up work in this repository.
Always read `CLAUDE.md` for tooling commands before starting any task.

## Migration in progress

This repo is mid-migration from a Clerk + Prisma + Redux + clean-architecture
stack onto Payload CMS. See `docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`
(§ Phase 3) and `docs/payload-cms-integration.md`. Clerk / Prisma / Redux /
inversify / Sentry / Cloudinary are still present and still imported — do not
assume they are gone.

## Handoff Protocol

At the end of every session, update the handoff document at
`.claude/hand-off/handoff-aolausoro-<YYYY-MM-DD>.md` (today's date). If today's
file exists, update it in place; otherwise create it — previous files stay for
history.

The handoff must cover: what changed this session (files, decisions); key design
decisions and why; pre-existing known issues relevant to active work; next steps
not completed; a "Suggested Skills" section listing `/skills` the next agent
should invoke.

Do not duplicate content already in committed files, docs, or plans — reference
them by path. Redact all secrets, keys, and PII.

## Commands

- `pnpm dev` — local dev server (needs a reachable Mongo; `docker compose up mongo`)
- `pnpm run build` — production build (needs `DATABASE_URL` + `PAYLOAD_SECRET` at a reachable Mongo — Payload connects during static generation)
- `pnpm run lint` / `pnpm run lint:fix` — ESLint (flat config)
- `pnpm exec tsc --noEmit` — type-check
- `pnpm run test:int` — Vitest integration tests (needs a real reachable Mongo)
- `pnpm run test:e2e` — Playwright e2e tests (spins up its own dev server)
- `pnpm run generate:types` — regenerate `payload-types.ts`
- `pnpm run generate:importmap` — regenerate the admin import map

## Deployment

Production only — `portfolio.aolausoro.tech`, deployed off `main` by
`.github/workflows/deploy-production.yml` (Docker image → GHCR → self-hosted
runner on a DigitalOcean droplet + Nginx). Read `docs/deployment-plan.md` before
touching `deploy/`, `.github/workflows/`, `Dockerfile`, or `next.config.mjs`.
There is no staging environment.

## Conventions

- Env vars are documented in `.env.example`; nothing outside it should be assumed at runtime.
- `.env`, `.env.local`, `.env.*.local` are gitignored — never commit real secrets into any `.env*` file.
- Secrets for production live only in the `.env` on the droplet, written from GitHub Actions secrets on each deploy.
```

- [ ] **Step 8: Create `CLAUDE.md`** (per `writing-for-agents`; keep it an index)

```markdown
# Claude Code

Payload CMS + Next.js (App Router) portfolio site. MongoDB. Package manager is `pnpm`.

**Migration in progress:** Clerk + Prisma + Redux → Payload CMS. See
`docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md` and
`docs/payload-cms-integration.md`. Legacy deps are still imported — don't assume removal.

This project uses the Payload CMS skill at `.claude/skills/payload/`. Start with
`.claude/skills/payload/SKILL.md`, then `.claude/skills/payload/reference/` for detail.

## Handoff Protocol

At the end of every session, update `.claude/hand-off/handoff-aolausoro-<YYYY-MM-DD>.md`
(see `AGENT.md` for the required contents). `.claude/hand-off/HANDOFF.md` holds the
current session-to-session state.

## Commands

See `AGENT.md` § Commands.

## Deployment

Production only (`portfolio.aolausoro.tech`), off `main`. Read
`docs/deployment-plan.md` before changing `deploy/`, `.github/workflows/`,
`Dockerfile`, or `next.config.mjs`. No staging environment.

## Agent skills

### Issue tracker

Engineering issues live as GitHub Issues on `nucternal18/aolausoro.tech-2`,
managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

`CONTEXT.md` + `docs/adr/` at the repo root, grown lazily by `/domain-modeling`.
See `docs/agents/domain.md`.

### Health check

`/health-check` or `bash .claude/skills/health-check/scripts/check.sh` before
starting any implementation plan.
```

- [ ] **Step 9: Create `docs/deployment-plan.md`**

```markdown
# Deployment Plan — aolausoro.tech

**Scope:** Production only — `portfolio.aolausoro.tech`. No staging environment.
**Status:** Pipeline landed; infrastructure provisioning pending.

## Overview

Moves the site from a self-hosted `pnpm build` + `pm2 restart` deploy to a
Docker image built in CI, pushed to GHCR, and rolled out on a DigitalOcean
droplet by a self-hosted GitHub Actions runner. Shipping a change is a push to
`main`.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Reverse proxy | Nginx | Pairs with Cloudflare Full (strict); org convention |
| TLS | Cloudflare Origin CA certificate | Issued once, ~15-year validity, no renewal cron |
| Database | MongoDB Atlas | Replica set out of the box, which Payload's transactional writes expect |
| Media | DigitalOcean Spaces via `@payloadcms/storage-s3` | Host disk holds no uploads; survives redeploys |
| Deploy trust boundary | Self-hosted runner registration (no SSH keys) | Runner on the droplet pulls + restarts; nothing else has shell access |

## Architecture

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
- `.github/workflows/ci.yml` — lint / typecheck / test / build on every push + PR.
- `.github/workflows/deploy-production.yml` — build+push+rollout on push to `main`.

## Implementation status

| Item | Status |
|---|---|
| `next.config.mjs` `output: 'standalone'` | ✅ |
| Multi-stage `Dockerfile` | ✅ |
| `/api/health` endpoint | ✅ |
| `deploy/docker-compose.production.yml` | ✅ |
| `deploy/nginx/production.conf` | ✅ |
| `ci.yml` | ✅ |
| `deploy-production.yml` | ✅ (inert until a runner labeled `production` is registered) |
| Droplet provisioning | ⬜ |
| MongoDB Atlas cluster | ⬜ |
| Cloudflare Origin CA cert + DNS for `portfolio.aolausoro.tech` | ⬜ |
| GitHub Actions self-hosted runner (label `production`) | ⬜ |
| GitHub Actions secrets populated | ⬜ |
| Media moved off Cloudinary to DO Spaces (Phase 3) | ⬜ |

## Migrating from the old deploy

The previous `.github/workflows/node.js.yml` ran `pnpm build` then
`pm2 restart portfolio-client` on a self-hosted runner. That is fully replaced.
Decommission the pm2 process only after the container deploy is verified healthy.
```

- [ ] **Step 10: Create `.claude/hand-off/HANDOFF.md` and today's handoff**

`.claude/hand-off/HANDOFF.md`:
```markdown
# Handoff — current state

Latest session handoff: `.claude/hand-off/handoff-aolausoro-2026-09-06.md`

## Standing context

- The Payload CMS migration (off Clerk/Prisma/Redux) is in progress. Phase 2
  (project-config replication from the `equilibrium` project) is complete; Phase 3
  (dependency prune + finishing the migration) is scoped but not started — see
  `docs/superpowers/specs/2026-09-06-equilibrium-config-replication-design.md`.
- Deployment infra (droplet, Atlas, runner, secrets) is not yet provisioned —
  `docs/deployment-plan.md` tracks status.
```

`.claude/hand-off/handoff-aolausoro-2026-09-06.md`:
```markdown
# Handoff — 2026-09-06

## What was done

Executed Phase 2 of the equilibrium config-replication plan
(`docs/superpowers/plans/2026-09-06-equilibrium-config-replication.md`):
pnpm/editor config, Prettier + repo reformat, flat ESLint, Payload 3.86 /
Next 16.2.6 / React 19.2.6 alignment, jest+cypress → vitest+playwright,
standalone build config, `/api/health`, standalone Dockerfile + `deploy/`,
`ci.yml` + `deploy-production.yml`, payload/cms-migration skills, and the
agent/docs scaffold (`AGENT.md`, `CLAUDE.md`, `CONTEXT.md`, `docs/`).

## Key decisions

- Production-only deploy — no staging (per user).
- No dependency removals this phase — deferred to Phase 3.
- Kept `@types/node@24` and `typescript@5.9` (newer than equilibrium).
- Adopted `payload-totp`.

## Known issues / open

- `pnpm run lint` now surfaces warnings the old config muted — untriaged.
- `deploy-production.yml` is inert until the droplet + runner + secrets exist.
- SSRF in `components/admin-route-components/actions/upload.ts` — flagged by
  security review, to be fixed as part of Phase 3 (that file uses Cloudinary +
  axios, both on the prune list).

## Next steps

1. Phase 3: brainstorm finishing the Payload migration + the dependency prune.
2. Provision deployment infra (see `docs/deployment-plan.md` status table).
3. Triage the new ESLint warnings.

## Suggested Skills

- `/superpowers:brainstorming` — for Phase 3 scoping
- `/health-check` — before Phase 3 implementation
```

- [ ] **Step 11: Replace `README.md`**

```markdown
# aolausoro.tech

Personal portfolio and content site. Payload CMS (admin at `/admin`) + Next.js
App Router frontend, MongoDB, deployed as a standalone Docker image.

## Getting started

```bash
cp .env.example .env        # fill in DATABASE_URL + PAYLOAD_SECRET at minimum
docker compose up -d mongo  # or point DATABASE_URL at Atlas
pnpm install
pnpm dev                    # http://localhost:3000
```

Create the first admin user from the on-screen prompt at `/admin`.

## Commands

See `AGENT.md` for the full list. Common ones: `pnpm dev`, `pnpm run build`,
`pnpm run lint`, `pnpm exec tsc --noEmit`, `pnpm run test:int`, `pnpm run test:e2e`.

## Working in this repo

- `AGENT.md` / `CLAUDE.md` — orientation for AI agents and contributors
- `CONTEXT.md` — domain glossary
- `docs/deployment-plan.md` — how production is deployed
- `docs/payload-cms-integration.md` — the Payload migration
- `docs/superpowers/` — specs and implementation plans

## Status

Mid-migration from a Clerk + Prisma + Redux stack onto Payload CMS. Some legacy
dependencies are still present. Production only — no staging environment.
```

- [ ] **Step 12: Verify the docs build isn't broken and links resolve**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: both pass (docs are not compiled, but confirm nothing else regressed).
Run: `git grep -l "PAYLOAD_CMS_INTEGRATION.md"` — expected: no results (all references updated or the file only referenced itself).

- [ ] **Step 13: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
docs: agent + project scaffold (AGENT.md, CLAUDE.md, CONTEXT.md, docs/)

Adds the equilibrium-style orientation scaffold: AGENT.md + CLAUDE.md
(handoff protocol, commands, deployment pointer), CONTEXT.md domain
glossary, docs/agents/{domain,issue-tracker}.md, docs/deployment-plan.md,
docs/adr/, .claude/hand-off/, .env.example, and a rewritten README.
Moves PAYLOAD_CMS_INTEGRATION.md into docs/. Deletes the obsolete
update-dep.sh.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

## Final verification (after all tasks)

- [ ] `pnpm install --frozen-lockfile` — clean
- [ ] `pnpm run lint` — runs (warnings OK, no crash)
- [ ] `pnpm exec tsc --noEmit` — no new errors vs. `248757c`
- [ ] `pnpm run test:int` — passes (Mongo reachable)
- [ ] `pnpm run build` — succeeds, `.next/standalone/server.js` present
- [ ] `pnpm exec prettier --check .` — clean
- [ ] `docker compose -f docker-compose.yml config` and `docker compose -f deploy/docker-compose.production.yml config` — valid
- [ ] `docker build --build-arg DATABASE_URL=... --build-arg PAYLOAD_SECRET=... -t aolausoro-test .` — succeeds (or documented as CI-deferred)
- [ ] Workflow YAML validates (`@action-validator/cli` or `actionlint`)
- [ ] `.claude/skills/payload/SKILL.md` resolves through the symlink
- [ ] `git status` clean; branch is `feature/refactor-portfolio`; every task committed
- [ ] Update `.claude/hand-off/handoff-aolausoro-2026-09-06.md` with the actual outcome and any deviations

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| 2.1 Package manager & workspace | Task 1, Task 4 (onlyBuiltDependencies) |
| 2.2 EditorConfig / Prettier | Task 1 (.editorconfig), Task 2 |
| 2.3 ESLint | Task 3 |
| 2.4 TypeScript | Task 5 (include/exclude), Task 4 (versions) |
| 2.5 Test stack swap | Task 5 |
| 2.6 Next.js / build config | Task 6 |
| 2.7 Docker & deploy | Task 8 |
| 2.8 GitHub Actions | Task 9 |
| 2.9 Dependencies — additions & alignment | Task 4, Task 5 (test deps), Task 3 (eslint deps), Task 6 (postcss deps) |
| 2.10 .gitignore | Task 5, Task 6 |
| 2.11 Misc root files | Task 1 (.vscode), Task 11 (README, .env.example, move integration doc) |
| 2.12 package.json scripts | Task 3, Task 5, Task 6 |
| 2.13 Husky / lint-staged | Task 3 |
| 3.1–3.3 Skills install | Task 10 |
| 3.4 AGENT.md | Task 11 |
| 3.5 CLAUDE.md | Task 11 |
| 3.6 CONTEXT.md | Task 11 |
| 3.7 docs/agents/* | Task 11 |
| 3.8 docs/deployment-plan.md | Task 11 |
| 3.9 health-check skill | Task 10 |
| Phase 3 (prune) | Out of scope — not in this plan, by design |

Health endpoint (`app/api/health/route.ts`) is not in the spec's file list but is required by spec §2.7's compose healthcheck and §2.8's deploy workflow — added as Task 7 and noted in the spec's decisions section during review.

**Placeholder scan:** No "TBD"/"implement later"/"add error handling" steps. Every code step has a full code block. Two places say "copy verbatim from `$EQ` at `<path>`" (setup-droplet.sh base, domain.md, issue-tracker.md, .vscode/settings.json) — these are concrete file-copy instructions with an exact source path, not placeholders, and each is followed by the explicit edits to apply.

**Type consistency:** `GET()` signature in Task 7 (`app/api/health/route.ts`, no args, returns `Promise<Response>`) matches its test import and the Task 8 compose healthcheck / Task 9 workflow poll of `/api/health`. `login()` in Task 5 (`tests/helpers/login.ts`) is exported but only consumed by future e2e tests (not by the Task 5 smoke test) — intentional, mirrors equilibrium. Image name `ghcr.io/nucternal18/aolausoro.tech-2` is identical across Task 8 (compose), Task 9 (both workflow jobs), and Global Constraints.
