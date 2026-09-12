# P3.2b — Legacy data migration (`aolausoro` → `portfolio`)

**Status:** design — approved to write up 2026-09-10
**Phase:** 3, sub-project P3.2b (follows P3.2 "Payload-only site")
**Depends on:** P3.2 (complete — `7dc0289..783cde1` on `feature/refactor-portfolio`)
**Blocks:** normal `pnpm run dev` against real content; P3.3 (media move)

## Problem

`pnpm run dev` throws `TypeError: Cannot delete property '0' of [object String]`
when any request queries `projects`. Root cause: the machine's `.env.local`
points Payload at the **`aolausoro`** MongoDB database, whose documents are in
the pre-migration Mongoose/Prisma shape. Payload reads
`projects.techStack = ["React","Axios"]` (array of strings), treats each string
as an array-field row object, and `delete`s a property off a primitive string.

The intended Payload database, **`portfolio`**, is empty of content and holds
only 6 junk test users (leaked before test-DB isolation landed in P3.1a). No
usable admin login exists in either database — the 2 real users are Clerk-only
(`clerkId` but no `hash`/`salt`).

This migration reshapes the legacy content into `portfolio` in Payload's
current schema, seeds real admin users, and cleans the junk.

## Source inventory (`aolausoro` db, Mongoose shape)

| Source collection | Docs | Notes |
|---|---|---|
| `projects` | 7 | `projectName`, `techStack: string[]`, `userId: ObjectId`, `description: ""`, `published: false` (all). `url` = Cloudinary screenshot, `address` = live-site URL, `github` = repo. |
| `jobs` | 6 | `position`, `company`, `jobLocation`, `jobType` (`"full-time"`, `"remote"`, …), `status` (`"Declined"`, `"Pending"`, …), `userId: ObjectId`. |
| `wikis` | 12 | `title` (non-unique), `description: string` (plain text), `imageUrl` = Cloudinary URL, `isImage: bool`, `userId: ObjectId`. |
| `messages` | 5 | `name`, `email`, `subject`, `message`. Years-old test messages. |
| `cvs` | 2 | `cvUrl` = Cloudinary PDF URL, `userId: ObjectId`. |
| `users` | 2 | `name`, `email`, `clerkId`. No password. `61c0b7d7…bb74` = `adewoyin@aolausoro.tech` (owns every content record); `66f5b321…ba87` = `aolausoro@gmail.com`. |
| `posts`, `categories`, `media`, `issues` | 0 | Empty — nothing to migrate. |

All binaries live on Cloudinary (`res.cloudinary.com/dus5nxe5w`, already
allow-listed in `next.config.mjs` `images.remotePatterns`).

## Decisions (from brainstorming)

1. **Binaries stay as Cloudinary text URLs.** P3.2b moves data only. P3.3
   later pulls every Cloudinary asset into DO Spaces and reintroduces proper
   upload fields.
2. **Both users migrated**, `isAdmin: true`, each with a random temp password
   printed once to the console. Owner then uses `/admin` forgot-password
   (resendAdapter is configured). `payload-totp` `forceSetup` forces 2FA on
   first login regardless.
3. **Local API**, not raw Mongo writes — slug generation, validation and
   relationship resolution run through Payload.
4. **Idempotent** via a hidden indexed `legacyId` field on every migrated
   collection: find-by-`legacyId` → skip if present, else create.
5. **`published` stays `false`** on the 7 projects — owner publishes each via
   admin. (Not flipped by the script.)
6. **Target-DB cleanup** (drop the 6 junk users) runs only behind a `--clean`
   flag.

## Schema changes

`payload.config.ts` collections — regenerate types (`pnpm generate:types`)
after:

| Collection | Change |
|---|---|
| `Wiki` | `imageUrl`: `type: 'upload', relationTo: 'media'` → `type: 'text'` (Cloudinary URL). Keep field name `imageUrl`. |
| `CVs` | Remove `upload: { … }`. Add `cvUrl` (`type: 'text'`, `required: true`). Keep `label`, `user`. `useAsTitle` stays `label`. |
| `Projects`, `Jobs`, `Wiki`, `Messages`, `CVs`, `Users` | Add: `{ name: 'legacyId', type: 'text', index: true, admin: { readOnly: true, position: 'sidebar', description: 'Mongoose _id from the pre-Payload database. Migration provenance.' } }` — `index` not `unique` (a unique index would be non-sparse and collide on `null` for every admin-created doc). Idempotency comes from the script's find-by-`legacyId` guard, not the DB constraint. |

### Frontend touch-ups (CVs is no longer an upload)

- `app/(home)/page.tsx` / `components/home.tsx`: the CV doc's download URL is
  now `cv.cvUrl`, not `cv.url`.
- `lib/utils.ts` `getLatestCV`: return `latestCV.cvUrl`.
- Grep `git grep -n "\.url" -- components app lib | grep -i cv` for stragglers.

## Migration script

`payload/scripts/migrate-legacy-data.ts`, run with:

```bash
pnpm payload run payload/scripts/migrate-legacy-data.ts            # migrate
pnpm payload run payload/scripts/migrate-legacy-data.ts -- --clean # + drop junk users first
```

### Structure

1. **Connect to source.** Read `LEGACY_DATABASE_URL` from env (the
   `aolausoro` connection string — direct-host form for sandbox parity). Open a
   plain `mongodb` `MongoClient` (dependency already present transitively via
   `@payloadcms/db-mongodb`; if not resolvable, add `mongodb` back as a
   dev-only dep). Never write to it.
2. **Init Payload.** `const payload = await getPayload({ config })` — writes to
   whatever `DATABASE_URL` (i.e. `portfolio`) points at. Assert the target DB
   name is `portfolio`; abort otherwise.
3. **`--clean`:** `payload.find({ collection: 'users', where: { email: { contains: '+' } }, overrideAccess: true })`, filter to those matching `/^(admin|lock)\+\d+@aolausoro\.tech$/` in JS, log the id+email list, then `payload.delete` by that id list. Refuse to delete anything not matching the regex.
4. **users** (first — content relationships need them):
   for each source user, `find({ collection: 'users', where: { legacyId: { equals: String(_id) } } })`;
   if none, `payload.create({ collection: 'users', data: { name, email, isAdmin: true, legacyId, password: randomTempPassword() }, overrideAccess: true })`.
   Collect `Map<legacyUserId, newUserId>`. Print `email → temp password` once.
5. **projects:** map per §"Per-collection mapping"; `payload.create({ …, overrideAccess: true, context: { skipRevalidate: true } })`.
6. **jobs / wiki / cvs / messages:** same pattern.
7. **Summary table** to stdout: per collection — read, created, skipped, errors.
   Non-zero exit if any errors.

### Per-collection mapping

**projects**
```
title:       src.projectName
slug:        slugify(src.projectName)            // fallback: `project-${src._id}`
description: src.description?.trim() || '—'
url:         src.url        // Cloudinary screenshot — unchanged
address:     src.address    // live site URL     — unchanged
github:      src.github
techStack:   (src.techStack ?? []).map((technology) => ({ technology }))
published:   Boolean(src.published)              // all false today
user:        userMap.get(String(src.userId))     // required — error if missing
legacyId:    String(src._id)
```

**jobs**
```
position:    src.position
company:     src.company
jobLocation: src.jobLocation?.trim() || '—'
jobType:     normalizeEnum(src.jobType, ['full-time','part-time','contract','remote'])   // lowercase, hyphenate; default 'full-time'
status:      normalizeEnum(src.status, ['pending','interview','declined'])               // lowercase; default 'pending'
user:        userMap.get(String(src.userId))
legacyId:    String(src._id)
```

**wiki**
```
title:       src.title
description: lexicalParagraph(src.description)    // see below — required richText
imageUrl:    src.imageUrl || undefined           // now a text field
isImage:     Boolean(src.isImage)
user:        userMap.get(String(src.userId))
legacyId:    String(src._id)
```
`lexicalParagraph(text)` returns the minimal valid Lexical root:
```ts
{ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
  children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'text', text: text || '—', format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] }] } }
```

**cvs**
```
label:       `CV ${new Date(src.createdAt).getFullYear()}`
cvUrl:       src.cvUrl
user:        userMap.get(String(src.userId))
legacyId:    String(src._id)
```

**messages**
```
name:    src.name
email:   src.email
subject: src.subject
message: src.message
read:    true
legacyId: String(src._id)
context: { skipContactEmail: true }   // suppress the afterChange notification
```

### `sendContactEmail` hook guard

`payload/collections/Messages/hooks/sendContactEmail.ts` — add at the top of
the handler:
```ts
if (req.context?.skipContactEmail) return doc
```
So the migration's `payload.create` for old messages does not send mail.

## Environment

- `.env` (sandbox): `DATABASE_URL` already the `portfolio` direct-host string.
- `.env.local` (machine): change `DATABASE_URL` from
  `mongodb+srv://…/aolausoro` to the `portfolio` database (SRV form fine on a
  real machine: `mongodb+srv://…mongodb.net/portfolio?retryWrites=true&w=majority`).
- Add `LEGACY_DATABASE_URL` to `.env` / `.env.local` (+ `.env.example` with a
  placeholder) = the old `aolausoro` connection string, used only by the
  migration script.

## Verification

1. `pnpm generate:types` — clean; `Cv` type has `cvUrl`, no upload fields;
   `Wiki.imageUrl` is `string`.
2. `pnpm exec tsc --noEmit` — 0.
3. `pnpm run test:int` — 15/15 (add one spec: `tests/int/migration.int.spec.ts`
   asserting `lexicalParagraph` and `normalizeEnum` pure helpers, extracted so
   they're unit-testable without a DB).
4. Dry run against a scratch DB (`DATABASE_URL=…/portfolio_migration_dryrun`):
   script exits 0, summary shows 7/6/12/5/2/2 created.
5. Real run against `portfolio` with `--clean`: summary correct, 0 errors.
6. MCP/`mongosh` spot-check `portfolio`: `projects` doc has `title`,
   `techStack: [{technology}]`, `user` ObjectId, `legacyId`; junk users gone.
7. `pnpm run dev` → `/` renders (0 published projects is fine — no crash);
   `/admin` forgot-password email arrives; log in; projects list shows 7.
8. Re-run the script without `--clean`: summary shows all skipped, 0 created,
   exit 0 (idempotency).
9. `pnpm run build` — still green.

## Rollback

Migration only ever *adds* to `portfolio` (plus `--clean` deleting 6 known
junk users). To undo: `payload.delete` by `legacyId != null` per collection,
or drop the content collections in `portfolio` (still no production traffic).
The source `aolausoro` db is never modified.

## Out of scope (P3.3)

Cloudinary → DO Spaces asset move; reinstating `upload`-type fields for wiki
images and a real CVs upload collection; deleting `legacyId` fields; removing
the `aolausoro` database.
