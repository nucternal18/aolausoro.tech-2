# Handoff — 2026-09-10 (evening) — P3.2b legacy data migration complete

Branch: `feature/refactor-portfolio` (origin). Not merged to `main`.
Previous handoff: `handoff-aolausoro-2026-09-10.md` (P3.2).

Spec: `docs/superpowers/specs/2026-09-10-p3-2b-data-migration-design.md`
Plan: `docs/superpowers/plans/2026-09-10-p3-2b-data-migration.md` (4 tasks, all done)
Commits: `44c3866..HEAD`.

## What happened

`pnpm run dev` was crashing with `TypeError: Cannot delete property '0' of
[object String]` on any request that queried `projects`. Cause: the machine's
`.env.local` pointed Payload at the **pre-Payload `aolausoro` database**, whose
docs are still in Mongoose shape (`techStack: ["React"]` etc.). P3.2b reshapes
that content into the `portfolio` database and repoints dev.

### Migration executed (real run against `portfolio`, `--clean`)

| Payload collection | migrated | notes                                                                                                  |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------ |
| users              | 2        | `adewoyin@aolausoro.tech`, `aolausoro@gmail.com` — both `isAdmin: true`, random temp passwords (below) |
| projects           | 7        | 2 already `published: true` (`SteppingStonesapp`, one more), 5 unpublished                             |
| jobs               | 6        | `jobType`/`status` normalized to lowercase enum values                                                 |
| wiki               | 12       | `description` plain string → Lexical richText                                                          |
| cvs                | 2        | both labelled `CV 2024`                                                                                |
| messages           | 5        | imported as `read: true`; email hook suppressed                                                        |

`--clean` deleted the 6 leaked `admin+…`/`lock+…` junk users.

Every migrated doc carries a hidden `legacyId` (the original Mongoose `_id`).
The script is idempotent — re-running skips everything already present.

### Temp passwords (reset immediately via `/admin` → forgot password)

```
adewoyin@aolausoro.tech   NzqHlOSnylgAass4Sl3sv_jD
aolausoro@gmail.com       q42i5FVIGvwv-VCjJx8ovab2
```

`payload-totp` `forceSetup` forces 2FA setup on first login. If these have
already been reset, ignore them.

## Code changes (Tasks 1–3)

- `Wiki.imageUrl`: upload-relationship → **text URL** field.
- `CVs`: no longer an upload collection → `cvUrl` **text** field; homepage +
  `getLatestCV` read `cv.cvUrl`.
- Hidden indexed `legacyId` field on projects/jobs/wiki/messages/cvs/users
  (`fields/legacyId.ts`).
- `sendContactEmail` early-returns on `context.skipContactEmail`.
- `payload/scripts/lib/transforms.ts` — `slugify` / `normalizeEnum` /
  `lexicalParagraph` / `randomTempPassword`, unit-tested
  (`tests/int/migration.int.spec.ts`, +4 tests → 19 total).
- `payload/scripts/migrate-legacy-data.ts` — the migration.
  `mongodb` re-added as a dev dep for the source read.

## Running the script again

```bash
pnpm payload run payload/scripts/migrate-legacy-data.ts -- --clean
```

- The `--` before `--clean` is **required** — pnpm swallows the flag otherwise.
- Needs `LEGACY_DATABASE_URL` (the `aolausoro` connection string) in env.
- Refuses to run unless the Payload target DB is `portfolio` (override with
  `EXPECTED_DB=<name>` for a dry run against a scratch DB). This guard already
  caught one misconfigured run where `.env.local` still pointed at `aolausoro`.

## Environment

- `.env` and `.env.local` `DATABASE_URL` now both point at **`portfolio`**.
  `.env.local` keeps the working `mongodb+srv://` form; `.env` keeps the
  sandbox direct-host form.
- `LEGACY_DATABASE_URL` added to both (source read only). `.env.example`
  documents it.

## Verified

- `pnpm exec tsc --noEmit` → 0
- `pnpm run test:int` → 19/19
- `pnpm run build` → green, `.next/standalone`
- `pnpm exec prettier --check .` → clean (`next-env.d.ts` + admin `importMap.js`
  added to `.prettierignore` — both are generated and flip-flop between
  `dev`/`build`)
- `pnpm run dev` → `GET /` renders, no crash, the published project shows

## Loose ends

- **3 stray test `messages`** remain in `portfolio` (from pre-isolation
  `contact.int.spec` runs — `read: false`, no `legacyId`). Harmless; delete
  when convenient.
- Both CVs are `CV 2024` — cosmetic; rename one in admin if it matters.
- `portfolio_migration_dryrun` scratch DB was emptied (the Atlas user lacks
  `dropDatabase`) — drop it from the Atlas UI.

## Still P3.3

Cloudinary → DO Spaces for all the image/PDF URLs now stored as text; restore
proper `upload` fields for wiki images and a real CVs upload collection; drop
the `legacyId` fields; delete the `aolausoro` database; Sentry keep/drop;
provision deploy infra + enable `deploy-production.yml`.
