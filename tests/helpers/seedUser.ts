import { getPayload } from 'payload'
import config from '@payload-config'

export interface SeededAdmin {
  email: string
  password: string
}

/**
 * Idempotent: ensures a known admin user exists. Call from an e2e test's
 * beforeAll / global setup. Requires a reachable database and, for the login
 * to succeed without a TOTP prompt, `NODE_ENV=test` or `TOTP_FORCE_SETUP=false`.
 */
export async function seedAdmin(
  email = 'e2e-admin@aolausoro.tech',
  password = 'e2e-password-12345',
): Promise<SeededAdmin> {
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
