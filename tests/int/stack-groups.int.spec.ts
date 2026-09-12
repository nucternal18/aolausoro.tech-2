import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('stack-groups collection', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('creates a group with items and is readable without authentication', async () => {
    const label = `Test Layer ${Date.now()}`
    const doc = await payload.create({
      collection: 'stack-groups',
      overrideAccess: true,
      data: {
        label,
        items: [
          { name: 'Vitest', filled: true },
          { name: 'Playwright', filled: false },
        ],
      },
    })
    expect(doc.items).toHaveLength(2)

    const anon = await payload.find({
      collection: 'stack-groups',
      where: { label: { equals: label } },
      overrideAccess: false,
    })
    expect(anon.docs).toHaveLength(1)
  })

  it('denies an unauthenticated create', async () => {
    await expect(
      payload.create({
        collection: 'stack-groups',
        overrideAccess: false,
        data: { label: 'Should fail', items: [{ name: 'X', filled: false }] },
      }),
    ).rejects.toThrow(/Forbidden|not allowed/i)
  })
})
