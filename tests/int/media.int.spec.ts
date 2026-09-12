import { getPayload, type Payload } from 'payload'
import type { Field } from 'payload'
import config from '@payload-config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

const fieldNames = (fields: Field[]): string[] =>
  fields.flatMap((f) => ('name' in f && typeof f.name === 'string' ? [f.name] : []))

describe('P3.3a media schema', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('cvs is an upload collection with no cvUrl field', () => {
    const cvs = payload.collections.cvs.config
    expect(cvs.upload).toBeTruthy()
    expect(fieldNames(cvs.fields)).not.toContain('cvUrl')
  })

  it('wiki has an `image` upload field and no `imageUrl`', () => {
    const fields = payload.collections.wiki.config.fields
    const image = fields.find((f) => 'name' in f && f.name === 'image')
    expect(image).toMatchObject({ type: 'upload', relationTo: 'media' })
    expect(fieldNames(fields)).not.toContain('imageUrl')
  })

  it('projects has a required `screenshot` upload and no `url` field', () => {
    const fields = payload.collections.projects.config.fields
    const shot = fields.find((f) => 'name' in f && f.name === 'screenshot')
    expect(shot).toMatchObject({ type: 'upload', relationTo: 'media', required: true })
    expect(fieldNames(fields)).not.toContain('url')
  })

  it('media is an upload collection', () => {
    expect(payload.collections.media.config.upload).toBeTruthy()
  })
})
