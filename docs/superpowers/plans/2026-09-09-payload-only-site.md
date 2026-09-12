# Payload-only site — kill the old stack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The site runs entirely on Payload CMS — Payload blog frontend built, public site re-plumbed onto Payload's local API, the Clerk/Prisma/Redux/inversify/DI stack deleted, ~30 dead deps pruned, `tsc --noEmit` and `pnpm run build` green, CI `continue-on-error` flags dropped.

**Architecture:** `aolausoro.tech` — Payload 3.86 + Next.js 16.2 portfolio. P3.1a made Payload the backend/admin/auth. This plan finishes the migration: it wires the already-ported (but non-compiling) Payload-website-template frontend (`blocks/`, `heros/`, `components/RichText`, etc.), moves the home page + contact form + charts off the old server-action/use-case/Prisma layer onto `payload.find`/`payload.create`, then deletes `src/` (keeping `src/access/` → moved to `access/`), `components/admin-route-components/`, and `prisma/`. Build → re-plumb → delete → prune, so the tree is always incrementally verifiable.

**Tech Stack:** Payload CMS 3.86.0, Next.js 16.2.6, React 19.2.6, `@payloadcms/richtext-lexical`, `@payloadcms/live-preview-react`, MongoDB (Atlas), pnpm 11, Vitest 4, TypeScript 5.9.

**Spec:** `docs/superpowers/specs/2026-09-09-payload-only-site-design.md`

**Reference:** `/Users/adewoyinoladipupo-usoro/devprojects/equilibrium` (`$EQ`) — the same Payload website template, working. Its `src/` is the canonical source for the blog frontend, `RichText`, `RenderBlocks`, heros, and the `utils/` helpers. `$EQ/src/app/(frontend)/posts/**` ↔ this repo's `app/(home)/posts/**`.

## Global Constraints

- **Package manager:** `pnpm` only (`packageManager: pnpm@11.24.0`). Node-binary scripts prefixed `cross-env NODE_OPTIONS=--no-deprecation`.
- **Database:** `.env` `DATABASE_URL` → the `portfolio` db. This sandbox's Node cannot do `mongodb+srv://` SRV lookups — use the **direct** connection form (`mongodb://…-shard-00-0{0,1,2}.hdg3l.mongodb.net:27017/portfolio?ssl=true&replicaSet=atlas-10hfwu-shard-0&authSource=admin&retryWrites=true&w=majority`). Integration tests auto-isolate to `portfolio_test` (via `vitest.setup.ts`).
- **tsc gate, per task:** `pnpm exec tsc --noEmit 2>&1 | grep -c ": error TS"` — the count MUST **not rise** and should **trend down**. Baseline entering this plan: **148**. Record the number in every task. By Task 15 it must be **0** (or a documented residual with a fix plan).
- **`pnpm run build`** starts red (pre-existing Prisma-6 wasm error in P3.2-deleted code). Per-task gate: "no *new* failure mode; fails no earlier than before." It must be **green after Task 15**.
- **`pnpm run test:int`** MUST stay green after every task (12/12 as of P3.1a).
- **`pnpm exec prettier --check .`** clean before each commit.
- **`pnpm run generate:types`** after any `payload.config.ts` / collection / block-wiring change; commit the regenerated `payload-types.ts`.
- **`git grep` before every deletion** — never delete a file with a live importer outside the deletion set.
- **Do NOT touch** in this plan: `sentry.*.config.ts`, `instrumentation.ts`, the `withSentryConfig` wrapper, `cloudinary` dep, `payload/collections/Media.ts` `staticDir` — all P3.3.
- **Commit messages** end with:
  ```

  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
  ```
- `git commit --no-verify`.

## Decisions carried from the spec

- `src/access/` → `access/` at repo root; `@src/*`/`@di/*` aliases dropped, `@access/*` added.
- `/search` page IS built (Task 6).
- `data.tsx` stays a plain module.
- Heavy UI deps (`three`, `framer-motion`, `@tremor/react`) — audit-and-keep in Task 14.
- Contact email = a `Messages` `afterChange` hook guarded on `operation === 'create'`.

---

## File Structure

**tsconfig `paths` additions (Task 1):** `@/utilities/ui` → `./lib/utils`; `@/utilities/*` → `./utils/*`; `@/*` → `./*`. **Removed (Task 12):** `@src/*`, `@di/*`, `@payload/importMaps`. **Added (Task 11):** `@access/*` → `./access/*`.

**Created:**
```
app/(home)/posts/page.tsx, page.client.tsx          # blog listing (+ pagination route)
app/(home)/posts/[slug]/page.tsx, page.client.tsx   # single post
app/(home)/posts/page/[pageNumber]/page.tsx, .client.tsx
app/(home)/search/page.tsx, page.client.tsx          # search results
app/next/preview/route.ts, app/next/exit-preview/route.ts   # draft preview enable/disable
components/providers/index.tsx                       # trimmed provider tree (themes+toaster+tooltip)
payload/collections/Messages/hooks/sendContactEmail.ts   # afterChange → Resend
tests/int/blog.int.spec.ts, tests/int/contact.int.spec.ts
access/{anyone,authenticated,authenticatedOrPublished}.ts   # moved from src/access/
```

**Modified:** `tsconfig.json`, `payload.config.ts` (block wiring, livePreview url), `plugins/index.ts` (already `posts`-scoped), `payload/collections/Posts/index.ts` (BlocksFeature list), `payload/collections/Messages/index.ts` (hook), `next.config.mjs` (drop MDX + prisma externals), `app/(home)/page.tsx`, `app/(home)/layout.tsx`, `components/home.tsx`, `components/contact-form.tsx`, `hooks/use-contact-controller.tsx`, `components/charts-container.tsx` + `components/charts/*`, `components/{portfolio-component,portfolio-card,wiki-card,github-repo-card}.tsx`, all `payload/collections/*` (import `@access` not `@src/access`), `package.json` + `pnpm-lock.yaml` + `pnpm-workspace.yaml`, `.github/workflows/ci.yml`, `docs/deployment-plan.md`, `payload-types.ts`.

**Deleted:** `src/**` (except moved `access/`), `components/admin-route-components/**`, `prisma/**`, `prisma.config.ts`, `lib/prisma.ts`, `lib/prismadb.ts`, `lib/posts.ts`, `payload/hooks/sync-prisma.ts`, `app/(protected)/api/upload/{pdf,photos}/route.ts`, `app/(home)/blog/**`, `components/navigation/admin-nav-bar.tsx`, `mdx-components.tsx`, `utils/prismaErrorHandler.ts`, dead old-blog `components/*` (audited), `data.tsx` (only if unused — audit).

---

## Task 1: `@/*` aliases + verify the template port resolves

**Files:** `tsconfig.json`

- [ ] **Step 1:** Add to `tsconfig.json` `compilerOptions.paths`, in this order (most specific first):
```jsonc
"@/utilities/ui": ["./lib/utils"],
"@/utilities/*": ["./utils/*"],
"@/*": ["./*"],
```
- [ ] **Step 2:** `pnpm run generate:types` — exits 0 (no config change, sanity check).
- [ ] **Step 3:** `pnpm exec tsc --noEmit 2>&1 | grep -c ": error TS"` — record. It MUST **drop** (the ~30 template files under `blocks/`, `heros/`, `components/{RichText,Media,Link,Card,Pagination,PayloadRedirects,LivePreviewListener,AdminBar,CollectionArchive,PageRange}/`, `search/Component.tsx` start resolving their `@/…` imports). If it *rises*, `@/*: ["./*"]` is shadowing an existing alias — inspect and narrow.
- [ ] **Step 4:** `pnpm exec tsc --noEmit 2>&1 | grep ": error TS" | grep -E "blocks/|heros/|components/(RichText|Media|Link|Card|Pagination|PayloadRedirects|LivePreviewListener|CollectionArchive|PageRange)/" | head -40` — list the residual errors in the template files. These are Task 2/3's to fix (block-type mismatches, missing `payload-types` members).
- [ ] **Step 5: Commit** `tsconfig.json`.

---

## Task 2: Wire the layout-builder blocks into Posts; fix block Component imports

**Files:** `payload/collections/Posts/index.ts`, `blocks/{Banner,Code,MediaBlock,Content,CallToAction}/config.ts` + `Component.tsx`, `blocks/RenderBlocks.tsx`, `payload-types.ts`

- [ ] **Step 1:** In `payload/collections/Posts/index.ts`, the `content` richText field's `BlocksFeature` currently has `[Banner, Code, MediaBlock]`. Add `CallToAction` (import `blocks/CallToAction/config`). Leave `ArchiveBlock` / `RelatedPosts`-as-block OUT (RelatedPosts is a relationship field, not a block).
- [ ] **Step 2:** Decide per block Component whether it's kept: `Banner`, `Code`, `MediaBlock`, `CallToAction`, `Content` — keep. `ArchiveBlock` — **delete** `blocks/ArchiveBlock/` (not wired, references `CollectionArchive` which is only for a Pages-archive the site doesn't have). `RelatedPosts` — keep `blocks/RelatedPosts/Component.tsx` (used by the post page as a component, not a block) but delete its `config.ts` if it has one.
- [ ] **Step 3:** For each kept block `Component.tsx`, diff against `$EQ/src/blocks/<Name>/Component.tsx` and align. Fix imports to this repo's aliases. The block-props types come from `payload-types` (`BannerBlock`, `CodeBlock`, `MediaBlock`, `CallToActionBlock`) — regenerate types first (Step 4) so they exist.
- [ ] **Step 4:** `pnpm run generate:types` — `payload-types.ts` now emits `BannerBlock`, `CodeBlock`, `MediaBlock`, `CallToActionBlock` interfaces. Commit it.
- [ ] **Step 5:** `blocks/RenderBlocks.tsx` — align with `$EQ/src/blocks/RenderBlocks.tsx`; its `blockComponents` map keys must match the wired block slugs.
- [ ] **Step 6:** `pnpm exec tsc --noEmit` — the `blocks/` errors clear. Record count (down). `pnpm run test:int` green.
- [ ] **Step 7: Commit.**

---

## Task 3: RichText + RenderHero + shared template components

**Files:** `components/RichText/index.tsx`, `heros/RenderHero.tsx` + `heros/{HighImpact,MediumImpact,LowImpact,PostHero}/index.tsx`, `heros/config.ts`, `components/{Media,Link,Card,Pagination,PageRange,CollectionArchive,PayloadRedirects,LivePreviewListener}/`

- [ ] **Step 1:** Overwrite `components/RichText/index.tsx` with `$EQ/src/components/RichText/index.tsx` verbatim (it already uses `@/blocks/*`, `@/components/*`, `@/utilities/ui`, `@/payload-types` — all now resolvable). Its `jsxConverters` blocks map = `banner`/`mediaBlock`/`code`/`cta` — matches Task 2's wired blocks.
- [ ] **Step 2:** For `heros/RenderHero.tsx` + each `heros/*/index.tsx` + `heros/config.ts` — diff against `$EQ/src/heros/**` and align. `Posts` uses `PostHero`; the `hero` field on Posts (if present) drives `RenderHero`. If Posts has no `hero` field, keep only `PostHero` and delete `HighImpact`/`MediumImpact`/`LowImpact` + `RenderHero` + `heros/config.ts`.
- [ ] **Step 3:** For `components/{Media,Link,Card,Pagination,PageRange,CollectionArchive,PayloadRedirects,LivePreviewListener}/` — diff against `$EQ/src/components/**`, align imports. These are mechanical.
- [ ] **Step 4:** `utils/` helpers the above need (`getMediaUrl`, `getRedirects`, `getDocument`, `generateMeta`, `generatePreviewPath`, `mergeOpenGraph`, `useClickableCard`, `formatAuthors`, `getURL`, `formatDateTime`) — all exist; diff any that error against `$EQ/src/utilities/<same>` and align.
- [ ] **Step 5:** `pnpm run generate:types && pnpm exec tsc --noEmit` — `components/RichText`, `heros/`, the shared component dirs → 0 errors. Record count. `pnpm run test:int` green.
- [ ] **Step 6: Commit.**

---

## Task 4: Blog routes — listing, single post, pagination, preview

**Files:** `app/(home)/posts/**`, `app/next/{preview,exit-preview}/route.ts`, `payload.config.ts` (livePreview url)

- [ ] **Step 1:** Copy `$EQ/src/app/(frontend)/posts/{page.tsx,page.client.tsx}` → `app/(home)/posts/`; `$EQ/src/app/(frontend)/posts/[slug]/{page.tsx,page.client.tsx}` → `app/(home)/posts/[slug]/`; `$EQ/src/app/(frontend)/posts/page/[pageNumber]/{page.tsx,page.client.tsx}` → `app/(home)/posts/page/[pageNumber]/`. Fix: import specifiers already use `@/…` (fine); remove any `Pages`/global refs that don't exist here.
- [ ] **Step 2:** Copy `$EQ/src/app/(frontend)/next/preview/route.ts` + `next/exit-preview/route.ts` → `app/next/`. They read `PREVIEW_SECRET` — add it to `.env` + `.env.example`.
- [ ] **Step 3:** `payload.config.ts` — verify/add `admin.livePreview` (breakpoints exist) and that `Posts` `admin.livePreview.url` + `admin.preview` (via `utils/generatePreviewPath.ts`) resolve to `/posts/[slug]`. Adjust `generatePreviewPath.ts` if it hardcodes a different path.
- [ ] **Step 4:** Root layout / route-group: the posts routes need the `(home)` layout. Confirm `app/(home)/layout.tsx` doesn't break them (it currently wraps in `<Providers>` — fine until Task 10).
- [ ] **Step 5:** `pnpm run build 2>&1 | tail -30` — the build now *compiles* `app/(home)/posts/**` (it will still fail later, in `src/**` — that's Task 12). Confirm no *new* early failure in the posts routes. `pnpm exec tsc --noEmit` — record (down). `pnpm run test:int` green.
- [ ] **Step 6:** `tests/int/blog.int.spec.ts` — create a draft + published post via `payload.create`, assert the `[slug]` query helper returns published-only for anon and drafts for `overrideAccess`. (Adapt the helper into a testable `queryPostBySlug` export or test `payload.find` directly.)
- [ ] **Step 7: Commit.**

---

## Task 5: Retire the old MDX blog

**Files:** delete `lib/posts.ts`, `app/(home)/blog/**`, `mdx-components.tsx`; edit `next.config.mjs`; audit `components/*`

- [ ] **Step 1:** `git grep -l "lib/posts\|@lib/posts\|getPostsMeta\|getPostByName"` — every importer. `app/(home)/page.tsx` uses `getPostsMeta` (Task 7 re-plumbs it to Payload first — **do Task 7 before this step's deletion, or stub `page.tsx` here**). Sequence: this task runs AFTER Task 7. (Reorder note: Tasks 7–9 re-plumb; Task 5 can be folded to run after them. Keeping the number for spec-mapping; execute 7→8→9→5.)
- [ ] **Step 2:** `git rm lib/posts.ts mdx-components.tsx`; `git rm -r "app/(home)/blog"`.
- [ ] **Step 3:** Audit each of `components/{blog,blog-item,mdx-card,category-label,custom-image,callout,Video,Typography,date}.tsx` with `git grep -l`. Delete the ones with zero importers after the blog deletion. **Keep** any referenced by `components/RichText` converters or the new post pages (`Video`, `custom-image` likely stay).
- [ ] **Step 4:** `next.config.mjs` — remove `import createMDX from '@next/mdx'`, the `withMDX` wrapper (`config = withPayload(withMDX(nextConfig))` → `withPayload(nextConfig)`), `mdxRs` from `experimental`, and `'mdx'` from `pageExtensions`.
- [ ] **Step 5:** `pnpm exec tsc --noEmit` (down), `pnpm run build` (no new failure), `pnpm run test:int` (green).
- [ ] **Step 6: Commit.**

---

## Task 6: `/search` page

**Files:** `app/(home)/search/{page.tsx,page.client.tsx}`, `search/Component.tsx`

- [ ] **Step 1:** Copy `$EQ/src/app/(frontend)/search/{page.tsx,page.client.tsx}` → `app/(home)/search/`. Align `search/Component.tsx` with `$EQ/src/search/Component.tsx` (imports `@/components/ui/input`, `@/utilities/useDebounce` — now resolvable).
- [ ] **Step 2:** The `search` collection + `searchPlugin({ collections: ['posts'] })` already exist (P3.1a). The page queries `payload.find({ collection: 'search', where: { 'title': { like: q } } })` per equilibrium.
- [ ] **Step 3:** `pnpm exec tsc --noEmit` (down), `pnpm run build` (no new failure), `test:int` green.
- [ ] **Step 4: Commit.**

---

## Task 7: Re-plumb the home page onto Payload

**Files:** `app/(home)/page.tsx`, `components/home.tsx`

- [ ] **Step 1:** Rewrite `app/(home)/page.tsx` as an RSC using `getPayload({ config })`:
```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeComponent from '@/components/home'

export default async function Page() {
  const payload = await getPayload({ config })
  const [projects, cvs, posts] = await Promise.all([
    payload.find({ collection: 'projects', where: { published: { equals: true } }, limit: 50, sort: '-createdAt' }),
    payload.find({ collection: 'cvs', limit: 1, sort: '-createdAt', overrideAccess: true }),
    payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 3, sort: '-publishedAt', depth: 1 }),
  ])
  return <HomeComponent projects={projects.docs} cv={cvs.docs[0] ?? null} posts={posts.docs} />
}
```
- [ ] **Step 2:** `components/home.tsx` — change prop types: `projects: Project[]`, `cv: Cv | null`, `posts: Post[]` (from `@/payload-types`). Remove the `@src/entities/models/*` type imports. Adjust field access (`project.projectName` → `project.title`; `project.url` was the Cloudinary image URL — check `home.tsx`/`portfolio-card.tsx` usage and map to the right field; the old `Project` had `url` = screenshot, `address` = live URL, `github` = repo — the Payload `Projects` has `url`, `address`, `github` — align names).
- [ ] **Step 3:** `components/{portfolio-component,portfolio-card,github-repo-card}.tsx` — same type swap (`PartialProjectProps` → `Project`), field-name alignment.
- [ ] **Step 4:** `pnpm exec tsc --noEmit` (down — home + portfolio components clear), `pnpm run build` (no new failure), `test:int` green.
- [ ] **Step 5: Commit.**

---

## Task 8: Re-plumb the contact form + email hook

**Files:** `hooks/use-contact-controller.tsx`, `components/contact-form.tsx`, `payload/collections/Messages/{index.ts,hooks/sendContactEmail.ts}`, `tests/int/contact.int.spec.ts`

- [ ] **Step 1:** Create `payload/collections/Messages/hooks/sendContactEmail.ts` — a `CollectionAfterChangeHook` that, when `operation === 'create'`, calls Resend (`RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`) to notify the owner. Reference `$EQ` form-builder email handling for the Resend client shape (`@payloadcms/email-resend` is configured on `payload.config.ts` — use `payload.sendEmail(...)` rather than a raw Resend call). Swallow/log errors so a failed email doesn't fail the submission.
- [ ] **Step 2:** Wire it in `payload/collections/Messages/index.ts`: `hooks: { afterChange: [sendContactEmail] }`.
- [ ] **Step 3:** `hooks/use-contact-controller.tsx` — replace `createMessage` / `sendMail` (from `admin-route-components/actions/messages`) with a `fetch('/api/messages', { method: 'POST', body: JSON.stringify(data) })` (Payload REST, `create: anyone`). Replace the `@src/entities/models/Message` Zod schema with a local `z.object({...})` in the hook or `components/contact-form.tsx`. Keep `react-hook-form` + `react-google-recaptcha`.
- [ ] **Step 4:** `components/contact-form.tsx` — align field names with the `Messages` collection (`name`, `email`, `subject`, `message`).
- [ ] **Step 5:** `tests/int/contact.int.spec.ts` — `payload.create({ collection: 'messages', data, overrideAccess: false })` succeeds (anon); assert the doc lands with `read: false`. (Email hook: mock `payload.sendEmail` or assert it's called — keep light.)
- [ ] **Step 6:** `pnpm run generate:types`, `pnpm exec tsc --noEmit` (down), `pnpm run test:int` green (+ the new contact spec), `pnpm run build` (no new failure).
- [ ] **Step 7: Commit.**

---

## Task 9: Re-plumb charts + finish the type-import swap

**Files:** `components/charts-container.tsx`, `components/charts/{area-chart,bar-chart}.tsx`, `components/{wiki-card}.tsx`, `lib/utils.ts`, plus any residual `@src/entities/models` importer

- [ ] **Step 1:** `git grep -l "@src/entities/models" -- '*.ts' '*.tsx' | grep -v "src/\|admin-route-components/"` — the remaining files (should be `charts-container`, `charts/*`, `wiki-card`, `lib/utils`). For each, swap the type import for the `@/payload-types` equivalent (`MonthlyApplicationProps` → derive from `Job`; `PartialWikiProps` → `Wiki`).
- [ ] **Step 2:** Charts data source: create a small server component or `app/(home)/page.tsx` addition that does `payload.find({ collection: 'jobs', limit: 500 })` and passes `docs` to `charts-container`. The monthly-aggregate logic stays client-side. If charts render on a dedicated route, wire there.
- [ ] **Step 3:** `lib/utils.ts` — if it only imports a *type* from `@src/entities/models`, inline the type or use `@/payload-types`. (`cn` itself is unaffected.)
- [ ] **Step 4:** `pnpm exec tsc --noEmit` — **zero `@src/entities` errors remain**. Record count. `pnpm run test:int` green.
- [ ] **Step 5: Commit.**

---

## Task 10: Trim the provider tree

**Files:** `components/providers/index.tsx` (new), `app/(home)/layout.tsx`

- [ ] **Step 1:** `git grep -l "useAppSelector\|useAppDispatch\|useSelector\|useDispatch\|@tanstack/react-query\|useQuery\|useMutation" -- '*.tsx' | grep -v "admin-route-components/"` — confirm **no public-site component** still reads Redux or TanStack Query (Tasks 7–9 should have cleared them). If any remain, fix them first.
- [ ] **Step 2:** Create `components/providers/index.tsx` — `NextThemeProvider` (from the existing `admin-route-components/global-redux-store/theme-provider.tsx`, copied out) + `TooltipProvider` + `<Toaster />`. No Redux, no TanStack, no Clerk.
- [ ] **Step 3:** `app/(home)/layout.tsx` — import `Providers` from `@/components/providers` instead of `@components/admin-route-components/global-redux-store/providers`.
- [ ] **Step 4:** `pnpm exec tsc --noEmit` (down), `pnpm run build` (no new failure), `test:int` green.
- [ ] **Step 5: Commit.**

---

## Task 11: Move `src/access/` → `access/`

**Files:** `access/*.ts` (new), `tsconfig.json`, all `payload/collections/*`, `payload.config.ts`

- [ ] **Step 1:** `git mv src/access access` (moves `anyone.ts`, `authenticated.ts`, `authenticatedOrPublished.ts`).
- [ ] **Step 2:** `tsconfig.json` `paths` — replace `"@src/*": [...]` with `"@access/*": ["./access/*"]`. (Keep other `@…` aliases.)
- [ ] **Step 3:** `git grep -l "@src/access"` — every file (all 10 collections + `payload.config.ts` + `Posts`/`Categories`/`CVs`). `sed`/edit each `@src/access/` → `@access/`.
- [ ] **Step 4:** `access/authenticated.ts` imports `@payload-types/` — confirm still resolves (it does — `@payload-types/*` → root `payload-types.ts`).
- [ ] **Step 5:** `pnpm run generate:types && pnpm exec tsc --noEmit` (must not rise), `pnpm run test:int` green.
- [ ] **Step 6: Commit.**

---

## Task 12: Delete the old stack

**Files:** delete `src/**`, `components/admin-route-components/**`, `prisma/**`, `prisma.config.ts`, `lib/prisma*.ts`, `payload/hooks/sync-prisma.ts`, `app/(protected)/api/upload/{pdf,photos}/route.ts`, `components/navigation/admin-nav-bar.tsx`, `utils/prismaErrorHandler.ts`

- [ ] **Step 1: Pre-delete audit.** For each deletion target, `git grep -l "<import path>"` and confirm every importer is itself in the deletion set. Specifically check: `data.tsx` (`git grep -l "data\.tsx\|@/data\|from ['\"].*data['\"]"` — if a nav component imports it, KEEP `data.tsx`), `components/page-btn-container.tsx` (kept or deleted — audit), `components/charts/*` (kept — re-plumbed Task 9).
- [ ] **Step 2:** `git rm -r src components/admin-route-components prisma`; `git rm prisma.config.ts lib/prisma.ts lib/prismadb.ts payload/hooks/sync-prisma.ts utils/prismaErrorHandler.ts components/navigation/admin-nav-bar.tsx`; `git rm -r "app/(protected)/api/upload"`.
- [ ] **Step 3:** `components/navigation/app-sidebar.tsx` / `Navbar.tsx` — remove any remaining import of `admin-nav-bar` / deleted components.
- [ ] **Step 4:** `git grep -nE "@src/(application|interface-adapters|infrastructure|entities|di)|@di/|admin-route-components|@prisma/client|prismadb|from ['\"].*lib/prisma|inversify|getInjection"` — **MUST be empty** (outside this plan doc / the deleted tree). Fix any straggler.
- [ ] **Step 5:** `pnpm run generate:types` (config still loads — `sync-prisma` hook removal: check `payload.config.ts` / `Users` don't reference it), `pnpm exec tsc --noEmit` — count drops to **near-0** (only dep-related "cannot find module" for still-installed-but-unused packages, cleared in Task 14). `pnpm run test:int` green.
- [ ] **Step 6: Commit.**

---

## Task 13: `next.config.mjs` + `tsconfig.json` cleanup

**Files:** `next.config.mjs`, `tsconfig.json`

- [ ] **Step 1:** `next.config.mjs` — remove `serverExternalPackages: ['@prisma/client', 'bcryptjs']`. Confirm `withMDX` already gone (Task 5). Keep `withPayload`, `withSentryConfig`, `output: 'standalone'`, `redirects`, `turbopack`, `images`.
- [ ] **Step 2:** `tsconfig.json` — remove `@di/*`, `@payload/importMaps`, and any `include` entries for deleted paths (`di/modules`, `.eslintrc.js`, `jest.config.js`, `cypress/...`). Keep `@access/*`, `@payload-config`, `@payload-types/*`, `@/*`, and the repo's other `@…/*` aliases.
- [ ] **Step 3:** `pnpm run generate:types`, `pnpm exec tsc --noEmit` (down/flat), `pnpm run build 2>&1 | tail -30` — the Prisma-6 wasm error should now be **gone** (no `@prisma/client` import remains). Record what the build does now (likely a few "cannot find module" for unused deps → Task 14, or green).
- [ ] **Step 4: Commit.**

---

## Task 14: Prune dependencies

**Files:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`

- [ ] **Step 1: Audit the "keep-list unknowns"** — `git grep -l "<pkg>"` for each of: `three`, `@react-three/*`, `framer-motion`, `@tremor/react`, `@tanstack/react-table`, `msw`, `swr`, `@uidotdev/usehooks`, `use-places-autocomplete`, `react-day-picker`, `cmdk`, `recharts`, `highlight.js`, `shiki`, `sonner`, `validator`, each `@radix-ui/*`, each `@react-email/*`. Record which have zero importers.
- [ ] **Step 2: `pnpm remove`** (deps) the confirmed-dead set: `@clerk/nextjs`, `svix`, `@prisma/client`, `@auth/prisma-adapter`, `@next-auth/prisma-adapter`, `next-auth`, `@reduxjs/toolkit`, `react-redux`, `next-redux-wrapper`, `inversify`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `contentlayer`, `bcryptjs`, `jsonwebtoken`, `axios`, `moment`, `cookie`, `nookies`, `set-cookie-parser`, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `next-mdx-remote`, `react-markdown`, `remark-gfm`, `rehype-autolink-headings`, `rehype-highlight`, `rehype-pretty-code`, `rehype-slug`, `patch-package`, `mongodb`, `express` — plus any from Step 1 confirmed dead (`three`, `framer-motion`, `@tremor/react`, `@tanstack/react-table` likely).
- [ ] **Step 3: `pnpm remove -D`**: `prisma`, `@types/jsonwebtoken`, `@types/bcryptjs` (if present), `patch-package`.
- [ ] **Step 4:** `pnpm-workspace.yaml` `allowBuilds` — drop `@clerk/shared`, `@prisma/client`, `@prisma/engines`, `prisma`, `cypress`. Keep `esbuild`, `sharp`, `unrs-resolver`, `msw` (if kept).
- [ ] **Step 5:** `package.json` — remove the `"generate": "prisma generate"` script. Remove `"postinstall"` if it ran `patch-package`.
- [ ] **Step 6:** `pnpm install` — clean. `pnpm install --frozen-lockfile` — clean. Lockfile shrinks materially (commit it).
- [ ] **Step 7:** `pnpm exec tsc --noEmit` — any residual "cannot find module" now means a still-imported package was removed — re-add it or fix the import. Target: **0**. `pnpm run test:int` green.
- [ ] **Step 8: Commit.**

---

## Task 15: Green build + un-gate CI

**Files:** `.github/workflows/ci.yml`, `docs/deployment-plan.md`, `.claude/hand-off/handoff-aolausoro-<today>.md`

- [ ] **Step 1:** `pnpm exec tsc --noEmit` — **0 errors**. If a small residual remains, document it + a fix path; do not ship > 5.
- [ ] **Step 2:** `pnpm run build` — **succeeds**. `ls .next/standalone/server.js`. `pnpm run postbuild` (next-sitemap) runs. If it fails, debug here (this task has room) — likely a Payload SSR / Turbopack quirk in one of the new routes; check against `$EQ`'s working build.
- [ ] **Step 3:** `pnpm run test:int` — all green (api, auth, access, health, blog, contact).
- [ ] **Step 4:** `.github/workflows/ci.yml` — remove `continue-on-error: true` + the `# TODO(phase-3)` comments from `Lint`, `Type-check`, `Build`. **Delete** the `Generate Prisma client` step entirely.
  - `Lint` step: `pnpm run lint` still has warnings/errors from the old `.eslintrc` un-muting — if `eslint .` exits non-zero on *errors*, either fix the errors (small triage) or keep `Lint` as `continue-on-error` with a fresh `# TODO: eslint triage` and note it. Type-check + Build must be blocking.
- [ ] **Step 5:** `docs/deployment-plan.md` — status table: `tsc`/`build` green; blog on Payload; old stack deleted; Prisma gone. Update the "known follow-ups".
- [ ] **Step 6:** Write the handoff: P3.2 done, the new dep count, what P3.2b (data migration) and P3.3 (storage/Sentry/deploy) inherit.
- [ ] **Step 7: Commit + push the branch.**

---

## Final verification (after all tasks)

- [ ] `pnpm install --frozen-lockfile` — clean; lockfile materially smaller than P3.1a.
- [ ] `pnpm exec tsc --noEmit` — **0** (or ≤5 documented).
- [ ] `pnpm run build` — succeeds; `.next/standalone/server.js` present; `postbuild` runs.
- [ ] `pnpm run test:int` — all green, zero skips.
- [ ] `pnpm exec prettier --check .` — clean.
- [ ] `git grep -nE "@clerk|svix|@prisma|prismadb|inversify|@reduxjs|react-redux|@tanstack/react-query|next-mdx-remote|contentlayer|admin-route-components|@src/(application|di|entities|infrastructure|interface-adapters)"` — **nothing** (outside `docs/` + `.superpowers/`).
- [ ] Manual (user, against Atlas + a browser): `/` renders projects/CV from Payload · contact form submits + owner gets the email · `/posts` lists + `/posts/[slug]` renders a post with blocks · `/admin` live-preview updates a post · `/search` returns results.
- [ ] `.github/workflows/ci.yml` — Type-check + Build are blocking (not `continue-on-error`); no Prisma step.

---

## Self-Review

**Spec coverage:**

| Spec § | Tasks |
|---|---|
| §1 `@/*` alias + template imports | Task 1, Task 2 (block-type tail), Task 3 (component tail) |
| §2 blog frontend (RichText, RenderBlocks, heros) | Tasks 2, 3 |
| §2 blog routes + preview | Task 4 |
| §2 `/search` page | Task 6 |
| §2 retire old MDX blog | Task 5 (executes after 7–9) |
| §3 re-plumb home page | Task 7 |
| §3 re-plumb contact form + email hook | Task 8 |
| §3 charts + type-import swap | Task 9 |
| §3 provider-tree trim | Task 10 |
| §4 `src/access` → `access/` | Task 11 |
| §4 delete old stack | Task 12 |
| §4 next.config / tsconfig cleanup | Task 13 |
| §5 dep prune | Task 14 |
| §6 green build + un-gate CI | Task 15 |
| Decision 1 (`@access/*`) | Task 11 |
| Decision 2 (`/search`) | Task 6 |
| Decision 5 (email hook) | Task 8 |
| Decision 4 (audit heavy deps) | Task 14 Step 1 |

**Execution order note:** Tasks are numbered for spec-mapping but **execute 1→2→3→4→6→7→8→9→5→10→11→12→13→14→15**. Task 5 (delete old blog) must run after Tasks 7–9 re-plumb `app/(home)/page.tsx` off `getPostsMeta`. The plan text in Task 5 Step 1 says this.

**Placeholder scan:** No "TBD"/"implement later". Copy-heavy tasks say "copy from `$EQ/src/<exact path>` and align imports" — a concrete instruction with an exact source, followed by the specific edits. "Audit each with `git grep -l`" is a real step, not a placeholder — deletions are gated on it.

**Type consistency:** `HomeComponent` props (Task 7: `projects: Project[]`, `cv: Cv | null`, `posts: Post[]`) match the `components/home.tsx` edits in the same task. `queryPostBySlug` (Task 4, from `$EQ`) returns `Post | null`, consumed by the `[slug]` page in the same file. `@access/*` (Task 11) replaces `@src/access/*` everywhere in one task. `sendContactEmail` is a `CollectionAfterChangeHook` (Task 8 Step 1) wired in `Messages.hooks.afterChange` (Step 2) — consistent.

**Risk of the big-unknown (Task 3 — the template port's actual state):** mitigated by `$EQ/src` being the same template, working — every file has a canonical diff target. If a component needs a real rewrite rather than an import fix, that's an escalation point, not a silent slog.
