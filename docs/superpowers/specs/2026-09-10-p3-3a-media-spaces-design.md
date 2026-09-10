# P3.3a — Media on DigitalOcean Spaces + Cloudinary teardown

**Status:** design — approved to write up 2026-09-10
**Phase:** 3, sub-project P3.3a (first of three P3.3 sub-projects)
**Depends on:** P3.2b (complete — `44c3866..df3816e` on `feature/refactor-portfolio`)
**Blocks:** a production-viable container image (local `public/media` does not
survive redeploys)
**Sibling sub-projects:** P3.3b (Sentry — decision made: *keep*, verify wiring),
P3.3c (deploy infra provisioning + `deploy-production.yml` enablement; also
drops `legacyId` fields and deletes the `aolausoro` db)

## Problem

Payload's `media` uploads and the `cvs` collection write to the local
`public/media` / `public/cvs` directories (`staticDir`). In a container that
disk is ephemeral — every redeploy loses uploads. P3.2b left the three
asset-bearing fields (`wiki.imageUrl`, `cvs.cvUrl`, `projects.url`) as plain
text pointing at `res.cloudinary.com`. P3.3a moves object storage to the
already-provisioned DO Spaces bucket (`aolausorotech`, region `lon1`, CDN
enabled), migrates the 21 Cloudinary assets into it as proper Payload uploads,
and removes Cloudinary from the codebase.

## Decisions (from brainstorming)

1. **Proper Payload uploads**, not text URLs: `wiki.imageUrl` → `upload`
   (`relationTo: media`); `CVs` → `upload` collection again; `Projects` gets a
   new `screenshot` `upload` field and loses `url`.
2. **`aolausoro` db + `legacyId` fields stay** until the production deploy is
   verified — deleted in P3.3c.
3. **Sentry stays** (P3.3b verifies it; P3.3a does not touch it).
4. Assets served via the **Spaces CDN endpoint**
   (`https://aolausorotech.lon1.cdn.digitaloceanspaces.com`), already enabled.

## Pre-work (owner, before the migration step)

`.env.local` and `.env` both need:
```
DO_SPACES_KEY=<real key — the current .env.local value has a stray "your-" prefix>
DO_SPACES_SECRET=<real secret>
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://aolausorotech.lon1.cdn.digitaloceanspaces.com
DO_SPACES_BUCKET=aolausorotech
```

## Storage layer

`plugins/index.ts` — add `s3Storage` as the first plugin (template:
`../equilibrium/src/plugins/index.ts` lines 29–58):

```ts
import { s3Storage } from '@payloadcms/storage-s3'

const spacesConfig = {
  bucket: process.env.DO_SPACES_BUCKET || '',
  config: {
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY || '',
      secretAccessKey: process.env.DO_SPACES_SECRET || '',
    },
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION || 'lon1',
    forcePathStyle: false, // DO Spaces uses virtual-hosted-style addressing
  },
}

const cdnURL = (prefix: string) => ({ filename }: { filename: string }) =>
  `${process.env.DO_SPACES_CDN_ENDPOINT}/${prefix}/${filename}`

// in plugins[]:
s3Storage({
  acl: 'public-read',
  collections: {
    media: { prefix: 'media', generateFileURL: cdnURL('media') },
    cvs: { prefix: 'cvs', generateFileURL: cdnURL('cvs') },
  },
  ...spacesConfig,
}),
```

- `Media.ts` keeps `staticDir: '../../public/media'` (Payload's local
  temp/passthrough dir — unchanged, matches equilibrium).
- `CVs` gets `upload: { mimeTypes: ['application/pdf'], staticDir: 'public/cvs' }`.
- The s3 plugin intercepts writes; the `staticDir`s stay as the local shim.

## Schema changes

Regenerate types (`pnpm generate:types`) and commit `payload-types.ts` after.

Final field shapes (reached over two commits — see "Transition" below):

| Collection | Final state |
|---|---|
| `Wiki` | `image`: `{ type: 'upload', relationTo: 'media' }` — replaces the P3.2b `imageUrl` text field |
| `CVs` | `upload: { mimeTypes: ['application/pdf'], staticDir: 'public/cvs' }`; no `cvUrl` field; keeps `label`, `user`, `legacyId` |
| `Projects` | no `url` field; new `screenshot`: `{ type: 'upload', relationTo: 'media', required: true }` (after `slugField()`) |

### Transition (why two commits)

A field can't be simultaneously `text` and `upload`, and the migration needs to
read the old Cloudinary URLs. So:

- **Commit A** — add the new upload fields *alongside* the surviving text
  fields: `Projects.screenshot` (upload, **not** required yet), `Wiki.image`
  (upload), and make `CVs` an `upload` collection while keeping `cvUrl`
  (an upload collection tolerates a doc with no file during the window).
  `Wiki.imageUrl` and `Projects.url` stay as text.
- **run the migration** (populates `screenshot`, `image`, and the CV files)
- **Commit B** — remove `Projects.url`, `Wiki.imageUrl`, `CVs.cvUrl`; make
  `Projects.screenshot` `required: true`; regen types; fix the frontend.

Note: `next.config.mjs` `images.remotePatterns` already resolves the CDN host
from `DO_SPACES_CDN_ENDPOINT` — no change needed there for adding Spaces.

### Frontend

- `components/portfolio-card.tsx`: `src={project.url as string}` →
  resolve the `screenshot` media doc's `.url` (depth ≥ 1 in the home query
  already populates it — verify; the home `payload.find` for projects uses
  `depth: 1`).
- `components/home.tsx`: `cv?.cvUrl` → `cv?.url` (upload collection URL).
- `lib/utils.ts` `getLatestCV`: return `latestCV.url`.
- `git grep -n "cvUrl\|project\.url"` — expect no non-doc hits after.

## Asset migration script

`payload/scripts/migrate-assets-to-spaces.ts`, run with
`pnpm payload run payload/scripts/migrate-assets-to-spaces.ts`.

Runs after **Commit A**, before **Commit B** (see "Transition" above) — it
reads the source Cloudinary URLs from `Wiki.imageUrl`, `Projects.url`,
`CVs.cvUrl` and writes the ingested media into `Wiki.image`,
`Projects.screenshot`, and the CV file.

### Script structure

```
import 'dotenv/config'
- MongoClient not needed — read from the live portfolio docs via payload.find
- getPayload({ config: await config })
- assert target DB name === 'portfolio' (EXPECTED_DB override, same as P3.2b)
- const CLOUDINARY_HOST = 'res.cloudinary.com'

async function ingest(url, altText): Promise<mediaId> {
  assert new URL(url).host === CLOUDINARY_HOST
  const res = await fetch(url); assert res.ok
  const data = Buffer.from(await res.arrayBuffer())
  const name = decodeURIComponent(new URL(url).pathname.split('/').pop()!)
  const mimetype = res.headers.get('content-type') ?? guessFromExt(name)
  const doc = await payload.create({
    collection: 'media',
    data: { alt: altText },
    file: { data, name, mimetype, size: data.byteLength },
    overrideAccess: true,
  })
  return doc.id
}

// wiki: for each doc where typeof imageUrl === 'string'
//   image = await ingest(imageUrl, doc.title); payload.update wiki { image, imageUrl: null }
// projects: for each doc where !doc.screenshot && typeof doc.url === 'string'
//   screenshot = await ingest(doc.url, doc.title); payload.update project { screenshot }
// cvs: for each doc where !doc.filename && typeof doc.cvUrl === 'string'
//   fetch pdf; payload.update cvs { file } ... (see note)  OR delete+recreate
// summary table; non-zero exit on error
```

**CVs note:** an existing `cvs` doc created as text can't gain a file via
`payload.update` cleanly in all Payload versions. If `update` with `file`
fails, fall back to: read `{label, user, legacyId}`, `payload.delete` the doc,
`payload.create` a fresh upload doc with the PDF + those fields. Decide during
implementation against the installed version; prefer `update` if it works.

**Idempotency:** re-running skips wiki docs with `image` set, projects with
`screenshot` set, cvs with a `filename`.

## Cloudinary teardown (commit after migration verified)

- `pnpm remove cloudinary`
- Delete `lib/cloudinary.ts`
- Delete `lib/env.ts` (dead: only `types/index.d.ts` imports the `Env` type,
  and its top-level `envSchema.parse(process.env)` would throw on any machine
  missing `REPO_TOKEN` / `__NEXT_PRIVATE_PREBUNDLED_REACT`). In
  `types/index.d.ts`, drop `import type { Env } from '@lib/env'` and replace the
  `interface ProcessEnv extends Env {}` with an empty `interface ProcessEnv {}`
  (or delete the `declare global` block entirely if nothing depends on it —
  `git grep "process.env" | wc -l` to sanity check it's all string access).
- `.env.example`: remove the `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_*` block;
  under the DO Spaces section add `DO_SPACES_REGION` and `DO_SPACES_CDN_ENDPOINT`
  if not already listed.
- `next.config.mjs` `images.remotePatterns`: remove `res.cloudinary.com` and
  `img.clerk.com`. Keep `cdn.jsdelivr.net` and `source.unsplash.com` (both used
  by `config/data.ts`).
- `git grep -in cloudinary -- ':!*.md' ':!docs/'` → only expected: none.

**Deferred to P3.3c** (noted, not done here): strip `CLOUDINARY_*`,
`NEXT_PUBLIC_CLOUDINARY_*`, and the Clerk vars from `.github/workflows/deploy-production.yml`
and the `Dockerfile` `ARG`/`ENV` lines.

## Verification

1. `pnpm generate:types` clean; `Cv` has upload fields (`url`, `filename`, …),
   no `cvUrl`; `Wiki.image` is `string | Media | null`, no `imageUrl`;
   `Project.screenshot` present, no `url`.
2. `pnpm exec tsc --noEmit` → 0.
3. Migration dry check against `portfolio_migration_dryrun` is impractical
   (needs the schema + real Cloudinary fetches) — instead: run against
   `portfolio`, expect summary `wiki 12 / projects 7 / cvs 2` moved, 0 errors.
4. Spaces: list the bucket (`aws s3 ls` or DO console) — objects exist under
   `media/` and `cvs/`. Media docs' `url` is the CDN URL.
5. `pnpm run dev`:
   - `/admin` → Media → upload a test image → it appears in the Spaces bucket,
     admin thumbnail loads from the CDN.
   - `/admin` → Wiki → a migrated doc shows its image.
   - Home page → project cards render screenshots from
     `aolausorotech.lon1.cdn.digitaloceanspaces.com`.
   - CV download button resolves to a Spaces PDF URL.
6. `pnpm run test:int` → green (no test currently asserts `cvUrl`/`project.url`;
   add `tests/int/media.int.spec.ts` asserting the `media`/`cvs`/`wiki`/`projects`
   collections have the expected field types, so a future schema regression is
   caught without network).
7. `pnpm run build` → green.
8. `git grep -in "cloudinary" -- ':!docs/' ':!*.md'` → nothing.

## Rollback

- Steps are additive until the field removals; the Cloudinary URLs remain
  valid on `res.cloudinary.com` throughout.
- If Spaces serving misbehaves: revert the `s3Storage` plugin commit → uploads
  go back to local `public/media` (today's behaviour). Migrated media docs
  keep working only if their files were also written locally — so revert
  *before* relying on the migration.
- `aolausoro` db + `legacyId` fields are the ultimate fallback and are retained
  until P3.3c.

## Out of scope

- Sentry (P3.3b).
- Deploy infra, `deploy-production.yml` / `Dockerfile` env cleanup, dropping
  `legacyId`, deleting `aolausoro` (P3.3c).
- Re-uploading Cloudinary *derived* transforms — the migration takes the
  delivered image at each stored URL as the original; Payload regenerates its
  own `imageSizes`.
