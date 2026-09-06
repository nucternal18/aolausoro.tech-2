import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPayload } from 'payload'
import { GET } from '../../app/api/health/route'

// The live `getPayload({ config })` currently rejects because payload.config.ts
// does not load (Posts declares a relationship to an unregistered `categories`
// collection). Mock the `payload` module so the route handler's own logic can be
// exercised deterministically in both branches. Also stub `@payload-config` so
// importing the route module does not pull in the broken buildConfig() promise.
vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns 200 with status ok when Payload initializes', async () => {
    vi.mocked(getPayload).mockResolvedValue({} as never)
    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })

  it('returns 503 with status error when Payload init fails', async () => {
    vi.mocked(getPayload).mockRejectedValue(new Error('db down'))
    const res = await GET()
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ status: 'error' })
  })
})
