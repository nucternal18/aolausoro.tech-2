import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('collection access', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('lets anonymous create a Message (contact form)', async () => {
    const doc = await payload.create({
      collection: 'messages',
      data: { name: 'A', email: 'a@b.co', subject: 'Hi', message: 'Hello' },
      overrideAccess: false,
    })
    expect(doc.id).toBeTruthy()
  })

  it('denies anonymous read of Messages', async () => {
    const res = await payload.find({ collection: 'messages', overrideAccess: false })
    expect(res.docs.length).toBe(0)
  })

  it('denies anonymous read of the private collections', async () => {
    for (const collection of ['jobs', 'issues', 'wiki', 'cvs'] as const) {
      const res = await payload.find({ collection, overrideAccess: false })
      expect(res.docs.length).toBe(0)
    }
  })

  it('allows anonymous read of the public collections', async () => {
    for (const collection of ['projects', 'categories', 'media'] as const) {
      await expect(payload.find({ collection, overrideAccess: false })).resolves.toBeDefined()
    }
  })

  it('does not allow public user signup', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: { email: `x${Date.now()}@b.co`, password: 'pw-123456789', name: 'X' },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
