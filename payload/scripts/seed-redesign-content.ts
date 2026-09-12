import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-off: persists the site-settings global to the DB.
 *
 * `payload.findGlobal` already merges each field's `defaultValue` into an
 * unsaved global at read time, so the front end renders correctly even
 * before this script ever runs — this script exists only to force an
 * actual write, so the document shows as saved in /admin and an editor
 * isn't surprised to find nothing persisted yet. A global has exactly one
 * document, so this is safe to run any number of times: an explicit
 * `updateGlobal` with a field already holding a value leaves it untouched.
 *
 *   pnpm payload run payload/scripts/seed-redesign-content.ts
 */
async function main() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {}, // defaultValue on each field fills the document on first write
  })
  console.log('site-settings persisted.')
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
