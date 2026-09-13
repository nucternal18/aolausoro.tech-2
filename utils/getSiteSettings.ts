import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * app/(home)/layout.tsx (nav) and app/(home)/page.tsx (hero/footer/etc.)
 * both need the site-settings global independently. Without this, they each
 * called `payload.findGlobal` directly, and Next's App Router renders a
 * layout and its page's data-fetching concurrently — two near-simultaneous
 * `findGlobal` calls on the same global raced on the underlying MongoDB
 * session (Sentry JAVASCRIPT-NEXTJS-36 / -3A: MongoExpiredSessionError).
 *
 * React's `cache()` dedupes identical calls within one request/render pass
 * — both call sites now share a single actual fetch instead of racing two.
 * This is per-request only (not next/cache's unstable_cache, which persists
 * across requests) since site-settings has no revalidation hook wired up
 * yet and shouldn't go stale across requests.
 */
export const getSiteSettings = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: false,
  })
})
