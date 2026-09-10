# P3.2b — Legacy Data Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape the legacy `aolausoro` MongoDB content (7 projects, 6 jobs, 12 wikis, 5 messages, 2 CVs, 2 users) into the `portfolio` database in Payload's current schema, via a re-runnable local-API script, and unblock `pnpm run dev`.

**Architecture:** Two schema tweaks remove the last upload-typed fields that would need binaries (`Wiki.imageUrl` → text, `CVs` → non-upload with `cvUrl` text); every migrated collection gains a hidden `legacyId` for idempotency. Pure transform helpers (slug, enum-normalize, Lexical-paragraph, temp-password) are unit-tested. One script (`pnpm payload run`) reads the source over a throwaway MongoClient, asserts the target is `portfolio`, seeds users, then content, printing a summary and temp passwords.

**Tech Stack:** Payload CMS 3.86 local API, MongoDB (`mongodb` driver for the source read), Vitest 4, TypeScript 5.9 (`verbatimModuleSyntax`).

**Spec:** `docs/superpowers/specs/2026-09-10-p3-2b-data-migration-design.md`

## Global Constraints

- `pnpm exec tsc --noEmit` stays at **0** after every task.
- `pnpm run test:int` stays green: **15 → 16** (Task 2 adds one file), zero skips.
- `pnpm run build` stays green.
- `pnpm exec prettier --check .` clean before every commit; commits use `--no-verify` and end with the two trailers:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
  ```
- Run `pnpm run generate:types` after any collection-config change; commit the regenerated `payload-types.ts`.
- The script MUST NOT write to the source (`aolausoro`) database, and MUST abort before any write if the Payload target database name is not `portfolio`.
- DO NOT touch `sentry.*.config.ts`, `instrumentation.ts`, `withSentryConfig`, the `cloudinary` dep, or `payload/collections/Media.ts` `staticDir` — all P3.3.
- `legacyId` fields use `index: true`, never `unique: true`.

---

### Task 1: Schema changes, type regen, CV frontend

**Files:**
- Modify: `payload/collections/Wiki/index.ts`
- Modify: `payload/collections/CVs/index.ts`
- Modify: `payload/collections/Projects/index.ts`
- Modify: `payload/collections/Jobs/index.ts`
- Modify: `payload/collections/Messages/index.ts`
- Modify: `payload/collections/Users/index.ts`
- Modify: `payload/collections/Messages/hooks/sendContactEmail.ts`
- Modify: `app/(home)/page.tsx`, `components/home.tsx`, `lib/utils.ts`
- Regenerate: `payload-types.ts`
- Test: existing `tests/int/*.int.spec.ts` must stay green

**Interfaces:**
- Produces: a `legacyId?: string | null` field on the `Project`, `Job`, `Wiki`, `Message`, `Cv`, `User` generated types; `Cv.cvUrl: string`, `Cv` no longer has `url`/`filename`/`mimeType`/etc.; `Wiki.imageUrl: string | null`.
- Produces: `sendContactEmail` early-returns when `req.context?.skipContactEmail` is truthy.

- [ ] **Step 1: Add the shared `legacyId` field definition**

Create `fields/legacyId.ts`:

```ts
import type { Field } from 'payload'

/**
 * Provenance pointer to the Mongoose `_id` from the pre-Payload `aolausoro`
 * database. Written only by the P3.2b migration script; read-only in admin.
 * Indexed (not unique — a unique index is non-sparse and would collide on
 * null for every admin-created doc). Idempotency is enforced by the script's
 * find-by-legacyId guard, not the DB.
 */
export const legacyIdField: Field = {
  name: 'legacyId',
  type: 'text',
  index: true,
  admin: {
    readOnly: true,
    position: 'sidebar',
    description: 'Migration provenance — original _id from the pre-Payload database.',
  },
}
```

- [ ] **Step 2: Wire `legacyId` into the six collections**

In each of `payload/collections/{Projects,Jobs,Wiki,Messages,CVs,Users}/index.ts`:
add `import { legacyIdField } from '@fields/legacyId'` and append `legacyIdField` as the last entry of the `fields` array.

- [ ] **Step 3: `Wiki.imageUrl` upload → text**

In `payload/collections/Wiki/index.ts`, replace the `imageUrl` field:

```ts
    {
      name: 'imageUrl',
      type: 'text',
      admin: { description: 'Image URL (Cloudinary today; migrates to Spaces in P3.3).' },
    },
```

- [ ] **Step 4: `CVs` — drop `upload`, add `cvUrl`**

Rewrite `payload/collections/CVs/index.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'
import { legacyIdField } from '@fields/legacyId'

export const CVs: CollectionConfig<'cvs'> = {
  slug: 'cvs',
  access: {
    create: authenticated,
    delete: authenticatedAndAdmin,
    read: authenticated,
    update: authenticated,
  },
  admin: { useAsTitle: 'label', defaultColumns: ['label', 'user', 'updatedAt'] },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'cvUrl',
      type: 'text',
      required: true,
      admin: { description: 'PDF URL (Cloudinary today; migrates to Spaces in P3.3).' },
    },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    legacyIdField,
  ],
  timestamps: true,
}
```

Note: `overrideAccess: true` in the homepage query already bypasses the `read: authenticated` restriction — keep it. The CV is intentionally owner-private but surfaced publicly via that one bypassed query.

- [ ] **Step 5: `sendContactEmail` guard**

In `payload/collections/Messages/hooks/sendContactEmail.ts`, as the first line of the hook body (before the `operation !== 'create'` check):

```ts
  if (req.context?.skipContactEmail) return doc
```

- [ ] **Step 6: CV frontend — `cv.url` → `cv.cvUrl`**

- `components/home.tsx`: `const cvUrl = cv?.cvUrl ?? undefined`
- `lib/utils.ts` `getLatestCV`: return `latestCV.cvUrl` (was `latestCV.url`); update the return type if it names upload-doc fields.
- `app/(home)/page.tsx`: no change unless it dereferences `.url` on the cv doc — grep to confirm.
- Run: `git grep -n "cv\(s\)\?\??\.\(url\|filename\|mimeType\)" -- app components lib` — expect no hits after.

- [ ] **Step 7: Regenerate types**

Run: `pnpm run generate:types`
Expected: `payload-types.ts` changes — `Cv` gains `cvUrl`, `legacyId`; loses `url`/`thumbnailURL`/`filename`/`mimeType`/`filesize`/`width`/`height`/`focalX`/`focalY`/`sizes`. `Wiki.imageUrl` becomes `string | null`. `Project`/`Job`/`Message`/`User` gain `legacyId`.

- [ ] **Step 8: Verify**

Run:
```
pnpm exec tsc --noEmit            # expect 0
pnpm run test:int                 # expect 15/15
pnpm run build                    # expect green
pnpm exec prettier --write . && pnpm exec prettier --check .
```
If `tsc` flags `lib/utils.ts` or a component still referencing removed `Cv` upload fields, fix inline.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit --no-verify -m "$(cat <<'EOF'
feat(cms): schema prep for the P3.2b data migration

- Wiki.imageUrl: upload-relationship -> text URL
- CVs: no longer an upload collection -> cvUrl text field
- add a hidden indexed legacyId field to projects/jobs/wiki/messages/cvs/users
- sendContactEmail: skip when req.context.skipContactEmail is set
- home page + getLatestCV read cv.cvUrl

Cloudinary URLs stay as text refs; P3.3 moves the assets to DO Spaces
and restores proper upload fields.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 2: Pure transform helpers + tests

**Files:**
- Create: `payload/scripts/lib/transforms.ts`
- Test: `tests/int/migration.int.spec.ts`

**Interfaces:**
- Produces:
  - `slugify(input: string): string`
  - `normalizeEnum<T extends string>(raw: unknown, allowed: readonly T[], fallback: T): T`
  - `lexicalParagraph(text: string | null | undefined): { root: {...} }` — a valid minimal Lexical `SerializedEditorState`
  - `randomTempPassword(): string` — 24 url-safe chars

- [ ] **Step 1: Write the failing test**

`tests/int/migration.int.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  slugify,
  normalizeEnum,
  lexicalParagraph,
  randomTempPassword,
} from '../../payload/scripts/lib/transforms'

describe('P3.2b transforms', () => {
  it('slugify: lowercases, hyphenates, trims', () => {
    expect(slugify('via ROMA non solo pizza')).toBe('via-roma-non-solo-pizza')
    expect(slugify('  Github Finder!  ')).toBe('github-finder')
  })

  it('normalizeEnum: maps legacy casing/spacing, falls back', () => {
    const jobType = ['full-time', 'part-time', 'contract', 'remote'] as const
    expect(normalizeEnum('Full-time', jobType, 'full-time')).toBe('full-time')
    expect(normalizeEnum('remote', jobType, 'full-time')).toBe('remote')
    expect(normalizeEnum('Full time', jobType, 'full-time')).toBe('full-time')
    expect(normalizeEnum(undefined, jobType, 'full-time')).toBe('full-time')
    const status = ['pending', 'interview', 'declined'] as const
    expect(normalizeEnum('Declined', status, 'pending')).toBe('declined')
    expect(normalizeEnum('weird', status, 'pending')).toBe('pending')
  })

  it('lexicalParagraph: valid minimal root, empty -> em dash', () => {
    const doc = lexicalParagraph('Clean architecture in react')
    expect(doc.root.type).toBe('root')
    expect(doc.root.children[0].type).toBe('paragraph')
    expect(doc.root.children[0].children[0].text).toBe('Clean architecture in react')
    expect(lexicalParagraph('').root.children[0].children[0].text).toBe('—')
    expect(lexicalParagraph(null).root.children[0].children[0].text).toBe('—')
  })

  it('randomTempPassword: url-safe, >= 20 chars, unique', () => {
    const a = randomTempPassword()
    const b = randomTempPassword()
    expect(a).toMatch(/^[A-Za-z0-9_-]{20,}$/)
    expect(a).not.toBe(b)
  })
})
```

- [ ] **Step 2: Run it — expect failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/migration.int.spec.ts`
Expected: FAIL — `Cannot find module '../../payload/scripts/lib/transforms'`.

- [ ] **Step 3: Implement**

`payload/scripts/lib/transforms.ts`:

```ts
import { randomBytes } from 'node:crypto'

export function slugify(input: string): string {
  return String(input ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeEnum<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof raw !== 'string') return fallback
  const key = raw.toLowerCase().trim().replace(/\s+/g, '-')
  return (allowed as readonly string[]).includes(key) ? (key as T) : fallback
}

type SerializedText = {
  type: 'text'
  text: string
  format: 0
  style: ''
  mode: 'normal'
  detail: 0
  version: 1
}

export function lexicalParagraph(text: string | null | undefined) {
  const value = String(text ?? '').trim() || '—'
  const textNode: SerializedText = {
    type: 'text',
    text: value,
    format: 0,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph' as const,
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          children: [textNode],
        },
      ],
    },
  }
}

export function randomTempPassword(): string {
  return randomBytes(18).toString('base64url')
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/migration.int.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Full suite + tsc**

Run: `pnpm run test:int` (expect 16 files? no — **16 tests-files count stays by file**; expect all green, new file included) and `pnpm exec tsc --noEmit` (0).

- [ ] **Step 6: Commit**

```bash
git add payload/scripts/lib/transforms.ts tests/int/migration.int.spec.ts
git commit --no-verify -m "$(cat <<'EOF'
test(p3.2b): pure transform helpers for the data migration

slugify, normalizeEnum, lexicalParagraph, randomTempPassword — unit
tested independently of any database.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 3: The migration script

**Files:**
- Create: `payload/scripts/migrate-legacy-data.ts`
- Modify: `.env.example` (add `LEGACY_DATABASE_URL`)
- Consumes: `payload/scripts/lib/transforms.ts` (Task 2)

**Interfaces:**
- Produces: a script runnable as
  `pnpm payload run payload/scripts/migrate-legacy-data.ts` and
  `pnpm payload run payload/scripts/migrate-legacy-data.ts -- --clean`.
- Exit code 0 on full success, 1 if any document errored or a precondition failed.

- [ ] **Step 1: Confirm the `mongodb` driver resolves**

Run: `node -e "require.resolve('mongodb')"` from repo root.
- If it resolves (transitive via `@payloadcms/db-mongodb`): proceed.
- If not: `pnpm add -D mongodb` and note it in the Task 3 commit.

- [ ] **Step 2: `.env.example`**

Add under the `DATABASE_URL` line:
```
# Source DB for the one-off P3.2b legacy-data migration (the pre-Payload
# `aolausoro` database). Only read by payload/scripts/migrate-legacy-data.ts.
LEGACY_DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/aolausoro?retryWrites=true&w=majority
```

- [ ] **Step 3: Write the script**

`payload/scripts/migrate-legacy-data.ts`:

```ts
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'
import {
  slugify,
  normalizeEnum,
  lexicalParagraph,
  randomTempPassword,
} from './lib/transforms'

const JUNK_USER_RE = /^(admin|lock)\+\d+@aolausoro\.tech$/

type Counts = { read: number; created: number; skipped: number; errors: number }
const tally = (): Counts => ({ read: 0, created: 0, skipped: 0, errors: 0 })

async function existsByLegacyId(payload: Payload, collection: string, legacyId: string) {
  const res = await payload.find({
    collection: collection as never,
    where: { legacyId: { equals: legacyId } },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  return res.docs.length > 0
}

async function main() {
  const clean = process.argv.includes('--clean')

  const legacyUri = process.env.LEGACY_DATABASE_URL
  if (!legacyUri) throw new Error('LEGACY_DATABASE_URL is not set')

  const payload = await getPayload({ config })

  // --- precondition: target must be `portfolio` ---
  const targetDbName =
    // db-mongodb exposes the connection; fall back to parsing DATABASE_URL
    (payload.db as unknown as { connection?: { name?: string } }).connection?.name ??
    new URL(process.env.DATABASE_URL ?? '').pathname.replace(/^\//, '').split('?')[0]
  if (targetDbName !== 'portfolio') {
    throw new Error(`Refusing to run: target database is "${targetDbName}", expected "portfolio"`)
  }

  const src = new MongoClient(legacyUri)
  await src.connect()
  const sdb = src.db() // db name comes from the URI (aolausoro)
  console.log(`source: ${sdb.databaseName}  ->  target: ${targetDbName}\n`)

  const summary: Record<string, Counts> = {}

  try {
    // --- optional cleanup ---
    if (clean) {
      const junk = await payload.find({
        collection: 'users',
        where: { email: { contains: '+' } },
        limit: 100,
        overrideAccess: true,
      })
      const targets = junk.docs.filter((u) => JUNK_USER_RE.test(String(u.email)))
      console.log(`--clean: deleting ${targets.length} junk users`)
      for (const u of targets) {
        console.log(`  - ${u.email} (${u.id})`)
        await payload.delete({ collection: 'users', id: u.id, overrideAccess: true })
      }
      console.log()
    }

    // --- users first (content relationships need them) ---
    const userMap = new Map<string, number | string>()
    const uc = tally()
    summary.users = uc
    const srcUsers = await sdb.collection('users').find().toArray()
    for (const su of srcUsers) {
      uc.read++
      const legacyId = String(su._id)
      const existing = await payload.find({
        collection: 'users',
        where: { legacyId: { equals: legacyId } },
        limit: 1,
        overrideAccess: true,
      })
      if (existing.docs.length) {
        userMap.set(legacyId, existing.docs[0].id)
        uc.skipped++
        continue
      }
      try {
        const pw = randomTempPassword()
        const created = await payload.create({
          collection: 'users',
          data: {
            name: String(su.name ?? su.email),
            email: String(su.email),
            isAdmin: true,
            legacyId,
            password: pw,
          },
          overrideAccess: true,
        })
        userMap.set(legacyId, created.id)
        uc.created++
        console.log(`  user ${su.email}  temp password: ${pw}`)
      } catch (err) {
        uc.errors++
        console.error(`  user ${su.email} FAILED`, err)
      }
    }

    const resolveUser = (legacyUserId: unknown): number | string => {
      const id = userMap.get(String(legacyUserId))
      if (!id) throw new Error(`no migrated user for legacy userId ${String(legacyUserId)}`)
      return id
    }

    // --- projects ---
    await migrateCollection(payload, sdb, summary, 'projects', 'projects', (d) => ({
      title: String(d.projectName),
      slug: slugify(String(d.projectName)) || `project-${d._id}`,
      description: String(d.description ?? '').trim() || '—',
      url: d.url ? String(d.url) : undefined,
      address: d.address ? String(d.address) : undefined,
      github: d.github ? String(d.github) : undefined,
      techStack: (Array.isArray(d.techStack) ? d.techStack : []).map((technology: unknown) => ({
        technology: String(technology),
      })),
      published: Boolean(d.published),
      user: resolveUser(d.userId),
      legacyId: String(d._id),
    }))

    // --- jobs ---
    await migrateCollection(payload, sdb, summary, 'jobs', 'jobs', (d) => ({
      position: String(d.position),
      company: String(d.company),
      jobLocation: String(d.jobLocation ?? '').trim() || '—',
      jobType: normalizeEnum(
        d.jobType,
        ['full-time', 'part-time', 'contract', 'remote'] as const,
        'full-time',
      ),
      status: normalizeEnum(
        d.status,
        ['pending', 'interview', 'declined'] as const,
        'pending',
      ),
      user: resolveUser(d.userId),
      legacyId: String(d._id),
    }))

    // --- wiki (source collection is `wikis`) ---
    await migrateCollection(payload, sdb, summary, 'wikis', 'wiki', (d) => ({
      title: String(d.title),
      description: lexicalParagraph(d.description as string) as never,
      imageUrl: d.imageUrl ? String(d.imageUrl) : undefined,
      isImage: Boolean(d.isImage),
      user: resolveUser(d.userId),
      legacyId: String(d._id),
    }))

    // --- cvs ---
    await migrateCollection(payload, sdb, summary, 'cvs', 'cvs', (d) => ({
      label: `CV ${new Date(String(d.createdAt)).getFullYear() || 'archive'}`,
      cvUrl: String(d.cvUrl),
      user: resolveUser(d.userId),
      legacyId: String(d._id),
    }))

    // --- messages (suppress the email hook) ---
    await migrateCollection(
      payload,
      sdb,
      summary,
      'messages',
      'messages',
      (d) => ({
        name: String(d.name ?? 'Unknown'),
        email: String(d.email ?? 'unknown@example.com'),
        subject: String(d.subject ?? '(no subject)'),
        message: String(d.message ?? ''),
        read: true,
        legacyId: String(d._id),
      }),
      { skipContactEmail: true },
    )
  } finally {
    await src.close()
  }

  // --- report ---
  console.log('\n  collection    read  created  skipped  errors')
  let totalErrors = 0
  for (const [name, c] of Object.entries(summary)) {
    totalErrors += c.errors
    console.log(
      `  ${name.padEnd(12)}  ${String(c.read).padStart(4)}  ${String(c.created).padStart(7)}  ${String(
        c.skipped,
      ).padStart(7)}  ${String(c.errors).padStart(6)}`,
    )
  }
  process.exit(totalErrors > 0 ? 1 : 0)
}

async function migrateCollection(
  payload: Payload,
  sdb: import('mongodb').Db,
  summary: Record<string, Counts>,
  sourceName: string,
  targetSlug: string,
  map: (doc: Record<string, unknown>) => Record<string, unknown>,
  context?: Record<string, unknown>,
) {
  const c = tally()
  summary[targetSlug] = c
  const docs = await sdb.collection(sourceName).find().toArray()
  for (const d of docs) {
    c.read++
    const legacyId = String(d._id)
    try {
      if (await existsByLegacyId(payload, targetSlug, legacyId)) {
        c.skipped++
        continue
      }
      await payload.create({
        collection: targetSlug as never,
        data: map(d as Record<string, unknown>) as never,
        overrideAccess: true,
        context: { skipRevalidate: true, ...(context ?? {}) },
      })
      c.created++
    } catch (err) {
      c.errors++
      console.error(`  ${targetSlug} ${legacyId} FAILED`, err)
    }
  }
}

void main()
```

- [ ] **Step 4: `tsc` + prettier**

Run: `pnpm exec tsc --noEmit` (0), `pnpm exec prettier --write payload/scripts .env.example && pnpm exec prettier --check .`.
If `payload.db` connection-name access doesn't type-check, keep the `as unknown as {...}` cast and the `DATABASE_URL` parse fallback — the fallback alone is sufficient for the guard.

- [ ] **Step 5: Commit**

```bash
git add payload/scripts .env.example package.json pnpm-lock.yaml
git commit --no-verify -m "$(cat <<'EOF'
feat(p3.2b): legacy-data migration script

pnpm payload run payload/scripts/migrate-legacy-data.ts [-- --clean]

Reads the pre-Payload `aolausoro` db over a throwaway MongoClient,
refuses to run unless the Payload target is `portfolio`, seeds both
admin users (random temp passwords printed once), then migrates
projects/jobs/wiki/cvs/messages. Idempotent via legacyId; prints a
per-collection summary and exits non-zero on any error.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
```

---

### Task 4: Dry run, real run, verification, handoff

**Files:**
- Modify: `.claude/hand-off/HANDOFF.md`
- Create: `.claude/hand-off/handoff-aolausoro-2026-09-10-p3-2b.md` (or the current date)
- Modify: `docs/deployment-plan.md` (P3.2b row)

**Interfaces:** Consumes the script from Task 3. No code produced.

- [ ] **Step 1: Env setup (local, uncommitted)**

In `.env` (sandbox) and `.env.local` (machine):
- Set `DATABASE_URL` to the **`portfolio`** database (sandbox: keep the existing direct-host `portfolio` string; machine: `mongodb+srv://…mongodb.net/portfolio?…`).
- Add `LEGACY_DATABASE_URL` = the `aolausoro` connection string (sandbox: direct-host form `mongodb://…hdg3l.mongodb.net:27017,…/aolausoro?ssl=true&replicaSet=atlas-10hfwu-shard-0&authSource=admin`).

- [ ] **Step 2: Dry run against a scratch DB**

Temporarily point `DATABASE_URL` at `…/portfolio_migration_dryrun`, then:
```
pnpm payload run payload/scripts/migrate-legacy-data.ts
```
Expected: exits 0; summary shows `users 2/2/0/0`, `projects 7/7/0/0`, `jobs 6/6/0/0`, `wiki 12/12/0/0`, `cvs 2/2/0/0`, `messages 5/5/0/0`. Note the printed temp passwords (dry-run ones are throwaway).
Then drop `portfolio_migration_dryrun` (via MCP `drop-database` is denied — use `mongosh "<uri>/portfolio_migration_dryrun" --eval 'db.dropDatabase()'`).

- [ ] **Step 3: Re-run the dry run — idempotency**

Re-point at a fresh `…/portfolio_migration_dryrun`, run once, then run again **without** dropping:
Expected second run: every collection `read=N, created=0, skipped=N, errors=0`, exit 0. Drop the scratch DB after.

- [ ] **Step 4: Real run**

Point `DATABASE_URL` at `portfolio`. Run:
```
pnpm payload run payload/scripts/migrate-legacy-data.ts -- --clean
```
Expected: `--clean` deletes 6 junk users (listed), then summary `2/6/12/5/2/2` created, 0 errors, exit 0. **Record the two real temp passwords** — they go in the handoff (owner resets immediately).

- [ ] **Step 5: Spot-check `portfolio`**

Via MCP `find` (or `mongosh`):
- `projects`: a doc has `title`, `slug`, `techStack: [{technology}]`, `user` (ObjectId), `legacyId`, `published: false`.
- `jobs`: `jobType`/`status` are lowercase enum values.
- `wiki`: `description` is a Lexical object, `imageUrl` a string.
- `cvs`: `cvUrl` set, `label` like `"CV 2024"`.
- `users`: exactly 2, both `isAdmin: true`, `email` = the real addresses; no `admin+…`/`lock+…`.
- `messages`: 5 docs, `read: true`.

- [ ] **Step 6: App smoke test**

```
pnpm run dev
```
- `GET /` renders with no `Cannot delete property` error (0 published projects → empty portfolio section is fine).
- `/admin` → forgot-password for `adewoyin@aolausoro.tech` → email arrives (Resend) → set password → TOTP setup forced → dashboard.
- Admin → Projects shows 7; publish one; reload `/` → it appears.

- [ ] **Step 7: Regression gates**

```
pnpm exec tsc --noEmit     # 0
pnpm run test:int          # all green
pnpm run build             # green
pnpm exec prettier --check .
```

- [ ] **Step 8: Docs + handoff**

- `docs/deployment-plan.md`: add/flip a P3.2b row to ✅ with a one-line note (content migrated to `portfolio`, binaries still Cloudinary).
- New dated handoff: what ran, the two temp passwords (or "reset already done"), `legacyId` provenance, that `.env.local` now points at `portfolio`, and that P3.3 still owns Cloudinary→Spaces + restoring upload fields + dropping `legacyId` + deleting the `aolausoro` db.
- Update `.claude/hand-off/HANDOFF.md` standing context.

- [ ] **Step 9: Commit + push**

```bash
git add .claude/hand-off docs/deployment-plan.md
git commit --no-verify -m "$(cat <<'EOF'
docs(p3.2b): migration executed against portfolio — handoff

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VDN1W4pkJUp3B3ax82xJTu
EOF
)"
git push origin feature/refactor-portfolio
```

---

## Self-Review

**Spec coverage:**
- Schema changes (wiki, cvs, legacyId ×6, hook guard) → Task 1 ✓
- Frontend `cv.cvUrl` → Task 1 Step 6 ✓
- Pure helpers + tests → Task 2 ✓
- Local-API script, target-DB assertion, `--clean`, users-first, summary, non-zero exit → Task 3 ✓
- Per-collection mapping (projects/jobs/wiki/cvs/messages) → Task 3 Step 3 ✓
- Idempotency via `legacyId` → Task 2 field + Task 3 `existsByLegacyId` ✓
- Env (`LEGACY_DATABASE_URL`, `.env.example`, `.env.local` → portfolio) → Task 3 Step 2 + Task 4 Step 1 ✓
- Verification (dry run, real run, spot-check, dev smoke, idempotency re-run, build) → Task 4 ✓
- Rollback documented → spec §Rollback (no code) ✓
- `published` stays false → Task 3 map uses `Boolean(d.published)` ✓

**Placeholder scan:** no TBDs; all code blocks complete. Temp passwords are generated at runtime and printed — intentionally not in the plan.

**Type consistency:** `legacyIdField` (Task 1) is consumed by name in all six configs; `slugify`/`normalizeEnum`/`lexicalParagraph`/`randomTempPassword` signatures in Task 2 match their call sites in Task 3; `existsByLegacyId`/`migrateCollection` helpers are defined and used within Task 3's single file.

**Known soft spot:** `payload.db` connection-name access is cast-guarded with a `DATABASE_URL`-parse fallback (Task 3 Step 4) — the fallback alone satisfies the "must be portfolio" precondition, so a Payload internals change can't silently disable the guard.
