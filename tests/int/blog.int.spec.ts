import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

const richText = {
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'Body.' }] },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
} as never

describe('blog / Posts', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('publishes a post and finds it by slug (published-only for anon)', async () => {
    const slug = `hello-${Date.now()}`
    await payload.create({
      collection: 'posts',
      data: { title: 'Hello', slug, content: richText, _status: 'published' },
      context: { disableRevalidate: true },
    })
    const anon = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    expect(anon.docs).toHaveLength(1)
  })

  it('hides a draft post from anon but shows it with overrideAccess', async () => {
    const slug = `draft-${Date.now()}`
    await payload.create({
      collection: 'posts',
      data: { title: 'Draft', slug, content: richText, _status: 'draft' },
      context: { disableRevalidate: true },
    })
    const anon = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    expect(anon.docs).toHaveLength(0)

    const withDrafts = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      draft: true,
      overrideAccess: true,
    })
    expect(withDrafts.docs.length).toBeGreaterThanOrEqual(1)
  })
})
