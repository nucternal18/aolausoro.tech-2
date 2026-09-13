import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('site-settings global', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('is readable without authentication', async () => {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
    })
    expect(settings.hero.name).toBeTruthy()
    expect(settings.ticker.length).toBeGreaterThan(0)
  })

  it('denies an unauthenticated update', async () => {
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { hero: { eyebrow: 'X' } },
        overrideAccess: false,
      }),
    ).rejects.toThrow(/Forbidden|not allowed/i)
  })
})
