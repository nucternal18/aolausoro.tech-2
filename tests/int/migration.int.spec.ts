import { describe, it, expect } from 'vitest'
import {
  slugify,
  normalizeEnum,
  lexicalParagraph,
  randomTempPassword,
} from '../../payload/scripts/lib/transforms'

describe('P3.2b transforms', () => {
  it('slugify: lowercases, hyphenates, trims', () => {
    expect(slugify('via ROMA non solo pizza')).toBe('via-roma-non-solo-pizza')
    expect(slugify('  Github Finder!  ')).toBe('github-finder')
  })

  it('normalizeEnum: maps legacy casing/spacing, falls back', () => {
    const jobType = ['full-time', 'part-time', 'contract', 'remote'] as const
    expect(normalizeEnum('Full-time', jobType, 'full-time')).toBe('full-time')
    expect(normalizeEnum('remote', jobType, 'full-time')).toBe('remote')
    expect(normalizeEnum('Full time', jobType, 'full-time')).toBe('full-time')
    expect(normalizeEnum(undefined, jobType, 'full-time')).toBe('full-time')
    const status = ['pending', 'interview', 'declined'] as const
    expect(normalizeEnum('Declined', status, 'pending')).toBe('declined')
    expect(normalizeEnum('weird', status, 'pending')).toBe('pending')
  })

  it('lexicalParagraph: valid minimal root, empty -> em dash', () => {
    const doc = lexicalParagraph('Clean architecture in react')
    expect(doc.root.type).toBe('root')
    expect(doc.root.children[0]!.type).toBe('paragraph')
    expect(doc.root.children[0]!.children[0]!.text).toBe('Clean architecture in react')
    expect(lexicalParagraph('').root.children[0]!.children[0]!.text).toBe('—')
    expect(lexicalParagraph(null).root.children[0]!.children[0]!.text).toBe('—')
  })

  it('randomTempPassword: url-safe, >= 20 chars, unique', () => {
    const a = randomTempPassword()
    const b = randomTempPassword()
    expect(a).toMatch(/^[A-Za-z0-9_-]{20,}$/)
    expect(a).not.toBe(b)
  })
})
