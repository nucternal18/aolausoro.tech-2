import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Payload local API', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('initializes and can query users', async () => {
    const users = await payload.find({ collection: 'users', limit: 0 })
    expect(typeof users.totalDocs).toBe('number')
  })

  it('resolves the categories collection', async () => {
    const cats = await payload.find({ collection: 'categories', limit: 0 })
    expect(typeof cats.totalDocs).toBe('number')
  })
})
