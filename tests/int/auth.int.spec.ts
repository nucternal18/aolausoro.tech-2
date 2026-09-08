import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload
const email = `admin+${Date.now()}@aolausoro.tech`
const password = 'test-password-12345'

describe('Users auth', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Test Admin', isAdmin: true },
    })
  })

  it('logs in with correct credentials', async () => {
    const res = await payload.login({ collection: 'users', data: { email, password } })
    expect(res.token).toBeTruthy()
    expect(res.user?.email).toBe(email)
  })

  it('rejects a wrong password', async () => {
    await expect(
      payload.login({ collection: 'users', data: { email, password: 'wrong' } }),
    ).rejects.toThrow()
  })

  it('locks the account after 5 failed attempts', async () => {
    const e = `lock+${Date.now()}@aolausoro.tech`
    await payload.create({
      collection: 'users',
      data: { email: e, password: 'right-password-123', name: 'Lock', isAdmin: false },
    })
    for (let i = 0; i < 5; i++) {
      await payload
        .login({ collection: 'users', data: { email: e, password: 'nope' } })
        .catch(() => {})
    }
    await expect(
      payload.login({ collection: 'users', data: { email: e, password: 'right-password-123' } }),
    ).rejects.toThrow(/lock/i)
  })
})
