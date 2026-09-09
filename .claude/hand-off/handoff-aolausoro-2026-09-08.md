# Handoff — 2026-09-08

## What was done

**Phase 3 kicked off and decomposed into 4 sub-projects; P3.1a implemented.**

Decomposition (see the design spec for the full rationale):

| #         | Sub-project                                                                                                                                                                  | Status                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **P3.1a** | Payload backend + admin + full Clerk→Payload auth cutover                                                                                                                    | **implemented + verified** (commits `b8e64f3..7b2da0e`) — `test:int` 12/12 green against Atlas; only `/admin` UI render + TOTP UX need a browser |
| **P3.1b** | Finish the layout-builder frontend (`blocks/`, `heros/`, `RenderBlocks`, `RichText`, live-preview) + migrate existing data (old Atlas db → new `portfolio` db, same cluster) | spec/plan not written                                                                                                                            |
| **P3.2**  | Delete the old stack: `components/admin-route-components/`, `src/`, `prisma/`; drop `@clerk/nextjs` + `svix` + ~10 more dead deps; get `tsc`/`build` green                   | spec/plan not written                                                                                                                            |
| **P3.3**  | Cloudinary → DO Spaces (`s3Storage` + SSRF fix); re-verify Sentry (kept); drop CI `continue-on-error`, enable deploy, provision infra                                        | spec/plan not written                                                                                                                            |

Spec: `docs/superpowers/specs/2026-09-08-p3.1a-payload-backend-auth-design.md`
Plan: `docs/superpowers/plans/2026-09-08-p3.1a-payload-backend-auth.md`

### P3.1a commits

- `b8e64f3` — **Categories + CVs collections; config loads.** `payload.config.ts` now loads (`generate:types` succeeds). Categories unblocks the `Posts.categories` relationship. `plugins/index.ts` collection lists fixed to `posts`/`categories`; stale `Page` type → `Post`; `search/beforeSync.ts` → `import type`. `@payload-types/` alias repointed at the fresh root `payload-types.ts`; stale `types/payload-types.ts` (Nov snapshot) and dead `utils/getGlobals.ts` deleted. **Users rewritten to Payload native auth here** (had to be — `Users` imported the Clerk bridge, which blocked config load): 8h token, 5-attempt lockout; `email`/`clerkId`/`emailVerified` fields removed; `create` is admin-only (no public signup).
- `6dba19b` — **payload-totp enforced (env-gated).** Last in the plugin array; `forceSetup` on except `NODE_ENV=test` / `TOTP_FORCE_SETUP=false`; `disableAccessWrapper` keeps public reads working. `tests/int/auth.int.spec.ts` (login / wrong-password / 5-attempt lockout).
- `63c5ed9` — **Clerk code removed** (packages deferred). Deleted `clerk-auth.ts`, `proxy.ts` (was inert — no `middleware.ts`), `routes.ts`, the Clerk auth pages, the Clerk webhook, the public-nav Clerk UI, `hooks/use-user.ts`. `providers.tsx` loses only `ClerkProvider`. `.env.example` Clerk block gone. **`@clerk/nextjs` + `svix` stay in `package.json`** — their only remaining importers are the dead `admin-route-components/**` + `app/(protected)/api/upload/**`, which P3.2 deletes together with the packages. Removing them now just turns those files into "module not found" (tsc would spike to 164). tsc after this commit: **153**.
- `8a8ff19` — **Access matrix + field cleanup.** Projects `projectName`→`title` + `slugField()`, `read: anyone`. Wiki `read: authenticated` (owner-private), editor → `defaultLexical`. Messages + `read` checkbox. Jobs/Issues/Media/Users/CVs/Categories already matched. `tests/int/access.int.spec.ts`.
- `b47048c` — **`beforeDashboard` stat panel.** `components/admin/BeforeDashboard/index.tsx` — 4 cards (unread messages, open issues, project count, latest post). Registered in `admin.components.beforeDashboard`; importMap regenerated.
- `33c0f71` — **e2e helper + smoke test.** `tests/helpers/seedUser.ts` + `tests/e2e/admin.e2e.spec.ts` — the two files the Phase 2 final review flagged as missing.

## Verified (DB-independent — ran here)

- `pnpm run generate:types` — **exits 0**, config loads. `payload-types.ts` current with `Category`, `Cv`, `categories` on `Post`.
- `pnpm run generate:importmap` — exits 0; `importMap.js` current (BeforeDashboard + payload-totp components).
- `pnpm exec tsc --noEmit` — **148** (down from the 154 Phase-2 baseline).
- `pnpm run lint` — runs; 252 problems (44 err / 208 warn), down from 265.
- `pnpm exec prettier --check .` — clean.
- `git grep '@clerk'` — only `components/admin-route-components/**` + `app/(protected)/api/upload/**` (P3.2's).
- `pnpm run build` — still red, **no regression**: it now fails on the pre-existing Prisma-6 `@prisma/client/runtime/query_compiler_bg.mongodb.*` wasm resolution error (via `src/interface-adapters/**` → `admin-route-components/actions/projects.ts` → `app/(home)/page.tsx`) — all P3.2 code. The Clerk "async Server Actions" error that was the _first_ blocker in Phase 2 is gone (Clerk code deleted); the Prisma wasm error was always the next one. `tsc --noEmit`: **148**.

## Verified against Atlas (via the MongoDB MCP + a direct non-SRV connection string)

`pnpm run test:int` — **12/12 green, 4 files, zero skips**: Payload init, `categories`
resolves, native login + wrong-password + 5-attempt lockout, the full access matrix
(anon can create a Message, anon denied reading messages/jobs/issues/wiki/cvs, anon
allowed projects/categories/media, no public signup). `users` schema confirmed in Atlas:
`salt`/`hash`/`loginAttempts`/`lockUntil`/`sessions`, **no `clerkId`/`emailVerified`**.

Fixes made while verifying (commit `7b2da0e`): vitest env `jsdom`→`node` (jose JWT
signing needs a same-realm `Uint8Array`); int specs now isolate to a `<db>_test`
database via `vitest.setup.ts`; `access.int.spec.ts` asserts `rejects` (Payload 3.86
throws `Forbidden`, doesn't return empty).

### Still needs a browser (can't run headless here)

- Manual `/admin`: create the first user → **forced TOTP setup flow** → login → the 4
  `.before-dashboard` stat cards render → CRUD one doc per collection. (The queries
  behind the stat panel are proven by the int env; only the UI render + TOTP UX are unverified.)
- `pnpm run test:e2e` — needs `pnpm exec playwright install chromium`,
  `TOTP_FORCE_SETUP=false`, and a served app → effectively after P3.2 makes the build green.

### Cleanup the user needs to do

- The **first** (pre-fix) `test:int` run wrote 6 dummy users (`admin+…` / `lock+…`) to
  the real `portfolio` db before the `_test` isolation landed. `/admin` will show the
  login page, not create-first-user, until they're gone. Drop them:
  ```
  mongosh "<your srv uri>/portfolio" --eval 'db.users.deleteMany({email:/^(admin|lock)\+[0-9]+@aolausoro\.tech$/})'
  ```
  or drop the whole `portfolio` db (Payload recreates it) — it holds only test data so far.
  There is also a `portfolio_test` db (throwaway — the int suite's target); leave or drop it.

### Connection string note

This sandbox's Node can't do `mongodb+srv://` SRV lookups, so `.env` `DATABASE_URL` is
currently the **direct/non-SRV** form (`mongodb://…-shard-00-0{0,1,2}…:27017/…?replicaSet=atlas-10hfwu-shard-0&…`).
**On your machine, put the normal `mongodb+srv://…/portfolio` form back** — it's simpler and
survives Atlas shard reconfiguration. The old Prisma data is untouched in the `aolausoro` db name.

## Known issues / open — carried into P3.1b / P3.2 / P3.3

1. **`@clerk/nextjs` + `svix` still in `package.json`** — remove in P3.2 together with `components/admin-route-components/**` and `app/(protected)/api/upload/**`. Also `@clerk/shared` in `pnpm-workspace.yaml` allowBuilds.
2. **`pnpm run build` / `tsc` still red** — pre-existing Clerk/Prisma code in `src/**`, `admin-route-components/**`, `app/(protected)/api/upload/**`, `lib/prisma*.ts`. P3.2.
3. **~13 template-frontend files** (`blocks/*/Component.tsx`, `heros/**`, `components/RichText`, `search/Component.tsx`, `utils/generateMeta.ts`) use a `@/*` / `@/utilities/*` alias that doesn't exist here + reference block types (`ArchiveBlock`, `CallToActionBlock`) that aren't wired into any collection. **P3.1b** — the frontend port.
4. **`payload-totp` not verified against a live login flow** — the config loads and `generate:importmap` picks up its components, but the forced-setup UX + `disableAccessWrapper` behaviour need a manual `/admin` pass (item 2 above).
5. **`Projects.projectName` → `title` rename** — the P3.1b migration must map the old Prisma `Project.title`/`projectName` correctly. Jobs kept its field names (`position`/`company`); the old `Job.title`/`slug`/`createdBy` were vestigial — reconcile in the P3.1b migration mapping.
6. **`CVs` collection** — new; the old `CV` model had `cvUrl` (a string URL) + a 1:1 `user` relation. P3.1b migration turns those into `CVs` upload docs.
7. **SSRF in `components/admin-route-components/actions/upload.ts`** — still there; fold into P3.3's Cloudinary→Spaces work (that file uses Cloudinary + axios, both P3.3 removes).
8. **Deploy infra** — unchanged from Phase 2 (droplet, Atlas, Cloudflare cert, runner, secrets all ⬜). `docs/deployment-plan.md`.

## Next steps

1. **Verify P3.1a against Atlas** (the 3 items above). Fix anything that fails.
2. **P3.1b** — brainstorm + spec: finish the layout-builder frontend, then the data migration (`aolausoro` db → `portfolio` db). The `cms-migration` skill helps with the migration script.
3. **P3.2** — brainstorm + spec: the big delete (old stack + dead deps), get `tsc`/`build` green.
4. **P3.3** — storage + Sentry + deploy enablement + infra.

## Suggested Skills

- `/superpowers:brainstorming` — P3.1b and P3.2 scoping.
- `/payload` — the frontend port, the migration, access rules.
- `/cms-migration` — the P3.1b data migration script.
- `/health-check` — before P3.1b/P3.2 implementation.
