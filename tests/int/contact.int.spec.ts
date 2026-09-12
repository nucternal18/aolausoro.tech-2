import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('contact form', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('an anonymous visitor can submit a message; it lands unread', async () => {
    const doc = await payload.create({
      collection: 'messages',
      data: {
        name: 'Visitor',
        email: `visitor+${Date.now()}@example.com`,
        subject: 'Hello',
        message: 'Nice site.',
      },
      overrideAccess: false,
    })
    expect(doc.id).toBeTruthy()
    expect(doc.read).toBe(false)
  })
})
