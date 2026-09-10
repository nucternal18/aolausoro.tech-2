import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'
import { guessMimeType } from './lib/mime'

/**
 * P3.3a — migrate the Cloudinary-hosted assets referenced by the legacy text
 * fields into Payload uploads (backed by DO Spaces via s3Storage):
 *
 *   pnpm payload run payload/scripts/migrate-assets-to-spaces.ts
 *
 * Reads `wiki.imageUrl`, `projects.url`, `cvs.cvUrl` (all still present during
 * the P3.3a transition), fetches each Cloudinary object, and writes it into
 * `wiki.image` / `projects.screenshot` / the CV file. Idempotent. Refuses to
 * run unless the Payload target DB is `portfolio` (override: EXPECTED_DB).
 */

const CLOUDINARY_HOST = 'res.cloudinary.com'

type Counts = { read: number; migrated: number; skipped: number; errors: number }
const tally = (): Counts => ({ read: 0, migrated: 0, skipped: 0, errors: 0 })

/** Reduce a URL-path segment to a safe, slash-free basename for an upload. */
function safeBasename(raw: string, fallback: string): string {
  const decoded = (() => {
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  })()
  const base = decoded.replace(/\\/g, '/').split('/').pop() ?? ''
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '')
  return cleaned || fallback
}

async function fetchAsset(url: string): Promise<{ data: Buffer; name: string; mimetype: string }> {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:' || parsed.host !== CLOUDINARY_HOST) {
    throw new Error(`refusing to fetch non-Cloudinary URL: ${url}`)
  }
  const res = await fetch(url, { redirect: 'error' })
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  const data = Buffer.from(await res.arrayBuffer())
  const name = safeBasename(parsed.pathname.split('/').pop() || '', 'asset')
  const mimetype = res.headers.get('content-type')?.split(';')[0]?.trim() || guessMimeType(name)
  return { data, name, mimetype }
}

async function ingestMedia(payload: Payload, url: string, alt: string): Promise<string> {
  const { data, name, mimetype } = await fetchAsset(url)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, name, mimetype, size: data.byteLength },
    overrideAccess: true,
  })
  return String(doc.id)
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
    throw new Error(
      `Refusing to run: target database is "${String(dbName)}", expected "${expected}"`,
    )
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
      const legacyUrl = (doc as { imageUrl?: unknown }).imageUrl
      if (doc.image || typeof legacyUrl !== 'string' || !legacyUrl) {
        c.skipped++
        continue
      }
      try {
        const mediaId = await ingestMedia(payload, legacyUrl, String(doc.title))
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
        const mediaId = await ingestMedia(payload, legacyUrl, String(doc.title))
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

  // --- cvs: cvUrl (string) -> attach the PDF file to the doc ---
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
        const { data, name } = await fetchAsset(legacyUrl)
        await payload.update({
          collection: 'cvs',
          id: doc.id,
          data: {},
          file: {
            data,
            name: name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`,
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
      `  ${name.padEnd(12)}  ${String(c.read).padStart(4)}  ${String(c.migrated).padStart(
        8,
      )}  ${String(c.skipped).padStart(7)}  ${String(c.errors).padStart(6)}`,
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
