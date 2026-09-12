import 'dotenv/config'
import type { Db } from 'mongodb'
import { MongoClient } from 'mongodb'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'
import { lexicalParagraph, normalizeEnum, randomTempPassword, slugify } from './lib/transforms'

/**
 * P3.2b — one-off migration of the pre-Payload `aolausoro` database into the
 * Payload `portfolio` database.
 *
 *   pnpm payload run payload/scripts/migrate-legacy-data.ts
 *   pnpm payload run payload/scripts/migrate-legacy-data.ts -- --clean
 *
 * Reads the source over a throwaway MongoClient (never writes to it), refuses
 * to run unless the Payload target database is `portfolio`, seeds both admin
 * users (random temp passwords printed once), then migrates
 * projects / jobs / wiki / cvs / messages. Idempotent via `legacyId`.
 */

const JUNK_USER_RE = /^(admin|lock)\+\d+@aolausoro\.tech$/

type Counts = { read: number; created: number; skipped: number; errors: number }
const tally = (): Counts => ({ read: 0, created: 0, skipped: 0, errors: 0 })

async function existsByLegacyId(
  payload: Payload,
  collection: string,
  legacyId: string,
): Promise<boolean> {
  const res = await payload.find({
    collection: collection as never,
    where: { legacyId: { equals: legacyId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return res.docs.length > 0
}

async function migrateCollection(
  payload: Payload,
  sdb: Db,
  summary: Record<string, Counts>,
  sourceName: string,
  targetSlug: string,
  map: (doc: Record<string, unknown>) => Record<string, unknown>,
  context?: Record<string, unknown>,
): Promise<void> {
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

async function main(): Promise<void> {
  console.log('P3.2b migration starting…')
  const clean = process.argv.includes('--clean')

  const legacyUri = process.env.LEGACY_DATABASE_URL
  if (!legacyUri) throw new Error('LEGACY_DATABASE_URL is not set')

  console.log('initializing Payload…')
  const payload = await getPayload({ config: await config })
  console.log('Payload ready')

  // --- precondition: target database must be `portfolio` ---
  const dbFromInternals = (payload.db as unknown as { connection?: { name?: string } }).connection
    ?.name
  const dbFromEnv = (() => {
    try {
      return new URL(process.env.DATABASE_URL ?? '').pathname.replace(/^\//, '').split('?')[0]
    } catch {
      return undefined
    }
  })()
  const targetDbName = dbFromInternals ?? dbFromEnv
  // Guard: only ever write to `portfolio`. A dry run against a scratch DB must
  // opt in explicitly by setting EXPECTED_DB to that DB's name.
  const expectedDb = process.env.EXPECTED_DB || 'portfolio'
  if (targetDbName !== expectedDb) {
    throw new Error(
      `Refusing to run: target database is "${String(targetDbName)}", expected "${expectedDb}"`,
    )
  }

  const src = new MongoClient(legacyUri)
  await src.connect()
  const sdb = src.db() // db name comes from the URI (aolausoro)
  console.log(`source: ${sdb.databaseName}  ->  target: ${targetDbName}\n`)

  const summary: Record<string, Counts> = {}

  try {
    // --- optional cleanup: remove the leaked test users ---
    if (clean) {
      const junk = await payload.find({
        collection: 'users',
        where: { email: { contains: '+' } },
        limit: 100,
        overrideAccess: true,
      })
      const targets = junk.docs.filter((u) => JUNK_USER_RE.test(String(u.email)))
      console.log(`--clean: deleting ${targets.length} junk user(s)`)
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
        userMap.set(legacyId, existing.docs[0]!.id)
        uc.skipped++
        continue
      }
      try {
        const pw = randomTempPassword()
        const created = await payload.create({
          collection: 'users',
          // legacyId was dropped from the Users schema in P3.3c — this script
          // is frozen historical record of the one-off P3.2b migration and is
          // never run again, so the field is cast past rather than removed.
          data: {
            name: String(su.name ?? su.email),
            email: String(su.email),
            isAdmin: true,
            legacyId,
            password: pw,
          } as never,
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
      slug: slugify(String(d.projectName)) || `project-${String(d._id)}`,
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
      status: normalizeEnum(d.status, ['pending', 'interview', 'declined'] as const, 'pending'),
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
    await migrateCollection(payload, sdb, summary, 'cvs', 'cvs', (d) => {
      const year = new Date(String(d.createdAt)).getFullYear()
      return {
        label: `CV ${Number.isNaN(year) ? 'archive' : year}`,
        cvUrl: String(d.cvUrl),
        user: resolveUser(d.userId),
        legacyId: String(d._id),
      }
    })

    // --- messages (suppress the afterChange email hook) ---
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
  console.log()
  process.exit(totalErrors > 0 ? 1 : 0)
}

// `payload run` awaits this module's top-level promise but not a detached
// one, so await here rather than `void main()`.
try {
  await main()
} catch (err) {
  console.error('migration failed:', err)
  process.exit(1)
}
