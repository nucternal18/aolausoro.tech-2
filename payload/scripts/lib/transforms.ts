import { randomBytes } from 'node:crypto'

/** Lowercase, collapse non-alphanumerics to single hyphens, trim hyphens. */
export function slugify(input: string): string {
  return String(input ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Map a legacy free-form enum value onto one of `allowed` (lowercased,
 * whitespace-hyphenated). Returns `fallback` when it doesn't match.
 */
export function normalizeEnum<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof raw !== 'string') return fallback
  const key = raw.toLowerCase().trim().replace(/\s+/g, '-')
  return (allowed as readonly string[]).includes(key) ? (key as T) : fallback
}

type SerializedText = {
  type: 'text'
  text: string
  format: 0
  style: ''
  mode: 'normal'
  detail: 0
  version: 1
}

type SerializedParagraph = {
  type: 'paragraph'
  format: ''
  indent: 0
  version: 1
  direction: 'ltr'
  textFormat: 0
  children: SerializedText[]
}

type MinimalEditorState = {
  root: {
    type: 'root'
    format: ''
    indent: 0
    version: 1
    direction: 'ltr'
    children: SerializedParagraph[]
  }
}

/** Wrap a plain string in the minimal valid Lexical editor state (one paragraph). */
export function lexicalParagraph(text: string | null | undefined): MinimalEditorState {
  const value = String(text ?? '').trim() || '—'
  const textNode: SerializedText = {
    type: 'text',
    text: value,
    format: 0,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          children: [textNode],
        },
      ],
    },
  }
}

/** 24 url-safe characters of CSPRNG entropy — a throwaway password for reset. */
export function randomTempPassword(): string {
  return randomBytes(18).toString('base64url')
}
