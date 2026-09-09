# Design: Payload-only site — kill the old stack

**Date:** 2026-09-09
**Branch:** `feature/refactor-portfolio` (continues from P3.1a, HEAD `cfadc59`)
**Status:** Draft — awaiting review
**Depends on:** P3.1a complete + verified (`docs/superpowers/specs/2026-09-08-p3.1a-payload-backend-auth-design.md`)

## Context

`aolausoro.tech` — personal portfolio + CMS, migrating off a Clerk + Prisma + Redux +
inversify-DI stack onto Payload CMS 3.86. Phase 2 (tooling) and P3.1a (Payload
backend + admin + auth) are done. This spec is the combined **P3.2** —
everything needed for the site to run entirely on Payload with the old stack
deleted. It merges what was originally scoped as "finish the frontend" and
"delete the old stack" because they're inseparable: you can't delete a data
layer the frontend still imports.

**Out of scope — the data migration.** Moving the ~34 real docs in the old
`aolausoro` db (7 projects, 6 jobs, 12 wikis, 5 messages, 2 users, 2 cvs —
Prisma/Mongoose-shaped) into the fresh `portfolio` db is a **separate follow-up
spec** (P3.2b). This project runs against a fresh empty `portfolio` db with
content entered by hand for verification.

### Current state (verified 2026-09-09)

- **`app/(protected)/` is clean** — purely the Payload admin.
- **The public site (`app/(home)/`) still fetches via the old stack:**
  - `app/(home)/page.tsx` → `getCV()` + `getProjects()` (server actions in `components/admin-route-components/actions/*` → `src/` use-cases → Prisma) + `getPostsMeta()` (GitHub-repo MDX via `lib/posts.ts`).
  - `hooks/use-contact-controller.tsx` → `createMessage` / `sendMail` server actions.
  - `components/{home,portfolio-*,charts-*,wiki-card,...}` → `import type` from `@src/entities/models/*` (type-only, mechanical to swap).
  - `components/navigation/admin-nav-bar.tsx` + `components/page-btn-container.tsx` → Redux (`admin-route-components/global-redux-store`).
- **The blog is GitHub-repo MDX** — `lib/posts.ts` lists + fetches `.mdx` files from a separate repo via the GitHub API (`REPO_TOKEN`). **Zero `.mdx` files in this repo.** The old blog is retired entirely by this project.
- **A large Payload-website-template frontend port already exists** but is unwired and doesn't compile: `blocks/**` (incl. a full `Form/` block set), `heros/**`, `components/{RichText,Media,Link,Card,Pagination,PayloadRedirects,LivePreviewListener,AdminBar,CollectionArchive,PageRange}/`, `search/Component.tsx`. ~30 files. They use a **`@/*` import alias that isn't defined** in this repo's tsconfig (`@/utilities/*`, `@/components/*`, `@/payload-types`, `@/blocks/*`), and reference block types (`ArchiveBlock`, `CallToActionBlock`) not wired into `Posts`.
- `tsc --noEmit`: **148 errors** — almost all in `src/**`, `components/admin-route-components/**`, `app/(protected)/api/upload/**`, `prisma/generated/**`, and the unwired template files above.
- `pnpm run build` fails on the pre-existing Prisma-6 mongodb wasm resolution (P3.2 code). CI `Lint`/`Type-check`/`Build`/`Generate Prisma client` steps are `continue-on-error`.
- `@src/access/{anyone,authenticated,authenticatedOrPublished}.ts` — used by all 10 Payload collections. **These stay** (P3.2 keeps `src/access/`, deletes the rest of `src/`).

## Goal

The site runs **entirely on Payload CMS**. No Clerk, Prisma, Redux, inversify,
TanStack Query, contentlayer, or the DI/clean-architecture layer. `pnpm run
build` and `pnpm exec tsc --noEmit` are **green**. The CI `continue-on-error`
flags are dropped.

## Non-goals

- Data migration (P3.2b).
- Media storage move to DO Spaces + the `upload.ts` SSRF fix — **P3.3** (keep `cloudinary` + the local `public/media` staticDir until then).
- The Sentry keep/drop decision — **P3.3** (keep it wired here).
- Deploy infra provisioning — **P3.3**.
- Redesigning the portfolio's visual design — this is a re-plumb + wire, not a redesign. Existing portfolio components keep their markup/styles; only their data source changes.

## Approach: build → re-plumb → delete → prune

Each phase leaves `tsc`/`build` **no worse** than the phase before (they start
red and stay red until phase 6 — the gate per phase is "no *new* failure; error
count trends down"). Phases are ordered so the tree is always incrementally
verifiable — deleting first would leave a non-compiling tree with no way to
check progress.

---

## §1 — `@/*` alias + template-file imports

Add to `tsconfig.json` `paths` (this is what the whole template port assumes):

```jsonc
"@/*": ["./*"],
```

Then fix the template files' specifiers that `@/*` alone won't resolve — the
template uses `@/utilities/*` but this repo's dir is `utils/`, and some
`@/components/ui/*` paths differ:

- `@/utilities/<x>` → `@/utils/<x>` (or add `"@/utilities/*": ["./utils/*"]` as a second alias — **preferred**, less churn).
- `@/payload-types` → resolves via `@/*` to `./payload-types.ts` ✓ once the alias exists.
- `@/blocks/*`, `@/heros/*`, `@/fields/*`, `@/search/*` → resolve via `@/*` ✓.
- Block-type imports for blocks not in `Posts` (`ArchiveBlock`, `CallToActionBlock`, `ContentBlock`, `FormBlock`): either wire those blocks into the `Posts` `content` field's `BlocksFeature` (so `generate:types` emits them) **or** delete the unused block Components. Decision: **wire Banner/Code/MediaBlock/Content/CallToAction/MediaBlock into Posts** (they're the useful ones), keep the `Form` block for the contact form (§3), delete `ArchiveBlock` + `RelatedPosts`-as-a-block if unused.

**Gate:** `pnpm run generate:types` still exits 0; `tsc` error count drops
(template files start resolving). Add `@/*` + `@/utilities/*` and commit before
touching component internals.

---

## §2 — Payload blog frontend (greenfield)

Build the public rendering for the `Posts` collection. Reference:
`/Users/adewoyinoladipupo-usoro/devprojects/equilibrium/src/` — same template,
working.

### Components (wire the existing ported files)

| File | Role |
|---|---|
| `components/RichText/index.tsx` | Lexical JSON → React. Uses `@payloadcms/richtext-lexical/react` `RichText` + a `jsxConverters` map for the custom blocks. |
| `blocks/RenderBlocks.tsx` | dispatch `layout`/`content` blocks → their `Component.tsx` |
| `blocks/{Banner,Code,MediaBlock,Content,CallToAction}/Component.tsx` | the individual block renderers (already ported — wire + fix imports) |
| `heros/RenderHero.tsx` + `heros/{HighImpact,MediumImpact,LowImpact,PostHero}/index.tsx` | hero variants (Posts uses `PostHero`) |
| `components/Media/`, `components/Link/`, `components/Card/`, `components/Pagination/`, `components/PageRange/`, `components/CollectionArchive/` | shared template UI (already ported) |
| `components/LivePreviewListener/index.tsx` | client component; `useLivePreview` from `@payloadcms/live-preview-react` |
| `components/PayloadRedirects/index.tsx` | 404 → redirect lookup (uses `utils/getRedirects.ts`, `utils/getDocument.ts`) |

### Routes (new)

- `app/(home)/posts/page.tsx` — blog listing. `payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 12, page })`, render `CollectionArchive` + `Pagination`.
- `app/(home)/posts/[slug]/page.tsx` — single post. `queryPostBySlug` helper; render `PostHero` + `RichText` + `RenderBlocks`; `generateStaticParams` from published slugs; `generateMetadata` from `meta`; `draftMode` support for preview.
- `app/(home)/posts/[slug]/page.client.tsx` — `<LivePreviewListener />` mount.
- `app/next/preview/route.ts` + `app/next/exit-preview/route.ts` — Payload draft preview enable/disable (uses `PREVIEW_SECRET`).
- `app/(home)/search/page.tsx` — wire `search/Component.tsx` + `payload.find({ collection: 'search', ... })` (the search plugin indexes `posts`). **Optional** — defer if it balloons; the collection + plugin already exist.

### Config touch-ups

- `payload.config.ts` `admin.livePreview` already set (breakpoints). Add `url` per collection or globally.
- `Posts` `admin.livePreview.url` + `admin.preview` already call `generatePreviewPath` (`utils/generatePreviewPath.ts`) — verify it targets `/posts/[slug]`.
- `next.config.mjs` `images.remotePatterns` — already has the DO Spaces conditional; add nothing (media is local `public/media` until P3.3).

### Retire the old blog

- Delete `lib/posts.ts`, `app/(home)/blog/` (whole subtree), `components/{blog,blog-item,mdx-card,mdx-components,category-label,custom-image,callout,Video,Typography}.tsx` **if** only the old blog used them (audit each — `Video`/`custom-image` may be referenced by the new `RichText` converters; keep those).
- `mdx-components.tsx` (root) + `@next/mdx` in `next.config.mjs` — the site no longer renders MDX. Remove `withMDX` wrapper, `pageExtensions` mdx entries, `@next/mdx`, `@mdx-js/*`, `next-mdx-remote`, `rehype-*`, `remark-gfm`, `react-markdown` from deps (§5).

**Gate:** `pnpm run build` compiles the `app/(home)/posts/**` routes (may still fail later in `src/**` — that's phase 4). `tsc` in `blocks/`/`heros/`/`components/RichText` → 0 errors. A manual `/admin` post create → `/posts/[slug]` render check (needs the reviewer or the user, DB-dependent).

---

## §3 — Re-plumb the public site onto Payload's local API

### `app/(home)/page.tsx` + `components/home.tsx`

Replace:
```ts
const data = await getCV()              // → payload.find({ collection: 'cvs', limit: 1, sort: '-createdAt' })
const posts = await getPostsMeta()      // → payload.find({ collection: 'posts', where: { _status: 'published' }, limit: 3, sort: '-publishedAt' })
const projects = await getProjects()    // → payload.find({ collection: 'projects', where: { published: { equals: true } } })
```
Use a `getPayload({ config })` call (cached) in the RSC. `HomeComponent` prop
types change from `PartialProjectProps[]` → `Project[]` (from `payload-types`).

### `hooks/use-contact-controller.tsx` + `components/contact-form.tsx`

- `createMessage(data)` → `POST /api/messages` (Payload REST, `create: anyone` access) **or** a thin server action calling `payload.create({ collection: 'messages', data })`.
- `sendMail(data)` → keep the Resend call (it's independent of Prisma). Move it into the same server action, or a Payload `Messages` `afterChange` hook that emails on create (**preferred** — one place, fires for admin-created too). Uses `RESEND_API_KEY` + `EMAIL_FROM_*`.
- The Zod schema import (`@src/entities/models/Message`) → inline a small Zod schema in the hook, or use `react-hook-form` + a local schema.
- reCAPTCHA (`react-google-recaptcha`) — keep; it's client-only.

### Charts (`components/charts-container.tsx`, `charts/*.tsx`, `stats-*.tsx`)

These render job-application stats. Data source: a server component / action doing
`payload.find({ collection: 'jobs' })` + a client-side monthly aggregate (the
current `MonthlyApplicationProps` shape). Keep `recharts` (already a dep). Drop
`@tremor/react` if only charts used it (audit).

### Type-only import swap (mechanical)

Every `import type { …Props } from '@src/entities/models/*'` →
the corresponding `payload-types` interface:
- `PartialProjectProps` → `Project`
- `PartialWikiProps` → `Wiki`
- `MonthlyApplicationProps` / job types → derive from `Job`
- `PartialCvProps` → `Cv`
- `PartialMessageProps` → `Message`

Files: `components/{home,portfolio-component,portfolio-card,charts-container,wiki-card,...}.tsx` — grep `@src/entities/models` for the full list.

### `app/(home)/layout.tsx` — the `Providers` tree

Once no component reads Redux/TanStack, replace `<Providers>` (from
`admin-route-components/global-redux-store/providers.tsx`) with just what's left:
`next-themes` provider + the toaster + tooltip provider. Create a small
`components/providers.tsx` (or `providers/index.tsx`). Delete the old
`global-redux-store/` tree in phase 4.

**Gate:** `app/(home)/**` compiles against Payload types; no `@src/` or
`admin-route-components` import remains under `app/(home)/**` or `components/*`
(except the template dirs). `tsc` count down substantially.

---

## §4 — Delete the old stack

Only after §2–§3 leave nothing importing it (verify with `git grep`).

### Delete

| Path | Notes |
|---|---|
| `src/**` **except `src/access/`** | 118 files: `application/`, `interface-adapters/`, `infrastructure/`, `entities/`, `di/` |
| `components/admin-route-components/**` | 62 files: custom admin UI, Redux store, server actions |
| `prisma/`, `prisma.config.ts`, `prisma/generated/` | |
| `lib/prisma.ts`, `lib/prismadb.ts` | |
| `payload/hooks/sync-prisma.ts` | the Payload→Prisma user-sync hook |
| `app/(protected)/api/upload/pdf/route.ts`, `app/(protected)/api/upload/photos/route.ts` | Cloudinary+Clerk upload — replaced by Payload's `media`/`cvs` upload. **Re-check P3.3** if any client still calls these. |
| `components/navigation/admin-nav-bar.tsx` | Redux-driven old-admin nav |
| `components/page-btn-container.tsx` | if only old admin used it (audit — a `Pagination/` template one exists) |
| `hooks/use-user.ts` | already gone (P3.1a) |
| `data.tsx`, `routes.ts` | `routes.ts` gone (P3.1a); `data.tsx` — audit (nav link data; may still be used) |
| `utils/prismaErrorHandler.ts` | Prisma-specific |
| dead `components/*` from the old blog (§2) | audit each |

### Config follow-ups

- `next.config.mjs`: remove `serverExternalPackages: ['@prisma/client', 'bcryptjs']`, the `withMDX` wrapper, `@next/mdx` import, mdx `pageExtensions`. Keep `withPayload`, `withSentryConfig` (P3.3), `output: 'standalone'`, `redirects`, `turbopack`.
- `instrumentation.ts` / `sentry.*.config.ts` — keep (P3.3).
- `tsconfig.json` `paths`: drop `@di/*`, `@src/*` narrows to just `@src/access` (or move `src/access/` → `access/` and drop `@src` entirely — **preferred**, then `@access/*`).
- `tsconfig.json` `include`: drop `di/modules`, `.eslintrc.js`, `jest.config.js`, `cypress/...` (mostly gone already).

**Gate:** `git grep -nE "@src/(application|interface|infrastructure|entities|di)|admin-route-components|@prisma/client|prismadb|inversify|@reduxjs|react-redux|@tanstack/react-query"` → **nothing** (outside deleted files / this doc). `tsc` count drops to near-0.

---

## §5 — Prune dependencies

`pnpm remove` (deps): `@clerk/nextjs`, `svix`, `@prisma/client`, `@auth/prisma-adapter`, `@next-auth/prisma-adapter`, `next-auth`, `@reduxjs/toolkit`, `react-redux`, `next-redux-wrapper`, `inversify`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `@tanstack/react-table`, `contentlayer`, `@tremor/react` (if charts don't use it), `bcryptjs`, `jsonwebtoken`, `axios`, `moment`, `cookie`, `nookies`, `set-cookie-parser`, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `next-mdx-remote`, `react-markdown`, `remark-gfm`, `rehype-autolink-headings`, `rehype-highlight`, `rehype-pretty-code`, `rehype-slug`, `patch-package`, `mongodb` (Payload owns the driver), `express`.

`pnpm remove` (devDeps): `prisma`, `@types/jsonwebtoken` / `@types/bcryptjs` (if present), `@fullhuman/postcss-purgecss` (gone Phase 2), `postcss-*` leftovers.

**Keep:** `@payloadcms/*`, `payload`, `payload-totp`, `next`, `react*`, `@radix-ui/*` (shadcn — audit which are still used), `framer-motion`/`recharts`/`three` (if the portfolio UI uses them — audit), `react-hook-form` + `@hookform/resolvers` + `zod`, `resend` + `@react-email/*`, `react-google-recaptcha`, `sharp`, `geist`/fonts, `date-fns`, `lucide-react`, `tailwind*`, `@sentry/nextjs` (P3.3), `cloudinary` (P3.3).

Update `pnpm-workspace.yaml` `allowBuilds` — drop `@clerk/shared`, `@prisma/client`, `@prisma/engines`, `prisma`, `cypress` (gone), keep `esbuild`/`sharp`/`unrs-resolver`/`msw` (audit `msw`).

`.env.example` — drop the Cloudinary block only in P3.3; drop nothing else here (Clerk gone in P3.1a).

**Gate:** `pnpm install` clean; `pnpm install --frozen-lockfile` clean; lockfile shrinks materially; `pnpm run dev` starts without missing-module errors.

---

## §6 — Green build + un-gate CI

- `pnpm exec tsc --noEmit` — **0 errors** (or a documented tiny residual with a plan).
- `pnpm run build` — **succeeds**; `.next/standalone/server.js` produced; `pnpm run postbuild` (next-sitemap) runs.
- `pnpm run test:int` — all green (add int coverage for the new blog query helpers + the contact-form create path).
- `.github/workflows/ci.yml` — remove `continue-on-error: true` + the `# TODO(phase-3)` comments from the `Lint`, `Type-check`, `Build` steps. **`Generate Prisma client`** step + `pnpm run generate` script → **delete** (Prisma is gone).
- `docs/deployment-plan.md` — update the status table (`tsc`/`build` green; blog on Payload; old stack deleted).
- Handoff.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| The template frontend port has drifted from a working state and needs real debugging, not just import fixes. | equilibrium's `src/` is the same template, working — diff against it file by file. Phase 2 is the biggest unknown; timebox it and escalate if a component needs a rewrite. |
| Deleting a `components/*` file that the portfolio UI (not the old admin) actually uses. | Every deletion in §4 is preceded by a `git grep` for importers. Audit, don't assume. |
| `@/*` = `["./*"]` shadows or conflicts with the existing `@components/*`, `@utils/*` etc. aliases. | TS resolves the most specific match first; `@/*` is a fallback. Verify `tsc` count doesn't *rise* right after adding it. |
| Charts / stats components need data shapes the `jobs` collection doesn't produce. | The old `MonthlyApplicationProps` is a client-side aggregate of raw jobs — `payload.find({ collection: 'jobs' })` gives the raw rows; the aggregate logic moves client-side unchanged. |
| Contact-form email: moving `sendMail` into a Payload `afterChange` hook changes when it fires (also on admin edits). | Guard the hook on `operation === 'create'`. |
| `pnpm run build` still fails after §4 for a non-obvious reason (Turbopack, a Payload SSR quirk). | §6 is its own phase with room to debug; the per-phase gate is "no *new* failure", so regressions are caught early. |
| Scope: this is a large project the user declined to decompose further. | Phased tasks in the plan; each phase is independently committable and reviewable. Data migration explicitly deferred to P3.2b. |

## Open questions for review

1. **`src/access/` relocation** — move to `access/` at repo root (drop the `@src` alias entirely, cleaner) or leave in `src/access/` (less churn, keeps a lonely `src/` dir)?
2. **Search page** (`/search`) — build it in §2, or defer (the `search` collection + plugin stay, just no public UI)?
3. **`data.tsx`** — it holds nav-link data (`links`, social icons). Keep as a plain config module, or fold into a Payload global / `config/data.ts`?
4. **Charts / `@tremor/react` / `three` / `framer-motion`** — are the portfolio's 3D/animation bits still wanted, or is this a good moment to drop `three` (~600KB) and `framer-motion` too? (Affects §5's keep-list.)
5. **Contact email** — Payload `afterChange` hook vs. keep it in the server action. (Spec leans hook.)
