# P3.3a — Media on DO Spaces + Cloudinary Teardown — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Payload object storage to the DO Spaces bucket `aolausorotech`, migrate the 21 Cloudinary assets in as proper Payload uploads (`wiki.image`, `projects.screenshot`, CVs upload), and remove Cloudinary from the codebase.

**Architecture:** `s3Storage` plugin for `media` + `cvs`. A two-phase schema transition (add upload fields alongside the P3.2b text fields → run a `payload run` asset-migration script → drop the text fields + wire the frontend) so the migration can read the old Cloudinary URLs. `legacyId` fields and the `aolausoro` db are left intact for P3.3c.

**Tech Stack:** Payload CMS 3.86, `@payloadcms/storage-s3` 3.86, DO Spaces (S3-compatible, region `lon1`, CDN enabled), Vitest 4, TypeScript 5.9.

**Spec:** `docs/superpowers/specs/2026-09-10-p3-3a-media-spaces-design.md`

## Global Constraints

- `pnpm exec tsc --noEmit` → **0** after every task.
- `pnpm run test:int` stays green (currently 19; Task 6 adds one file). Zero skips.
- `pnpm run build` stays green.
- `pnpm exec prettier --check .` clean before every commit. Commits `--no-verify`, ending with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
  ```
- `pnpm run generate:types` after any collection-config change; commit the regenerated `payload-types.ts`.
- The asset-migration script asserts the Payload target DB is `portfolio` (`EXPECTED_DB` override), same guard as `migrate-legacy-data.ts`. Never writes to `aolausoro`.
- **Do NOT** touch: `sentry.*.config.ts`, `instrumentation.ts`, `withSentryConfig` (P3.3b); `.github/workflows/deploy-production.yml`, `Dockerfile`, `legacyId` fields, the `aolausoro` database (P3.3c).
- `@payloadcms/storage-s3` `s3Storage` API (verified in-tree): `{ acl, bucket, collections: { <slug>: { prefix, generateFileURL } }, config: S3ClientConfig }`. `disableLocalStorage` defaults `true`. `generateFileURL: ({ filename, prefix }) => string`.
- Payload `File` type (for local-API `create`/`update` `file:` arg): `{ data: Buffer; mimetype: string; name: string; size: number }`. `payload.update` accepts `file`.

---

### Task 1: Wire `s3Storage` for `media` + `cvs`

**Files:**
- Modify: `plugins/index.ts`
- Modify: `.env.example`
- Test: existing `tests/int/*` stay green

**Interfaces:**
- Produces: object storage for the `media` and `cvs` collections backed by DO Spaces; `Media` doc `url` and `cvs` doc `url` become `${DO_SPACES_CDN_ENDPOINT}/<prefix>/<filename>`.

- [ ] **Step 1: Add the plugin**

In `plugins/index.ts`, add the import at the top with the other plugin imports:

```ts
import { s3Storage } from '@payloadcms/storage-s3'
```

Above the `export const plugins: Plugin[] = [` line, add:

```ts
const spacesClientConfig = {
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || 'lon1',
  // DO Spaces uses virtual-hosted-style addressing (bucket.region.digitaloceanspaces.com).
  forcePathStyle: false,
}

const spacesCdnURL =
  (prefix: string) =>
  ({ filename }: { filename: string }) =>
    `${process.env.DO_SPACES_CDN_ENDPOINT}/${prefix}/${filename}`
```

As the **first** element of the `plugins` array:

```ts
  s3Storage({
    acl: 'public-read',
    bucket: process.env.DO_SPACES_BUCKET || '',
    collections: {
      media: { prefix: 'media', generateFileURL: spacesCdnURL('media') },
      cvs: { prefix: 'cvs', generateFileURL: spacesCdnURL('cvs') },
    },
    config: spacesClientConfig,
  }),
```

- [ ] **Step 2: `.env.example`**

Under the `# ─── Media storage — DigitalOcean Spaces` section, ensure these keys are present (add any missing):

```
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://<bucket>.lon1.cdn.digitaloceanspaces.com
DO_SPACES_BUCKET=<bucket>
DO_SPACES_KEY=YOUR_SPACES_ACCESS_KEY
DO_SPACES_SECRET=YOUR_SPACES_SECRET_KEY
```

(Leave the Cloudinary block for now — Task 5 removes it.)

- [ ] **Step 3: Verify**

```
pnpm run generate:types          # cvs/media types unchanged (no field changes yet)
pnpm exec tsc --noEmit           # 0
pnpm run test:int                # green — tests don't upload files, so no S3 calls
pnpm run build                   # green — plugin reads env at runtime; '' fallbacks keep build safe
```

If `tsc` complains that `endpoint` may be `undefined` in `S3ClientConfig`, that is allowed by the type (`endpoint?: string`). If it complains about `spacesClientConfig` not being `S3ClientConfig`, add `import type { S3ClientConfig } from '@aws-sdk/client-s3'` is **not** needed — instead inline the object directly into the `config:` key so it is contextually typed.

- [ ] **Step 4: Commit**

```bash
git add plugins/index.ts .env.example
git commit --no-verify -m "$(cat <<'EOF'
feat(storage): s3Storage plugin for media + cvs on DO Spaces

Object storage moves to the aolausorotech Spaces bucket (lon1, CDN
enabled). Reads served via the CDN endpoint. No schema change yet.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 2: Transitional schema — add upload fields alongside the text fields

**Files:**
- Modify: `payload/collections/Wiki/index.ts`
- Modify: `payload/collections/Projects/index.ts`
- Modify: `payload/collections/CVs/index.ts`
- Regenerate: `payload-types.ts`

**Interfaces:**
- Produces: `Wiki.image` (`string | Media | null`), `Project.screenshot` (`string | Media | null`, optional), and `cvs` is an `upload` collection — all **alongside** the still-present `Wiki.imageUrl` / `Project.url` / `Cv.cvUrl` text fields.

- [ ] **Step 1: `Wiki` — add `image`**

In `payload/collections/Wiki/index.ts`, immediately after the `imageUrl` text field, add:

```ts
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Replaces imageUrl; populated by the P3.3a asset migration.' },
    },
```

- [ ] **Step 2: `Projects` — add `screenshot` (not required yet)**

In `payload/collections/Projects/index.ts`, immediately after `slugField(),`, add:

```ts
    {
      name: 'screenshot',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Project screenshot. Populated by the P3.3a asset migration.' },
    },
```

Leave the `url` text field in place for now.

- [ ] **Step 3: `CVs` — make it an upload collection**

In `payload/collections/CVs/index.ts`, add the `upload` key to the config (after `admin:`):

```ts
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: 'public/cvs',
  },
```

Keep the `cvUrl` field but drop `required: true` from it (a migrated doc will briefly have neither a file nor be re-validated):

```ts
    {
      name: 'cvUrl',
      type: 'text',
      admin: { description: 'Legacy PDF URL. Removed after the P3.3a asset migration.' },
    },
```

- [ ] **Step 4: Regenerate + verify**

```
pnpm run generate:types
pnpm exec tsc --noEmit           # 0 — frontend still reads cv.cvUrl / project.url, both still exist
pnpm run test:int                # green
pnpm run build                   # green
pnpm exec prettier --write . && pnpm exec prettier --check .
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
feat(cms): transitional upload fields for the P3.3a asset migration

Adds Wiki.image, Projects.screenshot (both upload→media) and makes CVs
an upload collection, all alongside the surviving imageUrl/url/cvUrl
text fields so the migration can read the Cloudinary URLs.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 3: Asset-migration script

**Files:**
- Create: `payload/scripts/lib/mime.ts`
- Create: `payload/scripts/migrate-assets-to-spaces.ts`
- Modify: `tests/int/migration.int.spec.ts` (add `guessMimeType` cases)
- Consumes: `payload/scripts/lib/transforms.ts` is **not** needed here.

**Interfaces:**
- Produces: `guessMimeType(filename: string): string`
- Produces: `pnpm payload run payload/scripts/migrate-assets-to-spaces.ts` — idempotent, per-collection summary, non-zero exit on error.

- [ ] **Step 1: Write the failing test**

Append to `tests/int/migration.int.spec.ts`:

```ts
import { guessMimeType } from '../../payload/scripts/lib/mime'

describe('P3.3a mime', () => {
  it('maps common extensions', () => {
    expect(guessMimeType('a.webp')).toBe('image/webp')
    expect(guessMimeType('Screenshot 20.PNG')).toBe('image/png')
    expect(guessMimeType('cv.pdf')).toBe('application/pdf')
    expect(guessMimeType('x.jpg')).toBe('image/jpeg')
    expect(guessMimeType('x.jpeg')).toBe('image/jpeg')
    expect(guessMimeType('noext')).toBe('application/octet-stream')
  })
})
```

- [ ] **Step 2: Run — expect failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/migration.int.spec.ts`
Expected: FAIL — `Cannot find module '../../payload/scripts/lib/mime'`.

- [ ] **Step 3: Implement `mime.ts`**

`payload/scripts/lib/mime.ts`:

```ts
const MAP: Record<string, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  pdf: 'application/pdf',
}

export function guessMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return MAP[ext] ?? 'application/octet-stream'
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/migration.int.spec.ts`
Expected: PASS.

- [ ] **Step 5: Write the migration script**

`payload/scripts/migrate-assets-to-spaces.ts`:

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'
import { guessMimeType } from './lib/mime'

const CLOUDINARY_HOST = 'res.cloudinary.com'

type Counts = { read: number; migrated: number; skipped: number; errors: number }
const tally = (): Counts => ({ read: 0, migrated: 0, skipped: 0, errors: 0 })

async function ingest(payload: Payload, url: string, alt: string): Promise<string | number> {
  const parsed = new URL(url)
  if (parsed.host !== CLOUDINARY_HOST) {
    throw new Error(`refusing to fetch non-Cloudinary URL: ${url}`)
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  const data = Buffer.from(await res.arrayBuffer())
  const name = decodeURIComponent(parsed.pathname.split('/').pop() || 'asset')
  const mimetype = res.headers.get('content-type')?.split(';')[0]?.trim() || guessMimeType(name)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, name, mimetype, size: data.byteLength },
    overrideAccess: true,
  })
  return doc.id
}

async function main(): Promise<void> {
  console.log('P3.3a asset migration starting…')
  const payload = await getPayload({ config: await config })

  const dbName =
    (payload.db as unknown as { connection?: { name?: string } }).connection?.name ??
    (() => {
      try {
        return new URL(process.env.DATABASE_URL ?? '').pathname.replace(/^\//, '').split('?')[0]
      } catch {
        return undefined
      }
    })()
  const expected = process.env.EXPECTED_DB || 'portfolio'
  if (dbName !== expected) {
    throw new Error(`Refusing to run: target database is "${String(dbName)}", expected "${expected}"`)
  }

  const summary: Record<string, Counts> = {}

  // --- wiki: imageUrl (string) -> image (media ref) ---
  {
    const c = tally()
    summary.wiki = c
    const { docs } = await payload.find({
      collection: 'wiki',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of docs) {
      c.read++
      if (doc.image || typeof doc.imageUrl !== 'string' || !doc.imageUrl) {
        c.skipped++
        continue
      }
      try {
        const mediaId = await ingest(payload, doc.imageUrl, String(doc.title))
        await payload.update({
          collection: 'wiki',
          id: doc.id,
          data: { image: mediaId },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
        c.migrated++
      } catch (err) {
        c.errors++
        console.error(`  wiki ${doc.id} FAILED`, err)
      }
    }
  }

  // --- projects: url (string) -> screenshot (media ref) ---
  {
    const c = tally()
    summary.projects = c
    const { docs } = await payload.find({
      collection: 'projects',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of docs) {
      c.read++
      const legacyUrl = (doc as { url?: unknown }).url
      if (doc.screenshot || typeof legacyUrl !== 'string' || !legacyUrl) {
        c.skipped++
        continue
      }
      try {
        const mediaId = await ingest(payload, legacyUrl, String(doc.title))
        await payload.update({
          collection: 'projects',
          id: doc.id,
          data: { screenshot: mediaId },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
        c.migrated++
      } catch (err) {
        c.errors++
        console.error(`  project ${doc.id} FAILED`, err)
      }
    }
  }

  // --- cvs: cvUrl (string) -> attach PDF file to the doc ---
  {
    const c = tally()
    summary.cvs = c
    const { docs } = await payload.find({
      collection: 'cvs',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of docs) {
      c.read++
      const legacyUrl = (doc as { cvUrl?: unknown }).cvUrl
      if ((doc as { filename?: unknown }).filename || typeof legacyUrl !== 'string' || !legacyUrl) {
        c.skipped++
        continue
      }
      try {
        const parsed = new URL(legacyUrl)
        if (parsed.host !== CLOUDINARY_HOST) throw new Error(`non-Cloudinary: ${legacyUrl}`)
        const res = await fetch(legacyUrl)
        if (!res.ok) throw new Error(`fetch ${legacyUrl} -> ${res.status}`)
        const data = Buffer.from(await res.arrayBuffer())
        const name = decodeURIComponent(parsed.pathname.split('/').pop() || 'cv.pdf')
        await payload.update({
          collection: 'cvs',
          id: doc.id,
          file: {
            data,
            name: name.endsWith('.pdf') ? name : `${name}.pdf`,
            mimetype: 'application/pdf',
            size: data.byteLength,
          },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
        c.migrated++
      } catch (err) {
        c.errors++
        console.error(`  cv ${doc.id} FAILED`, err)
      }
    }
  }

  console.log('\n  collection    read  migrated  skipped  errors')
  let totalErrors = 0
  for (const [name, c] of Object.entries(summary)) {
    totalErrors += c.errors
    console.log(
      `  ${name.padEnd(12)}  ${String(c.read).padStart(4)}  ${String(c.migrated).padStart(8)}  ${String(
        c.skipped,
      ).padStart(7)}  ${String(c.errors).padStart(6)}`,
    )
  }
  console.log()
  process.exit(totalErrors > 0 ? 1 : 0)
}

try {
  await main()
} catch (err) {
  console.error('asset migration failed:', err)
  process.exit(1)
}
```

- [ ] **Step 6: Verify it compiles**

```
pnpm exec tsc --noEmit           # 0
pnpm exec prettier --write payload/scripts tests/int/migration.int.spec.ts
pnpm run test:int                # green (script not executed here)
```

If `tsc` flags `doc.image` / `doc.imageUrl` / `doc.screenshot` as unknown on the `wiki`/`projects` find result, that means Task 2's `generate:types` didn't land — re-run it. The `(doc as { url?: unknown })` casts cover fields that only exist transitionally.

- [ ] **Step 7: Commit**

```bash
git add payload/scripts tests/int/migration.int.spec.ts
git commit --no-verify -m "$(cat <<'EOF'
feat(p3.3a): asset-migration script — Cloudinary -> Spaces

pnpm payload run payload/scripts/migrate-assets-to-spaces.ts

Fetches each stored Cloudinary URL (host-validated), creates a Payload
media doc (s3Storage puts it in Spaces + generates sizes), links it to
Wiki.image / Projects.screenshot; attaches the CV PDFs to the cvs docs.
Idempotent; EXPECTED_DB guard; non-zero exit on error.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 4: Run the migration + verify assets in Spaces

**Files:** none (execution + verification).

**Interfaces:** consumes Task 3's script.

- [ ] **Step 1: Owner pre-work — real Spaces credentials**

`.env` (sandbox) and `.env.local` (machine) both need, with **real** values:
```
DO_SPACES_KEY=<real key — NOT the "your-DO..." placeholder currently in .env.local>
DO_SPACES_SECRET=<real secret>
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://aolausorotech.lon1.cdn.digitaloceanspaces.com
DO_SPACES_BUCKET=aolausorotech
```
If the key still has the `your-` prefix, **stop and ask the owner** — the migration will fail auth against Spaces.

- [ ] **Step 2: Run**

```
pnpm payload run payload/scripts/migrate-assets-to-spaces.ts
```
Expected summary:
```
  collection    read  migrated  skipped  errors
  wiki            12        12        0       0
  projects         7         7        0       0
  cvs              2         2        0       0
```
Exit 0.

- [ ] **Step 3: Verify in Spaces + Payload**

- List the bucket (DO console, or `aws s3 ls --endpoint-url https://lon1.digitaloceanspaces.com s3://aolausorotech/media/ --recursive` with the creds) — objects exist under `media/` (originals + `-<size>` derivatives) and `cvs/`.
- MCP `find` on `portfolio.media` — docs have `url` = `https://aolausorotech.lon1.cdn.digitaloceanspaces.com/media/...`, `sizes` populated.
- MCP `find` on `portfolio.wikis` — `image` is an ObjectId; `portfolio.projects` — `screenshot` set on all 7; `portfolio.cvs` — `filename` + `url` set.

- [ ] **Step 4: Re-run — idempotency**

```
pnpm payload run payload/scripts/migrate-assets-to-spaces.ts
```
Expected: every row `migrated=0, skipped=<n>`, exit 0.

- [ ] **Step 5: dev smoke**

```
pnpm run dev
```
- `/admin` → Media: thumbnails load from the CDN host.
- `/admin` → Wiki: a migrated doc shows its image.
- Home page: the published project card renders its screenshot from `aolausorotech.lon1.cdn.digitaloceanspaces.com` (check the `<img>` src / network tab).
- No `Cannot delete property` / no 404s on media.

If any asset 404s from the CDN, the bucket ACL or CDN propagation is the cause — note it and continue (the URLs are correct; propagation can lag a few minutes).

---

### Task 5: Commit B — drop text fields, wire frontend, remove Cloudinary

**Files:**
- Modify: `payload/collections/Wiki/index.ts`, `payload/collections/Projects/index.ts`, `payload/collections/CVs/index.ts`
- Modify: `components/portfolio-card.tsx`, `components/home.tsx`, `lib/utils.ts`
- Delete: `lib/cloudinary.ts`, `lib/env.ts`
- Modify: `types/index.d.ts`, `next.config.mjs`, `.env.example`, `package.json`, `pnpm-lock.yaml`
- Regenerate: `payload-types.ts`

**Interfaces:**
- Produces: final schema — `Wiki.image` only, `Projects.screenshot` (required), `cvs` upload-only. No `cloudinary` dependency.

- [ ] **Step 1: Drop the transitional text fields**

- `Wiki`: delete the `imageUrl` text field. Keep `image`.
- `Projects`: delete the `url` text field. On `screenshot`, add `required: true`.
- `CVs`: delete the `cvUrl` field entirely.

- [ ] **Step 2: Frontend**

- `components/portfolio-card.tsx`:
  ```ts
  import type { Media, Project } from '@/payload-types'
  // ...
  const shot = project.screenshot as Media | null
  // <Image src={shot?.url ?? ''} alt={project.title} ... />
  ```
  Guard the render so a missing `shot?.url` doesn't pass `""` to `next/image` — wrap the `<Image>` in `{shot?.url && ( ... )}`.
- `components/home.tsx`: `const cvUrl = cv?.url ?? undefined` (was `cv?.cvUrl`).
- `lib/utils.ts` `getLatestCV`: `return latestCV.url` (was `latestCV.cvUrl`).
- `git grep -n "cvUrl\|\.url\b" -- components app lib | grep -i cv` — no stragglers.

- [ ] **Step 3: Regenerate types + tsc**

```
pnpm run generate:types
pnpm exec tsc --noEmit           # 0
```
`Cv` now has upload fields (`url`, `filename`, `mimeType`, `filesize`, `sizes`, …) and no `cvUrl`. `Wiki` has `image`, no `imageUrl`. `Project` has `screenshot` (required), no `url`.

- [ ] **Step 4: Remove Cloudinary**

```bash
pnpm remove cloudinary
git rm lib/cloudinary.ts lib/env.ts
```

- `types/index.d.ts`: remove `import type { Env } from '@lib/env'` and change
  `interface ProcessEnv extends Env {}` to `interface ProcessEnv {}` (or delete
  the whole `declare global { namespace NodeJS { ... } }` block — run
  `git grep -n "process.env\." | head` first to confirm nothing relies on the
  augmentation for typing; plain string access does not).
- `next.config.mjs` `images.remotePatterns`: delete the `res.cloudinary.com`
  and `img.clerk.com` entries. Keep `cdn.jsdelivr.net`, `source.unsplash.com`,
  and the `DO_SPACES_CDN_ENDPOINT` conditional.
- `.env.example`: delete the `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` /
  `CLOUDINARY_API_SECRET` / `NEXT_PUBLIC_CLOUDINARY_NAME` /
  `NEXT_PUBLIC_CLOUDINARY_PRESET` lines and their comment.

- [ ] **Step 5: Verify**

```
pnpm install --frozen-lockfile   # clean after `pnpm remove`
pnpm exec tsc --noEmit           # 0
pnpm run test:int                # green
pnpm run build                   # green
pnpm exec prettier --write . && pnpm exec prettier --check .
git grep -in "cloudinary" -- ':!docs/' ':!*.md'   # nothing
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
feat(p3.3a): finalize Spaces uploads; remove Cloudinary

- drop transitional text fields (Wiki.imageUrl, Projects.url, CVs.cvUrl)
- Projects.screenshot now required; frontend reads screenshot/cv.url
- remove `cloudinary` dep, lib/cloudinary.ts, dead lib/env.ts
- trim res.cloudinary.com + img.clerk.com from next.config remotePatterns
- .env.example: Cloudinary block out, DO Spaces keys in

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 6: Media schema test, final verification, handoff

**Files:**
- Create: `tests/int/media.int.spec.ts`
- Modify: `docs/deployment-plan.md`
- Create: `.claude/hand-off/handoff-aolausoro-<today>-p3-3a.md`
- Modify: `.claude/hand-off/HANDOFF.md`

- [ ] **Step 1: Schema-shape test**

`tests/int/media.int.spec.ts`:

```ts
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('P3.3a media schema', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('cvs is an upload collection with no cvUrl field', () => {
    const cvs = payload.collections.cvs.config
    expect(cvs.upload).toBeTruthy()
    const names = cvs.fields.flatMap((f) => ('name' in f ? [f.name] : []))
    expect(names).not.toContain('cvUrl')
  })

  it('wiki has an image upload field and no imageUrl', () => {
    const fields = payload.collections.wiki.config.fields
    const image = fields.find((f) => 'name' in f && f.name === 'image')
    expect(image).toMatchObject({ type: 'upload', relationTo: 'media' })
    expect(fields.find((f) => 'name' in f && f.name === 'imageUrl')).toBeUndefined()
  })

  it('projects has a required screenshot upload and no url field', () => {
    const fields = payload.collections.projects.config.fields
    const shot = fields.find((f) => 'name' in f && f.name === 'screenshot')
    expect(shot).toMatchObject({ type: 'upload', relationTo: 'media', required: true })
    expect(fields.find((f) => 'name' in f && f.name === 'url')).toBeUndefined()
  })

  it('s3Storage is wired (media/cvs adapters present)', () => {
    // The plugin replaces the collection upload adapter; assert the config loaded.
    expect(payload.collections.media.config.upload).toBeTruthy()
  })
})
```

Run: `pnpm run test:int` — expect the new file green, total files +1.
If `payload.collections.<slug>.config.fields` shape differs in 3.86, adjust the
accessors to whatever exposes the sanitized fields (check an existing spec or
`payload.config.collections`).

- [ ] **Step 2: Full verification checklist**

- [ ] `pnpm install --frozen-lockfile` clean
- [ ] `pnpm exec tsc --noEmit` → 0
- [ ] `pnpm run test:int` → all green, zero skips
- [ ] `pnpm run build` → green, `.next/standalone/server.js` present
- [ ] `pnpm exec prettier --check .` clean
- [ ] `git grep -in "cloudinary" -- ':!docs/' ':!*.md'` → nothing
- [ ] MCP: `portfolio.media` count ≥ 19; all `wiki.image` / `projects.screenshot` set; `cvs` docs have `filename`
- [ ] `pnpm run dev`: home renders screenshots from the CDN, `/admin` media upload works

- [ ] **Step 3: Docs**

- `docs/deployment-plan.md`: flip "Media moved off Cloudinary to DO Spaces" to ✅ with a note (s3Storage for media+cvs, 21 assets migrated, `legacyId` + `aolausoro` deletion + deploy-env cleanup still P3.3c).
- New handoff `.claude/hand-off/handoff-aolausoro-<today>-p3-3a.md`: what moved, the Spaces layout (`media/`, `cvs/` prefixes), the env keys now required, that `.env.example` lost Cloudinary, and the P3.3b (Sentry verify) / P3.3c (infra + `legacyId` drop + `aolausoro` delete + workflow env cleanup) remainder.
- Update `.claude/hand-off/HANDOFF.md` standing context.

- [ ] **Step 4: Commit + push**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
test(p3.3a): media schema-shape spec; docs + handoff

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin feature/refactor-portfolio
```

---

## Self-Review

**Spec coverage:**
- §1 storage layer → Task 1 ✓
- §2 schema changes + Transition (two commits) → Task 2 (Commit A) + Task 5 (Commit B) ✓
- §3 asset migration script → Task 3; execution → Task 4 ✓
- §4 Cloudinary teardown → Task 5 Step 4 ✓
- §5 verification → Task 4 + Task 6 ✓
- §6 rollback → spec only (no task); additive-until-Task-5 property preserved by the task ordering ✓
- Pre-work (env keys) → Task 4 Step 1 ✓
- Out of scope (Sentry, legacyId, aolausoro, deploy workflow) → Global Constraints "Do NOT touch" ✓

**Placeholder scan:** no TBDs. `guessMimeType` fully implemented in Task 3. `<today>` in handoff filenames is intentional (resolve at execution).

**Type consistency:** `guessMimeType` signature (Task 3 Step 3) matches its test (Step 1) and its call site in `ingest` (Step 5). `ingest` returns `string | number` = a Payload doc id, assigned into `data: { image: mediaId }` / `{ screenshot: mediaId }` — Payload accepts an id for an upload field. `spacesCdnURL`/`spacesClientConfig` (Task 1) are local consts, not cross-task. `Wiki.image` / `Projects.screenshot` field names are consistent across Tasks 2, 3, 5, 6.

**Known soft spots:**
- `payload.collections.<slug>.config.fields` accessor shape (Task 6 Step 1) — flagged inline to adjust against 3.86 if needed.
- `payload.update` with `file:` on the `cvs` collection — verified `file?: File` exists on the local update operation type; if 3.86 rejects it at runtime for an already-created doc, Task 4 Step 2 will surface it as a `cv … FAILED` row and the fallback is delete + `create` (note it in the handoff and adjust the script).
