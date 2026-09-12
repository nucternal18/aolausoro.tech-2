import { getPayload } from 'payload'
import config from '@payload-config'

export interface SeededAdmin {
  email: string
  password: string
}

/**
 * Idempotent test-only helper: ensures a known admin user exists so e2e specs
 * can log in. Refuses to run outside `NODE_ENV=test` so it can never plant a
 * known-credentials admin in a real database. The password comes from
 * `E2E_ADMIN_PASSWORD`; the fallback is only reachable under the test guard.
 */
export async function seedAdmin(
  email = process.env.E2E_ADMIN_EMAIL ?? 'e2e-admin@aolausoro.tech',
  password = process.env.E2E_ADMIN_PASSWORD ?? 'e2e-only-password-change-in-ci',
): Promise<SeededAdmin> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('seedAdmin() is a test-only helper and refuses to run outside NODE_ENV=test')
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'E2E Admin', isAdmin: true },
    })
  }
  return { email, password }
}
