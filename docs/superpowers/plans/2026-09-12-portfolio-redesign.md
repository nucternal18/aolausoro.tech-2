# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved "edgy" brutalist redesign (Claude Design project `1db145c0-be22-4905-aeac-2baf68b3b214`, `Redesign.dc.html`) across every page, with hero/nav/footer/CTA/contact/ticker/stack copy driven from new Payload admin fields (the user's "maximal" CMS scope), and fix the specific bugs the design doc flags along the way.

**Architecture:** New Payload `site-settings` global + `stack-groups` collection + two new `Projects` fields land first (Tasks 1-3), so every later component task has real data to read. Visual work then proceeds in the design doc's own order: tokens → primitives → nav/footer → hero → cards/modal → stack/CTA → blog/search/contact (Tasks 4-16). Every task is independently buildable and committable.

**Tech Stack:** Next.js 16 App Router, Payload CMS 3.86 (local API), Tailwind CSS v4 (`@theme inline`), shadcn/ui (Radix primitives — `components/ui/dialog.tsx` already installed and unused), MongoDB.

**Spec:** `docs/superpowers/specs/2026-09-12-portfolio-redesign-design.md`

## Global Constraints

- New branch `feature/portfolio-redesign`, forked from `main`. Never commit directly to `main` for this work.
- `--radius: 0` everywhere, hard offset shadows (never blur), 2px ink borders, mono labels for rank/meta, Bebas restricted to headings and ≤6-word titles (never prose).
- `--accent-hot` (`#00DCB3`) is a **surface** color only on light mode (1.66:1 contrast) — never text. Use `--accent-text` (`#006B5B`, 5.0:1) for inline accent text on light. In dark mode `--accent-text` is `#00DCB3` itself (10.4:1).
- Focus is `outline: 3px solid var(--accent-hot); outline-offset: 2px` — never a ring, never a border-color change.
- Motion is `transform`/`opacity` only: hover/press lift (130ms linear), the ticker (28s `translateX(-50%)`, pauses on hover/focus-within), nav underline/row-wash color transitions (120ms), Radix Dialog's stock 150ms fade+zoom. No scroll-triggered entrances, no parallax, no counters, no `requestAnimationFrame`.
- `prefers-reduced-motion: reduce` must kill all `.ticker`/`[class*='animate-']` animation and drop transitions to 1ms — this lands in Task 4's `globals.css` and applies globally from there on.
- Every new Payload field/collection/global mirrors the access pattern already used by `payload/collections/Projects/index.ts`: `read: anyone` (`@access/anyone`), `create`/`update: authenticated`, `delete: authenticatedAndAdmin` (globals have no create/delete).
- After every Payload schema change: run `pnpm run generate:types` (updates `payload-types.ts`) and `pnpm run generate:importmap` (updates `app/(protected)/admin/importMap.js` — this file is `.prettierignore`d, don't hand-format it) before the commit.
- `pnpm run lint`, `pnpm exec tsc --noEmit`, and `pnpm run build` must pass on every task's commit — this is new code, not the pre-existing legacy-migration debt the rest of the repo is currently exempt from.
- Real facts (email, location, social URLs) are read from `site-settings.contact` everywhere — never re-hardcoded per component. Real values: email `adewoyin@aolausoro.tech`, location `LONDON, UK`, GitHub `https://github.com/nucternal18`, LinkedIn `https://www.linkedin.com/in/adewoyin-oladipupo-usoro-267291100/`, Stack Overflow `https://stackoverflow.com/users/11582232/aolausoro`.

---

## Task 1: `site-settings` global — schema, types, seed

**Files:**
- Create: `payload/globals/SiteSettings/index.ts`
- Modify: `payload.config.ts` (add `globals: [SiteSettings]`)
- Create: `payload/scripts/seed-redesign-content.ts`
- Test: `tests/int/site-settings.int.spec.ts`

**Interfaces:**
- Produces: Payload global slug `'site-settings'`, TypeScript type `SiteSetting` in `payload-types.ts` (generated) with shape:
  ```ts
  {
    hero: {
      eyebrow: string
      stackLine: string
      name: string
      lead: string
      terminalLines: { prompt: string; output: string }[]
      primaryCtaLabel: string
      secondaryCtaLabel: string
      statLocation: string
      statStatus: string
    }
    ticker: { message: string }[]
    nav: {
      links: { label: string; href: string }[]
      ctaLabel: string
    }
    contact: {
      email: string
      location: string
      responsePromise: string
      socialLinks: { platform: 'github' | 'linkedin' | 'stackoverflow' | 'other'; url: string; label: string }[]
    }
    cta: { eyebrow: string; heading: string; body: string }
    footer: { bio: string; buttonLabel: string; colophon: string }
    sectionHeadings: {
      work: { eyebrow: string; heading: string; description: string }
      stack: { eyebrow: string; heading: string; description: string }
      writing: { eyebrow: string; heading: string }
      search: { heading: string }
      contactPage: { eyebrow: string; heading: string; body: string }
    }
  }
  ```
- Consumes: `@access/anyone` (`anyone`), `@access/authenticated` (`authenticated`) — both already exist.

- [ ] **Step 1: Write the global config**

Create `payload/globals/SiteSettings/index.ts`:

```ts
import type { GlobalConfig } from 'payload'
import { anyone } from '@access/anyone'
import { authenticated } from '@access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'FULL-STACK ENGINEER' },
        {
          name: 'stackLine',
          type: 'text',
          required: true,
          defaultValue: 'TYPESCRIPT · NEXT.JS · NODE · DOCKER',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Adewoyin Oladipupo-Usoro',
          admin: {
            description: 'The last word is rendered with the outlined-text treatment.',
          },
        },
        {
          name: 'lead',
          type: 'textarea',
          required: true,
          defaultValue:
            'I design, build and deploy full-stack web products end to end — a Next.js front end, a typed API behind it, and the Docker pipeline that puts it in production on my own infrastructure.',
        },
        {
          name: 'terminalLines',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'prompt', type: 'text', required: true },
            { name: 'output', type: 'text', required: true },
          ],
          defaultValue: [
            { prompt: 'whoami', output: 'adewoyin — full-stack engineer, london' },
            { prompt: 'cat stack.txt', output: 'next.js · node · typescript · docker · mongodb' },
          ],
        },
        { name: 'primaryCtaLabel', type: 'text', required: true, defaultValue: 'SEE THE WORK' },
        { name: 'secondaryCtaLabel', type: 'text', required: true, defaultValue: 'CV (PDF)' },
        { name: 'statLocation', type: 'text', required: true, defaultValue: 'LONDON, UK' },
        { name: 'statStatus', type: 'text', required: true, defaultValue: 'OPEN TO WORK' },
      ],
    },
    {
      name: 'ticker',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'message', type: 'text', required: true }],
      defaultValue: [
        { message: 'CURRENTLY · MIGRATING AOLAUSORO.TECH ONTO PAYLOAD CMS' },
        { message: 'OPEN TO CONTRACT + PERMANENT ROLES' },
        { message: 'REPLIES WITHIN A DAY' },
      ],
    },
    {
      name: 'nav',
      type: 'group',
      fields: [
        {
          name: 'links',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
          defaultValue: [
            { label: 'WORK', href: '/#work' },
            { label: 'STACK', href: '/#stack' },
            { label: 'WRITING', href: '/posts' },
            { label: 'CONTACT', href: '/contact' },
          ],
        },
        { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'HIRE ME' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', required: true, defaultValue: 'adewoyin@aolausoro.tech' },
        { name: 'location', type: 'text', required: true, defaultValue: 'LONDON, UK' },
        {
          name: 'responsePromise',
          type: 'text',
          required: true,
          defaultValue: 'REPLIES WITHIN A DAY',
        },
        {
          name: 'socialLinks',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'GitHub', value: 'github' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Stack Overflow', value: 'stackoverflow' },
                { label: 'Other', value: 'other' },
              ],
            },
            { name: 'url', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
          defaultValue: [
            {
              platform: 'github',
              url: 'https://github.com/nucternal18',
              label: 'GitHub',
            },
            {
              platform: 'linkedin',
              url: 'https://www.linkedin.com/in/adewoyin-oladipupo-usoro-267291100/',
              label: 'LinkedIn',
            },
            {
              platform: 'stackoverflow',
              url: 'https://stackoverflow.com/users/11582232/aolausoro',
              label: 'Stack Overflow',
            },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: '04 / CONTACT' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Got a role or a build?' },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          defaultValue:
            "I'm open to contract and permanent full-stack work. Email is the fastest route and I reply within a day — tell me what you're building and where it's stuck.",
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'bio',
          type: 'textarea',
          required: true,
          defaultValue:
            'Adewoyin Oladipupo-Usoro — full-stack engineer. Currently open to contract and permanent roles.',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          required: true,
          defaultValue: 'START A CONVERSATION',
        },
        {
          name: 'colophon',
          type: 'text',
          required: true,
          defaultValue: 'NEXT.JS 16 · PAYLOAD CMS · DOCKER ON DIGITALOCEAN',
        },
      ],
    },
    {
      name: 'sectionHeadings',
      type: 'group',
      fields: [
        {
          name: 'work',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: '02 / FEATURED WORK' },
            { name: 'heading', type: 'text', required: true, defaultValue: 'Selected projects' },
            {
              name: 'description',
              type: 'text',
              required: true,
              defaultValue:
                'Published from Payload. Open any card for the full write-up, stack and screenshots.',
            },
          ],
        },
        {
          name: 'stack',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: '03 / STACK' },
            { name: 'heading', type: 'text', required: true, defaultValue: 'What I work in' },
            {
              name: 'description',
              type: 'text',
              required: true,
              defaultValue: 'Grouped by layer. Bold means daily; the rest is working knowledge.',
            },
          ],
        },
        {
          name: 'writing',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: 'WRITING' },
            {
              name: 'heading',
              type: 'text',
              required: true,
              defaultValue: 'Notes from the build',
            },
          ],
        },
        {
          name: 'search',
          type: 'group',
          fields: [{ name: 'heading', type: 'text', required: true, defaultValue: 'Search' }],
        },
        {
          name: 'contactPage',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: 'CONTACT' },
            { name: 'heading', type: 'text', required: true, defaultValue: "Let's talk" },
            {
              name: 'body',
              type: 'textarea',
              required: true,
              defaultValue:
                "Roles, contracts, or a build that's stuck — tell me what you need and I'll reply within a day.",
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSettings
```

- [ ] **Step 2: Register the global in `payload.config.ts`**

In `payload.config.ts`, add the import near the other collection imports:

```ts
import { SiteSettings } from './payload/globals/SiteSettings'
```

Add a `globals:` array to the `buildConfig` call, placed after `collections:` (this repo currently has no `globals:` key at all):

```ts
  collections: [Categories, Posts, Projects, Jobs, Messages, Wiki, Issues, CVs, Users, Media],
  globals: [SiteSettings],
```

- [ ] **Step 3: Regenerate types and import map**

Run:
```bash
pnpm run generate:types
pnpm run generate:importmap
```
Expected: `payload-types.ts` gains a `SiteSetting` type; `app/(protected)/admin/importMap.js` is rewritten (do not hand-edit or `git checkout` this file — it's `.prettierignore`d and must reflect the current config).

- [ ] **Step 4: Write the integration test**

Create `tests/int/site-settings.int.spec.ts`, mirroring the access-control assertions already used in `tests/int/access.int.spec.ts` (read the top of that file first for the exact test-payload bootstrap pattern used in this repo — `getPayload({ config })` against the test DB, then reuse that setup):

```ts
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

let payload: Payload

describe('site-settings global', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('is readable without authentication', async () => {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
    })
    expect(settings.hero.name).toBeTruthy()
    expect(settings.ticker.length).toBeGreaterThan(0)
  })

  it('rejects an unauthenticated update', async () => {
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { hero: { eyebrow: 'X' } },
        overrideAccess: false,
        user: undefined,
      }),
    ).rejects.toThrow()
  })
})
```

Adjust the `beforeAll`/`afterAll` bootstrap to match whatever pattern `tests/int/access.int.spec.ts` actually uses if it differs (e.g. a shared test helper) — read that file before writing this one, since it is this repo's canonical example of an access-control integration test.

- [ ] **Step 5: Run the test**

Run: `pnpm run test:int -- site-settings`
Expected: both cases PASS.

- [ ] **Step 6: Seed script (defaults already cover this — script exists for re-seeding after a schema change)**

Create `payload/scripts/seed-redesign-content.ts`:

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-off: pushes the site-settings global's field defaultValues explicitly.
 * Payload only applies defaultValue on document creation, and a global is
 * implicitly created empty on first read — this makes sure the values are
 * actually persisted rather than relying on runtime default-filling.
 *
 *   pnpm payload run payload/scripts/seed-redesign-content.ts
 */
async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (existing.hero?.name) {
    console.log('site-settings already has content — skipping (delete fields in /admin to re-seed).')
    return
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {}, // defaultValue on each field fills the document on first write
  })

  console.log('site-settings seeded.')
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

Run: `pnpm payload run payload/scripts/seed-redesign-content.ts`
Expected: `site-settings seeded.` printed, and `/admin/globals/site-settings` shows the default copy.

- [ ] **Step 7: Verify build and commit**

Run: `pnpm run lint && pnpm exec tsc --noEmit`
Expected: no new errors from these files.

```bash
git checkout -b feature/portfolio-redesign
git add payload/globals/SiteSettings payload.config.ts payload-types.ts app/\(protected\)/admin/importMap.js payload/scripts/seed-redesign-content.ts tests/int/site-settings.int.spec.ts
git commit -m "feat(cms): add site-settings global for redesign copy"
```

---

## Task 2: `stack-groups` collection — schema, types, seed

**Files:**
- Create: `payload/collections/StackGroups/index.ts`
- Modify: `payload.config.ts` (add `StackGroups` to `collections:`)
- Modify: `payload/scripts/seed-redesign-content.ts` (extend from Task 1)
- Test: `tests/int/stack-groups.int.spec.ts`

**Interfaces:**
- Produces: Payload collection slug `'stack-groups'`, TypeScript type `StackGroup` with shape `{ label: string; items: { name: string; filled: boolean }[] }`.
- Consumes: `anyone`, `authenticated`, `authenticatedAndAdmin` from the same access helpers as Task 1.

- [ ] **Step 1: Write the collection config**

Create `payload/collections/StackGroups/index.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { anyone } from '@access/anyone'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'

export const StackGroups: CollectionConfig = {
  slug: 'stack-groups',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'updatedAt'],
    group: 'Site',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticatedAndAdmin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'filled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Checked = solid/filled chip (daily use). Unchecked = outlined chip (working knowledge).',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

export default StackGroups
```

- [ ] **Step 2: Register in `payload.config.ts`**

```ts
import StackGroups from './payload/collections/StackGroups'
```

```ts
  collections: [Categories, Posts, Projects, Jobs, Messages, Wiki, Issues, CVs, Users, Media, StackGroups],
```

- [ ] **Step 3: Regenerate types and import map**

Run: `pnpm run generate:types && pnpm run generate:importmap`
Expected: `payload-types.ts` gains a `StackGroup` type.

- [ ] **Step 4: Write the integration test**

Create `tests/int/stack-groups.int.spec.ts`, mirroring the collection-CRUD shape used in `tests/int/blog.int.spec.ts` (read that file first for this repo's create/read/delete pattern against a real collection):

```ts
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

let payload: Payload
let createdId: string | number

describe('stack-groups collection', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (createdId) {
      await payload.delete({ collection: 'stack-groups', id: createdId, overrideAccess: true })
    }
    await payload.destroy()
  })

  it('creates a group with items', async () => {
    const doc = await payload.create({
      collection: 'stack-groups',
      overrideAccess: true,
      data: {
        label: 'Test Layer',
        items: [
          { name: 'Vitest', filled: true },
          { name: 'Playwright', filled: false },
        ],
      },
    })
    createdId = doc.id
    expect(doc.items).toHaveLength(2)
  })

  it('is readable without authentication', async () => {
    const res = await payload.find({
      collection: 'stack-groups',
      overrideAccess: false,
    })
    expect(res.docs.some((d) => d.id === createdId)).toBe(true)
  })
})
```

- [ ] **Step 5: Run the test**

Run: `pnpm run test:int -- stack-groups`
Expected: both cases PASS.

- [ ] **Step 6: Extend the seed script with the four real stack groups**

Modify `payload/scripts/seed-redesign-content.ts`, adding this after the `site-settings` block in `main()` (the exact groups/items/filled-flags shown approved in the design doc §1h):

```ts
  const stackGroupSeeds = [
    {
      label: 'Frontend',
      items: [
        { name: 'React', filled: true },
        { name: 'Next.js', filled: true },
        { name: 'TypeScript', filled: true },
        { name: 'Tailwind', filled: false },
        { name: 'Motion', filled: false },
        { name: 'React Native', filled: false },
        { name: 'Expo', filled: false },
      ],
    },
    {
      label: 'Backend',
      items: [
        { name: 'Node.js', filled: true },
        { name: 'MongoDB', filled: true },
        { name: 'NestJS', filled: false },
        { name: 'Express', filled: false },
        { name: 'PostgreSQL', filled: false },
        { name: 'GraphQL', filled: false },
      ],
    },
    {
      label: 'Platform',
      items: [
        { name: 'Docker', filled: true },
        { name: 'GitHub Actions', filled: true },
        { name: 'Digital Ocean', filled: false },
        { name: 'Nginx', filled: false },
        { name: 'AWS', filled: false },
        { name: 'Vercel', filled: false },
      ],
    },
    {
      label: 'Craft',
      items: [
        { name: 'Accessibility', filled: false },
        { name: 'Web Performance', filled: false },
        { name: 'Figma', filled: false },
        { name: 'Testing', filled: false },
      ],
    },
  ]

  const existingGroups = await payload.find({ collection: 'stack-groups', overrideAccess: true, limit: 1 })
  if (existingGroups.totalDocs === 0) {
    for (const group of stackGroupSeeds) {
      await payload.create({ collection: 'stack-groups', overrideAccess: true, data: group })
    }
    console.log('stack-groups seeded.')
  } else {
    console.log('stack-groups already has documents — skipping.')
  }
```

- [ ] **Step 7: Run the seed script**

Run: `pnpm payload run payload/scripts/seed-redesign-content.ts`
Expected: `stack-groups seeded.` printed; `/admin/collections/stack-groups` shows 4 documents.

- [ ] **Step 8: Verify and commit**

Run: `pnpm run lint && pnpm exec tsc --noEmit`

```bash
git add payload/collections/StackGroups payload.config.ts payload-types.ts app/\(protected\)/admin/importMap.js payload/scripts/seed-redesign-content.ts tests/int/stack-groups.int.spec.ts
git commit -m "feat(cms): add stack-groups collection, seed frontend/backend/platform/craft"
```

---

## Task 3: `Projects` collection — `longDescription` + `appImages` fields

**Files:**
- Modify: `payload/collections/Projects/index.ts`
- Test: extend `tests/int/api.int.spec.ts` (read it first to confirm it's the file that exercises `Projects`; if a different spec owns Projects coverage, add there instead)

**Interfaces:**
- Produces: two new optional fields on the `projects` collection — `longDescription: SerializedEditorState | null` (Lexical richText), `appImages: { image: string | Media }[]`.
- Consumes: nothing new — extends the existing collection from Task-independent baseline.

- [ ] **Step 1: Add the fields**

In `payload/collections/Projects/index.ts`, add after the existing `techStack` field and before `published`:

```ts
    {
      name: 'longDescription',
      type: 'richText',
      admin: {
        description: 'Powers the "THE BUILD" write-up in the project modal.',
      },
    },
    {
      name: 'appImages',
      type: 'array',
      admin: {
        description: 'Powers the 4-thumbnail gallery in the project modal. Falls back to the single screenshot above if empty.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
```

- [ ] **Step 2: Regenerate types and import map**

Run: `pnpm run generate:types && pnpm run generate:importmap`
Expected: `Project` type in `payload-types.ts` gains `longDescription` and `appImages`.

- [ ] **Step 3: Add test coverage**

Read `tests/int/api.int.spec.ts` first. Add a case following its existing pattern for creating a `projects` document, asserting the two new fields round-trip:

```ts
  it('accepts longDescription and appImages on a project', async () => {
    // Reuse whatever authenticated user / media fixture this file's other
    // Projects tests already set up — do not create a second one.
    const doc = await payload.create({
      collection: 'projects',
      overrideAccess: true,
      data: {
        title: 'Redesign field test',
        description: 'Testing new fields',
        screenshot: /* existing media fixture id used elsewhere in this file */,
        user: /* existing user fixture id used elsewhere in this file */,
        longDescription: {
          root: {
            type: 'root',
            children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Build notes.' }] }],
          },
        },
        appImages: [{ image: /* same media fixture id */ }],
      },
    })
    expect(doc.appImages).toHaveLength(1)
    expect(doc.longDescription).toBeTruthy()
  })
```

Replace the two `/* ... */` placeholders with whatever fixture IDs `api.int.spec.ts` already uses elsewhere in the file for its other `projects`-creating tests — do not invent new fixtures.

- [ ] **Step 4: Run the test**

Run: `pnpm run test:int -- api`
Expected: new case PASSes alongside the existing ones in that file.

- [ ] **Step 5: Verify and commit**

Run: `pnpm run lint && pnpm exec tsc --noEmit`

```bash
git add payload/collections/Projects payload-types.ts app/\(protected\)/admin/importMap.js tests/int/api.int.spec.ts
git commit -m "feat(cms): add longDescription and appImages fields to Projects"
```

---

## Task 4: Tokens + fonts (`app/globals.css`, `app/(home)/layout.tsx`)

**Files:**
- Modify: `app/globals.css` (full replace)
- Modify: `app/(home)/layout.tsx`
- Modify: `package.json` (no dependency change yet — Inter comes from `next/font/google`, already a supported import path in this repo)

**Interfaces:**
- Produces: Tailwind utilities `font-display`, `font-sans` (now Inter), `font-mono`, `bg-paper`, `text-ink`/`text-ink-2`/`text-ink-3`, `bg-accent-hot`, `text-accent-text`, `text-on-accent`, `border-edge`, `border-rule` (via `--color-rule`), `bg-tag-{type,framework,runtime,data,platform}`, `text-tag-ink`, `shadow-hard`/`shadow-hard-lift`/`shadow-hard-press`/`shadow-hard-accent`, custom utility classes `hard-lift`, `grid-rules`, `rule-y`, `chip`, `label-mono`, `text-outline`, `ticker`, `animate-tick`, `animate-caret`. All later tasks depend on these existing.
- Consumes: nothing (zero component edits, per the design doc's own instruction — this task changes shape sitewide with no other file touched except the font registration).

- [ ] **Step 1: Replace `app/globals.css`**

Replace the entire file content with the token set below (this fixes the pre-existing bug where `.dark`'s `--primary`/`--primary-foreground` are raw unwrapped HSL triples, removes `.matrix-bg`/`.matrix-char`/`matrixFall`/`matrixGlow`, and keeps `.masonry*`/`.break-inside` since the blog archive still uses them):

```css
/* ============================================================================
   app/globals.css — brutalist token set
   ============================================================================ */

@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* ----------------------------------------------------------------------------
   1. GROUND — light
   ---------------------------------------------------------------------------- */
:root {
  --paper: #fbfaf6;
  --ink: #0b1220;
  --ink-2: #3b4454; /* 9.3:1 on paper — body-safe */
  --ink-3: #6b7280; /* 4.7:1 on paper — AA at 16px, do not go smaller */

  --accent-hot: #00dcb3;
  --accent-text: #006b5b;
  --on-accent: #00261f; /* 9.9:1 on --accent-hot */

  --rule: rgb(11 18 32 / 0.14);
  --edge: #0b1220;

  --tag-type: #cff7eb;
  --tag-framework: #ddf5fb;
  --tag-runtime: #fff3d6;
  --tag-data: #e3f8ee;
  --tag-platform: #eae7dd;
  --tag-ink: #0b1220;

  --background: var(--paper);
  --foreground: var(--ink);
  --card: var(--paper);
  --card-foreground: var(--ink);
  --popover: var(--paper);
  --popover-foreground: var(--ink);
  --primary: var(--accent-hot);
  --primary-foreground: var(--on-accent);
  --secondary: #eae7dd;
  --secondary-foreground: var(--ink);
  --muted: #eae7dd;
  --muted-foreground: var(--ink-2);
  --accent: #eae7dd;
  --accent-foreground: var(--ink);
  --destructive: #b91c1c; /* 6.4:1 on paper */
  --destructive-foreground: var(--paper);
  --border: var(--edge);
  --input: var(--edge);
  --ring: var(--accent-hot);

  --radius: 0px;

  --sidebar: var(--paper);
  --sidebar-foreground: var(--ink);
  --sidebar-primary: var(--accent-hot);
  --sidebar-primary-foreground: var(--on-accent);
  --sidebar-accent: #eae7dd;
  --sidebar-accent-foreground: var(--ink);
  --sidebar-border: var(--edge);
  --sidebar-ring: var(--accent-hot);
}

/* ----------------------------------------------------------------------------
   2. GROUND — dark
   ---------------------------------------------------------------------------- */
.dark {
  --paper: #0a0e14;
  --ink: #efece3;
  --ink-2: #c9c3b2; /* 11:1 on void */
  --ink-3: #8a8676; /* 5.3:1 on void */

  --accent-hot: #00dcb3;
  --accent-text: #00dcb3; /* 10.4:1 on void — usable as text here */
  --on-accent: #00261f;

  --rule: rgb(239 236 227 / 0.16);
  --edge: #efece3;

  --tag-type: transparent;
  --tag-framework: transparent;
  --tag-runtime: transparent;
  --tag-data: transparent;
  --tag-platform: transparent;
  --tag-ink: #efece3;

  --background: var(--paper);
  --foreground: var(--ink);
  --card: var(--paper);
  --card-foreground: var(--ink);
  --popover: #141922;
  --popover-foreground: var(--ink);
  --primary: var(--accent-hot);
  --primary-foreground: var(--on-accent);
  --secondary: #1c222d;
  --secondary-foreground: var(--ink);
  --muted: #1c222d;
  --muted-foreground: var(--ink-2);
  --accent: #1c222d;
  --accent-foreground: var(--ink);
  --destructive: #f87171; /* 7.0:1 on void — #B91C1C is only 2.6:1 here */
  --destructive-foreground: #0a0e14;
  --border: var(--edge);
  --input: var(--edge);
  --ring: var(--accent-hot);

  --sidebar: var(--paper);
  --sidebar-foreground: var(--ink);
  --sidebar-primary: var(--accent-hot);
  --sidebar-primary-foreground: var(--on-accent);
  --sidebar-accent: #1c222d;
  --sidebar-accent-foreground: var(--ink);
  --sidebar-border: var(--edge);
  --sidebar-ring: var(--accent-hot);
}

/* ----------------------------------------------------------------------------
   3. THEME
   ---------------------------------------------------------------------------- */
@theme inline {
  --font-display: var(--font-bebas), 'Bebas Neue', ui-sans-serif, sans-serif;
  --font-sans: var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-geist: 'Geist', var(--font-inter), ui-sans-serif, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-display-xl: 9.875rem;
  --text-display-xl--line-height: 0.82;
  --text-display-xl--letter-spacing: 0.004em;
  --text-display-l: 6rem;
  --text-display-l--line-height: 0.86;
  --text-display-m: 3.75rem;
  --text-display-m--line-height: 0.9;
  --text-display-s: 2.5rem;
  --text-display-s--line-height: 0.95;
  --text-display-xs: 2rem;
  --text-display-xs--line-height: 0.95;

  --text-label: 0.6875rem;
  --text-label--line-height: 1;
  --text-label--letter-spacing: 0.14em;
  --text-meta: 0.75rem;
  --text-meta--line-height: 1.5;

  --text-lead: 1.0625rem;
  --text-lead--line-height: 1.6;
  --text-body: 0.9375rem;
  --text-body--line-height: 1.7;
  --text-prose: 1rem;
  --text-prose--line-height: 1.75;

  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  --radius-2xl: 0px;
  --radius-full: 0px;

  --shadow-hard: 4px 4px 0 0 var(--edge);
  --shadow-hard-lift: 7px 7px 0 0 var(--edge);
  --shadow-hard-press: 1px 1px 0 0 var(--edge);
  --shadow-hard-accent: 10px 10px 0 0 var(--accent-hot);
  --shadow-2xs: 4px 4px 0 0 var(--edge);
  --shadow-xs: 4px 4px 0 0 var(--edge);
  --shadow-sm: 4px 4px 0 0 var(--edge);
  --shadow-md: 4px 4px 0 0 var(--edge);
  --shadow-lg: 7px 7px 0 0 var(--edge);
  --shadow-xl: 7px 7px 0 0 var(--edge);
  --shadow-2xl: 10px 10px 0 0 var(--edge);

  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-accent-hot: var(--accent-hot);
  --color-accent-text: var(--accent-text);
  --color-on-accent: var(--on-accent);
  --color-rule: var(--rule);
  --color-edge: var(--edge);
  --color-tag-type: var(--tag-type);
  --color-tag-framework: var(--tag-framework);
  --color-tag-runtime: var(--tag-runtime);
  --color-tag-data: var(--tag-data);
  --color-tag-platform: var(--tag-platform);
  --color-tag-ink: var(--tag-ink);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --ease-mech: linear;
  --animate-tick: tick 28s linear infinite;
  --animate-caret: caret 1.1s steps(1) infinite;
}

/* ----------------------------------------------------------------------------
   4. BASE
   ---------------------------------------------------------------------------- */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    text-wrap: pretty;
  }

  :focus-visible {
    outline: 3px solid var(--accent-hot);
    outline-offset: 2px;
  }

  ::selection {
    background: var(--accent-hot);
    color: var(--on-accent);
  }

  h1,
  h2,
  h3 {
    @apply font-display;
    letter-spacing: 0.004em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .prose a,
  a[data-inline] {
    color: var(--accent-text);
    border-bottom: 2px solid var(--accent-hot);
  }

  input,
  textarea,
  select {
    @apply border-edge border-2 bg-transparent;
  }
}

/* ----------------------------------------------------------------------------
   5. UTILITIES
   ---------------------------------------------------------------------------- */
@utility hard-lift {
  box-shadow: var(--shadow-hard);
  transition:
    transform 130ms linear,
    box-shadow 130ms linear;

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: var(--shadow-hard-lift);
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: var(--shadow-hard-press);
  }
}

@utility grid-rules {
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 1px,
    transparent 1px calc(100% / 12)
  );
}

@utility rule-y {
  border-bottom: 1px solid var(--rule);
}

@utility chip {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  line-height: 1;
  letter-spacing: 0.06em;
  padding: 0.4375rem 0.5625rem;
  border: 1px solid var(--tag-ink);
  color: var(--tag-ink);
  text-transform: uppercase;
}

@utility label-mono {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@utility text-outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

/* ----------------------------------------------------------------------------
   6. MOTION
   ---------------------------------------------------------------------------- */
@keyframes tick {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes caret {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.ticker {
  animation: var(--animate-tick);
}
.ticker:hover,
.ticker:focus-within {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .ticker,
  [class*='animate-'] {
    animation: none !important;
  }
  *,
  *::before,
  *::after {
    transition-duration: 1ms !important;
  }
}

/* ----------------------------------------------------------------------------
   7. KEEP — still referenced by the blog archive
   ---------------------------------------------------------------------------- */
.masonry {
  column-gap: 1.5em;
  column-count: 1;
}
.masonry-sm {
  column-gap: 1.5em;
  column-count: 2;
}
.masonry-md {
  column-gap: 1.5em;
  column-count: 3;
}
.break-inside {
  break-inside: avoid;
}
```

- [ ] **Step 2: Register Bebas correctly and add Inter, in `app/(home)/layout.tsx`**

Replace the file's content:

```tsx
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { Providers } from '@components/providers'
import '../globals.css'
import 'highlight.js/styles/github-dark.css'

import { cn } from '../../lib/utils'

import LayoutWrapper from './layout-wrapper'

const bebas = localFont({
  src: '../../fonts/BebasNeue-Regular.ttf',
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background text-foreground border-box m-0 flex flex-col scroll-smooth p-0 antialiased',
          bebas.variable,
          inter.variable,
        )}
      >
        <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </div>
      </body>
    </html>
  )
}
```

Note: the `font-sans` class is dropped from `<body>` — `@layer base { body { @apply ... font-sans ... } }` in `globals.css` already applies it, so it doesn't need repeating here. `font-bebas-neue` (the old, never-registered utility) is gone entirely; headings opt in via `font-display`, which now resolves correctly because `--font-bebas` is a real registered CSS variable.

- [ ] **Step 3: Verify the build renders with the new tokens**

Run: `pnpm run dev` and open `/` in a browser (or `pnpm run build` for a non-interactive check).
Expected: the page background is now warm paper (`#FBFAF6`) instead of pure white/near-black, all existing UI primitives (buttons, cards) look different (shadcn defaults now resolve through the new tokens) but the site still functions — this task intentionally does not touch any component, so layout may look inconsistent until Task 5 (primitives) lands. That's expected and matches the design doc's own note that this step "changes shape sitewide with zero component edits."

- [ ] **Step 4: Lint, type-check, commit**

Run: `pnpm run lint && pnpm exec tsc --noEmit`

```bash
git add app/globals.css "app/(home)/layout.tsx"
git commit -m "feat(design): replace token set with brutalist palette, register Bebas + Inter"
```

---

## Task 5: UI primitives — `button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`

**Files:**
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/card.tsx`
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/badge.tsx`

**Interfaces:**
- Consumes: the utilities from Task 4 (`shadow-hard`, `hard-lift`, focus outline from `@layer base`, `border-edge`).
- Produces: no prop/API changes — every existing call site (`<Button variant="outline">`, `<Card>`, `<Input>`, `<Badge>`) keeps working unchanged; only the rendered chrome changes.

- [ ] **Step 1: `components/ui/button.tsx`**

Replace the `buttonVariants` definition (keep everything else — `ButtonProps`, the `Button` component, exports — unchanged):

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 border-edge text-sm font-mono uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-130 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: 'bg-accent-hot text-on-accent shadow-hard hard-lift',
        destructive: 'bg-destructive text-destructive-foreground shadow-hard hard-lift',
        outline: 'bg-paper text-ink shadow-hard hard-lift',
        secondary: 'bg-secondary text-secondary-foreground shadow-hard hard-lift',
        ghost: 'border-transparent hover:bg-accent hover:text-accent-foreground',
        link: 'border-transparent text-accent-text underline-offset-4 hover:underline',
      },
      size: {
        clear: '',
        default: 'h-11 px-5 py-3 has-[>svg]:px-4',
        sm: 'h-9 px-4 has-[>svg]:px-3',
        lg: 'h-12 px-7 has-[>svg]:px-5',
        icon: 'size-11',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
```

- [ ] **Step 2: `components/ui/card.tsx`**

Change only the `Card` root's `className` (line 9 in the current file — the `cn('bg-card text-card-foreground rounded-lg border shadow-sm', className)` call):

```ts
      className={cn('bg-card text-card-foreground border-edge border-2', className)}
```

Leave `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter` untouched — their spacing utilities are unaffected by the token change.

- [ ] **Step 3: `components/ui/input.tsx`**

Replace the `className` string (the `cn(...)` call):

```ts
      className={cn(
        'file:text-foreground placeholder:text-ink-3 border-edge h-12 w-full min-w-0 border-2 bg-transparent px-3 py-2 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'aria-invalid:border-destructive',
        className,
      )}
```

Note: the old `focus-visible:ring-[3px] ring-ring/50` classes are removed entirely — the `:focus-visible { outline: 3px solid var(--accent-hot) }` rule in `globals.css`'s `@layer base` now handles focus for every element including this one, so repeating it per-component is redundant and was the exact thing flagged as "invisible against a 2px border" in the design doc.

- [ ] **Step 4: `components/ui/badge.tsx`**

Replace the `badgeVariants` definition:

```ts
const badgeVariants = cva(
  'chip inline-flex items-center transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-tag-framework text-tag-ink',
        secondary: 'bg-tag-platform text-tag-ink',
        destructive: 'bg-transparent text-destructive border-destructive',
        outline: 'bg-transparent text-ink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
```

- [ ] **Step 5: Visual smoke test**

Run: `pnpm run dev`, open `/contact` (has buttons, inputs, a card). Expected: 2px ink borders, zero rounding, hard offset shadow on default/outline/secondary/destructive buttons that grows on hover and collapses on click; tab to a button or input and confirm the focus outline is a 3px teal ring floating outside the border, not a blurred glow.

- [ ] **Step 6: Lint, type-check, commit**

Run: `pnpm run lint && pnpm exec tsc --noEmit`

```bash
git add components/ui/button.tsx components/ui/card.tsx components/ui/input.tsx components/ui/badge.tsx
git commit -m "feat(design): hard-edge primitives (button, card, input, badge)"
```

---

## Task 6: Unified Navbar wired to `site-settings.nav`

Replaces the desktop `Navbar` + separate `MobileNavbar`/`LayoutWrapper` split with a single responsive nav component, matching design doc §1b (desktop) and §1o (mobile hamburger).

**Files:**
- Modify: `components/navigation/Navbar.tsx` (full rewrite)
- Modify: `components/navigation/nav-components.tsx` (full rewrite — the named-function structure stays, styling changes)
- Modify: `app/(home)/layout-wrapper.tsx` (drop the separate `MobileNavbar` render — the unified `Navbar` now handles both)
- Modify: `components/home.tsx` (pass `siteSettings` prop through to `Navbar`)
- Modify: `app/(home)/page.tsx` (fetch `site-settings` global, pass to `HomeComponent`)

**Interfaces:**
- Consumes: `SiteSetting['nav']` from Task 1 (`{ links: { label, href }[]; ctaLabel: string }`), `SiteSetting['contact']['email']`.
- Produces: `Navbar` now takes `{ nav: SiteSetting['nav']; email: string }` — every other page that renders `Navbar` (check for additional call sites beyond `home.tsx` before finishing this task; if found, thread the same props through) must be updated too.

- [ ] **Step 1: Fetch `site-settings` in `app/(home)/page.tsx`**

Add to the `Promise.all` in `app/(home)/page.tsx`:

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeComponent from '@/components/home'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config })

  const [projects, cvs, posts, siteSettings] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { published: { equals: true } },
      limit: 50,
      sort: '-createdAt',
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'cvs',
      limit: 1,
      sort: '-createdAt',
      depth: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'posts',
      limit: 3,
      sort: '-publishedAt',
      depth: 1,
      overrideAccess: false,
    }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false }),
  ])

  return (
    <HomeComponent
      projects={projects.docs}
      projectsTotalDocs={projects.totalDocs}
      cv={cvs.docs[0] ?? null}
      posts={posts.docs}
      siteSettings={siteSettings}
    />
  )
}
```

- [ ] **Step 2: Thread `siteSettings` through `components/home.tsx`**

```tsx
'use client'

import { Navbar } from './navigation/Navbar'
import { Hero } from './hero'
import { Footer } from './Footer'
import { PortfolioComponent } from './portfolio-component'
import { Skills } from './skills'
import CTA from './cta'

import type { Cv, Post, Project, SiteSetting } from '@/payload-types'

export default function HomeComponent({
  cv,
  posts: _posts,
  projects,
  projectsTotalDocs,
  siteSettings,
}: {
  cv: Cv | null
  posts: Post[]
  projects: Project[]
  projectsTotalDocs: number
  siteSettings: SiteSetting
}) {
  const cvUrl = cv?.url ?? undefined

  return (
    <main className="bg-background relative min-h-screen">
      <Navbar nav={siteSettings.nav} email={siteSettings.contact.email} />
      <Hero
        cvDoc={cvUrl as string}
        hero={siteSettings.hero}
        ticker={siteSettings.ticker}
        location={siteSettings.contact.location}
        status={siteSettings.hero.statStatus}
        email={siteSettings.contact.email}
        projectsTotalDocs={projectsTotalDocs}
      />
      <PortfolioComponent projects={projects} heading={siteSettings.sectionHeadings.work} />
      <Skills heading={siteSettings.sectionHeadings.stack} />
      <CTA cta={siteSettings.cta} email={siteSettings.contact.email} />
      <Footer siteSettings={siteSettings} />
    </main>
  )
}
```

Note: `<MatrixRainAnimation />` and its import are removed here — that removal is verified as part of Task 8 (Hero), which is where `components/animations/*` is deleted; if this task lands before Task 8 in execution order, still remove the `import` and JSX usage now so the build doesn't reference a component you're about to delete out from under a later task — leaving it importing successfully is fine either way since Task 8 deletes the source files, not just this usage.

- [ ] **Step 3: Rewrite `components/navigation/nav-components.tsx`**

The desktop nav is now unified with the mobile view in the same component (matching design §1b's single opaque bar + §1o's hamburger-collapsed version), so this file becomes much smaller — it now only needs to export the reusable pieces `NavLink` (desktop) and a mobile sheet-based menu button. Full replacement:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavDesktopLink({ href, label, index }: { href: string; label: string; index: number }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href.startsWith('/#') && pathname === '/')

  return (
    <Link
      href={href}
      className={`font-mono text-[11px] tracking-[0.12em] flex items-center gap-[7px] border-r border-[color:var(--rule)] px-4 py-4 transition-colors duration-120 ${
        isActive ? 'border-b-4 border-b-accent-hot' : 'border-b-4 border-b-transparent hover:border-b-accent-hot'
      }`}
    >
      <span className="text-ink-3">{String(index).padStart(2, '0')}</span>
      {label}
    </Link>
  )
}

export function NavMobileLink({ href, label, onNavigate }: { href: string; label: string; onNavigate: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="font-mono text-sm tracking-[0.1em] border-edge flex min-h-[48px] items-center border-b-2 px-4"
    >
      {label}
    </Link>
  )
}

export function NavShell({ children }: { children: ReactNode }) {
  return (
    <nav className="border-edge bg-paper sticky top-0 z-50 border-b-2">{children}</nav>
  )
}
```

- [ ] **Step 4: Rewrite `components/navigation/Navbar.tsx`**

Full replacement — one component, responsive via Tailwind breakpoints, mobile menu built on the existing `components/ui/sheet.tsx` (already a dependency, already imported by the current file):

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search as SearchIcon, Moon, Sun, Menu } from 'lucide-react'

import { NavDesktopLink, NavMobileLink, NavShell } from './nav-components'
import { ModeToggle } from '@components/mode-toggle'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@components/ui/sheet'
import type { SiteSetting } from '@/payload-types'

export function Navbar({ nav, email }: { nav: SiteSetting['nav']; email: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <NavShell>
      <div className="flex items-stretch">
        <Link
          href="/"
          className="border-r border-[color:var(--rule)] flex flex-none items-center gap-[10px] px-[18px]"
        >
          <img src="/android-chrome-512x512.png" alt="" className="h-[26px] w-[26px]" />
          <span className="font-display text-xl tracking-[0.04em] text-ink">
            AOLAUSORO<span className="text-accent-text">.TECH</span>
          </span>
        </Link>

        <ul className="hidden flex-1 list-none items-stretch md:flex">
          {nav.links.map((link, i) => (
            <li key={link.href} className="flex">
              <NavDesktopLink href={link.href} label={link.label} index={i + 1} />
            </li>
          ))}
        </ul>

        <Link
          href="/search"
          aria-label="Search"
          className="border-l border-[color:var(--rule)] hidden w-[52px] items-center justify-center text-ink md:flex"
        >
          <SearchIcon className="h-[17px] w-[17px]" />
        </Link>

        <div className="border-l border-[color:var(--rule)] hidden w-[52px] items-center justify-center md:flex">
          <ModeToggle />
        </div>

        <a
          href={`mailto:${email}`}
          className="bg-accent-hot text-on-accent border-edge hidden items-center border-l-2 px-5 font-mono text-[11px] tracking-[0.12em] md:flex"
        >
          {nav.ctaLabel}
        </a>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Menu"
              className="bg-accent-hot text-on-accent border-edge flex min-h-[48px] w-[52px] flex-none items-center justify-center border-l-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="border-edge w-full max-w-sm border-l-2 bg-paper p-0">
            <SheetHeader className="border-edge border-b-2 p-4">
              <SheetTitle className="font-display text-xl text-ink">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col">
              {nav.links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <NavMobileLink href={link.href} label={link.label} onNavigate={() => setMobileOpen(false)} />
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href={`mailto:${email}`}
                  className="bg-accent-hot text-on-accent flex min-h-[48px] items-center px-4 font-mono text-sm tracking-[0.1em]"
                >
                  {nav.ctaLabel}
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </NavShell>
  )
}
```

Note: `ModeToggle` is kept as-is (existing dark-mode toggle component, not part of this redesign's scope) — it renders whatever sun/moon icon it already renders; the design's `Moon`/`Sun` imports above are only used if `ModeToggle`'s internals need restyling, which they don't for this task. If `ModeToggle`'s own button chrome looks inconsistent after this task (square vs. round, wrong border), that's a Task 5-primitives-adjacent follow-up, not blocking here — note it in the task's self-review rather than scope-creeping into `mode-toggle.tsx`.

- [ ] **Step 5: Remove the now-redundant `MobileNavbar` render in `app/(home)/layout-wrapper.tsx`**

Replace the file:

```tsx
'use client'

import React from 'react'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>
}
```

The unified `Navbar` (rendered inside `HomeComponent`, per Step 2) now covers both breakpoints, so `LayoutWrapper` no longer needs to render its own mobile nav. Confirm via `grep -rn "MobileNavbar" --include="*.tsx"` that nothing else imports it before deleting the export from `Navbar.tsx` — if another route imports `MobileNavbar` directly (unlikely, but verify), that route needs the same `Navbar` treatment applied here rather than being left on the deleted component.

- [ ] **Step 6: Search every other call site of the old `Navbar`/`MobileNavbar`**

Run: `grep -rn "from '@components/navigation/Navbar'\|from './navigation/Navbar'" --include="*.tsx" app components`
For every match other than `components/home.tsx` (already updated) and the deleted `layout-wrapper.tsx` import: update it to the new `Navbar` signature (`{ nav, email }`), fetching `site-settings` in that route the same way Step 1 does for the homepage, or passing it down from a shared layout if one already fetches it.

- [ ] **Step 7: Visual + keyboard check**

Run: `pnpm run dev`. Desktop (≥768px): confirm nav is opaque (no blur), links show a 4px accent underline for the active section, HIRE ME button and search/mode-toggle icons render. Resize to <768px: confirm the desktop row disappears and the hamburger button appears; open it, tab through the links with keyboard only, confirm `Escape` closes it (Radix `Sheet` gives this for free) and focus returns to the trigger button.

- [ ] **Step 8: Lint, type-check, commit**

Run: `pnpm run lint && pnpm exec tsc --noEmit`

```bash
git add components/navigation components/home.tsx "app/(home)/page.tsx" "app/(home)/layout-wrapper.tsx"
git commit -m "feat(design): unify Navbar (desktop+mobile), wire to site-settings.nav"
```

---

## Task 7: Footer wired to `site-settings`

**Files:**
- Modify: `components/Footer.tsx` (full rewrite)

**Interfaces:**
- Consumes: `SiteSetting` (whole object — reads `footer`, `nav.links`, `contact.socialLinks`).
- Produces: `Footer` now takes `{ siteSettings: SiteSetting }` (already passed from `components/home.tsx` in Task 6 Step 2).

- [ ] **Step 1: Rewrite `components/Footer.tsx`**

```tsx
import type { SiteSetting } from '@/payload-types'
import { Github, Linkedin } from 'lucide-react'
import { FaStackOverflow } from 'react-icons/fa'

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  stackoverflow: FaStackOverflow,
  other: Github,
} as const

export function Footer({ siteSettings }: { siteSettings: SiteSetting }) {
  const { footer, nav, contact } = siteSettings
  const year = new Date().getFullYear()

  return (
    <footer className="border-edge bg-ink border-t-2">
      <div className="border-b border-[color:var(--rule)] grid grid-cols-1 md:grid-cols-4">
        <div className="border-[color:var(--rule)] md:col-span-2 md:border-r px-7 py-8">
          <p className="label-mono text-accent-hot mb-2.5">AOLAUSORO.TECH</p>
          <p className="max-w-[420px] text-[15px] leading-[1.6] text-paper">{footer.bio}</p>
          <a
            href={`mailto:${contact.email}`}
            className="bg-accent-hot text-on-accent border-paper mt-4 inline-flex items-center gap-[9px] border-2 px-[17px] py-[13px] font-mono text-xs tracking-[0.1em]"
          >
            {footer.buttonLabel}
          </a>
        </div>

        <nav className="border-[color:var(--rule)] md:border-r px-6 py-8">
          <p className="label-mono mb-3.5 text-ink-3">PAGES</p>
          <div className="flex flex-col gap-[9px]">
            {nav.links.map((link) => (
              <Link key={link.href} href={link.href} className="font-mono text-[13px] text-paper hover:text-accent-hot">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-6 py-8">
          <p className="label-mono mb-3.5 text-ink-3">ELSEWHERE</p>
          <div className="flex flex-col gap-[9px]">
            {contact.socialLinks.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform]
              return (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[44px] items-center gap-[9px] font-mono text-[13px] text-paper hover:text-accent-hot"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {social.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-b border-[color:var(--rule)] overflow-hidden px-7">
        <p className="text-outline font-display text-[132px] leading-none tracking-[0.01em] whitespace-nowrap py-2">
          AOLAUSORO.TECH
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-7 py-3.5">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-3">
          © {year} ADEWOYIN OLADIPUPO-USORO
        </p>
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-3">{footer.colophon}</p>
      </div>
    </footer>
  )
}
```

Add the missing `Link` import: `import Link from 'next/link'` at the top.

This fixes the two bugs flagged in the design doc: the "John A." name mismatch (bio now comes from `site-settings.footer.bio`, seeded with the correct name) and the `hello@example.com` placeholder (now `site-settings.contact.email`, the real address, reused — not re-typed).

Note: `.text-outline` needs a dark-mode-safe color — the utility is defined against `var(--ink)`, and this footer sits on `bg-ink` (the dark ink color) even in light mode, so the outline would be invisible (ink-on-ink). Override locally: add `[--ink:var(--paper)]` to that paragraph's className so `.text-outline`'s `-webkit-text-stroke: 2px var(--ink)` resolves to the paper color instead — i.e. `className="text-outline [--ink:var(--paper)] font-display ..."`. Verify visually in Step 2 below; if the stroke still doesn't show, this is the first place to check.

- [ ] **Step 2: Visual check**

Run: `pnpm run dev`, scroll to the footer. Confirm: bio text is legible white-on-ink, the outlined "AOLAUSORO.TECH" wordmark is visible (not invisible ink-on-ink — see the note above), social links show icon + label and are individually tab-reachable, colophon line reads the real stack summary.

- [ ] **Step 3: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/Footer.tsx
git commit -m "feat(design): rebuild Footer as colophon, wire to site-settings, fix name/email bugs"
```

---

## Task 8: Hero A + delete the Matrix

**Files:**
- Modify: `components/hero.tsx` (full rewrite)
- Delete: `components/animations/` (entire directory: `code-animation.tsx`, `network-animations.tsx`, `code-cube-animation.tsx`, `matrix-rain-animation.tsx`, `index.ts`)
- Delete: `public/fonts/helvetiker_regular.typeface.json`
- Modify: `package.json` (remove `three`, `@types/three`)
- Modify: `components/home.tsx` (remove `MatrixRainAnimation` import/usage — verify it's already gone if Task 6 ran first)

**Interfaces:**
- Consumes: `SiteSetting['hero']`, `SiteSetting['ticker']`, `contact.location`, `contact.email`, `hero.statStatus`, `projectsTotalDocs: number` (all threaded from `components/home.tsx` in Task 6 Step 2 — if Task 6 has not run yet, add that prop-threading here instead).

- [ ] **Step 1: Rewrite `components/hero.tsx`**

```tsx
import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'

function splitOutlinedName(name: string) {
  const parts = name.trim().split(' ')
  const last = parts.pop() ?? ''
  return { rest: parts.join(' '), last }
}

export function Hero({
  cvDoc,
  hero,
  ticker,
  location,
  status,
  email,
  projectsTotalDocs,
}: {
  cvDoc: string
  hero: SiteSetting['hero']
  ticker: SiteSetting['ticker']
  location: string
  status: string
  email: string
  projectsTotalDocs: number
}) {
  const { rest, last } = splitOutlinedName(hero.name)
  const shippedLabel = `${projectsTotalDocs} LIVE PROJECT${projectsTotalDocs === 1 ? '' : 'S'}`

  return (
    <section id="hero" className="border-edge bg-paper relative overflow-hidden border-b-2">
      <div aria-hidden="true" className="grid-rules pointer-events-none absolute inset-0 grid grid-cols-12" />

      <div className="relative px-6 pt-14 md:px-10">
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <span className="bg-ink text-accent-hot font-mono text-[11px] tracking-[0.14em] px-[11px] py-2">
            {hero.eyebrow}
          </span>
          <span className="text-ink-2 font-mono text-[11px] tracking-[0.14em]">{hero.stackLine}</span>
        </div>

        <h1 className="font-display text-ink text-[62px] leading-[0.84] tracking-[0.004em] md:text-[158px] md:leading-[0.82]">
          {rest}
          <br />
          <span className="text-outline">{last}</span>
        </h1>

        <div className="border-edge mt-8 grid gap-10 border-t-2 pt-6 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-ink max-w-[560px] text-[17px] leading-[1.6] mb-5">{hero.lead}</p>

            <div className="border-edge bg-paper shadow-hard mb-5 max-w-[560px] border-2">
              <div className="bg-ink flex items-center gap-[9px] px-3 py-2.5">
                <span className="bg-accent-hot block h-[9px] w-[9px]" />
                <span className="text-paper font-mono text-[10px] tracking-[0.12em]">~/aolausoro.tech</span>
              </div>
              <div className="flex flex-col gap-[7px] px-3 py-3.5">
                {hero.terminalLines.map((line, i) => (
                  <p key={i} className="font-mono text-[13px] leading-[1.5]">
                    <span className="text-accent-text">$</span> {line.prompt}
                    <br />
                    <span className="text-ink">{line.output}</span>
                  </p>
                ))}
                <p className="font-mono text-[13px] leading-[1.5]">
                  <span className="text-accent-text">$</span> availability
                  <span className="bg-accent-hot animate-caret ml-1.5 inline-block h-[15px] w-2 align-[-2px]" />
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3.5">
              <a
                href="#work"
                className="bg-accent-hot text-on-accent border-edge shadow-hard hard-lift inline-flex items-center gap-2.5 border-2 px-[22px] py-4 font-mono text-[13px] tracking-[0.1em]"
              >
                {hero.primaryCtaLabel}
              </a>
              <a
                href={cvDoc}
                target="_blank"
                rel="noreferrer"
                className="bg-paper text-ink border-edge shadow-hard hard-lift inline-flex items-center gap-2.5 border-2 px-[22px] py-4 font-mono text-[13px] tracking-[0.1em]"
              >
                {hero.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <dl className="border-t border-[color:var(--rule)] flex flex-col">
            <div className="rule-y flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">BASED</dt>
              <dd className="font-mono text-xs text-ink">{location}</dd>
            </div>
            <div className="rule-y flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">STATUS</dt>
              <dd className="font-mono text-xs text-ink">{status}</dd>
            </div>
            <div className="rule-y flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">SHIPPED</dt>
              <dd className="font-mono text-xs text-ink">{shippedLabel}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">EMAIL</dt>
              <dd className="font-mono text-xs">
                <a href={`mailto:${email}`} className="border-accent-hot border-b-2 text-ink">
                  {email.split('@')[0]}@
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-edge bg-ink mt-9 overflow-hidden border-t-2">
        <div className="ticker flex w-max">
          {[0, 1].map((dup) => (
            <span key={dup} aria-hidden={dup === 1} className="flex whitespace-nowrap font-mono text-xs tracking-[0.16em] text-paper">
              {ticker.map((item, i) => (
                <span key={i} className="flex">
                  <span className="px-5 py-3.5">{item.message}</span>
                  <span className="text-accent-hot px-5 py-3.5">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

Note: this component was previously the client entry point rendering `<MatrixRainAnimation />` in a sibling tree (`components/home.tsx`) — that render call and import are removed here (see Step 5).

- [ ] **Step 2: Delete the animations directory**

```bash
rm -rf components/animations
```

- [ ] **Step 3: Delete the unused Three.js typeface asset**

```bash
rm -f public/fonts/helvetiker_regular.typeface.json
```

- [ ] **Step 4: Remove `three` and `@types/three` from `package.json`**

Run:
```bash
pnpm remove three @types/three
```

- [ ] **Step 5: Confirm `components/home.tsx` no longer imports the deleted animation module**

If Task 6 has already run, this is already done (Step 2 of Task 6 rewrote `components/home.tsx` without the `MatrixRainAnimation` import). If Task 6 has not yet run, edit `components/home.tsx` now: remove `import { MatrixRainAnimation } from '@components/animations'` and the `<MatrixRainAnimation />` JSX call, and thread the new `Hero` props (`hero`, `ticker`, `location`, `status`, `email`, `projectsTotalDocs`) from a `siteSettings: SiteSetting` prop the same way Task 6 Step 2 does — do this only if Task 6 hasn't landed yet, otherwise skip (already handled).

- [ ] **Step 6: Verify the deleted module has no remaining references**

Run: `grep -rn "components/animations\|from 'three'\|helvetiker" --include="*.ts" --include="*.tsx" app components`
Expected: no matches.

- [ ] **Step 7: Build check**

Run: `pnpm run build`
Expected: succeeds, and the bundle no longer pulls in `three` (spot-check with `pnpm run build` output size, or `du -sh .next` before/after if you want a concrete before/after number — not required to pass this step, just confirm the build succeeds).

- [ ] **Step 8: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/hero.tsx components/home.tsx package.json pnpm-lock.yaml
git add -u components/animations public/fonts/helvetiker_regular.typeface.json
git commit -m "feat(design): rebuild Hero A, delete Matrix/three.js animation stack"
```

---

## Task 9: Project cards — asymmetric grid + keyboard a11y fix

**Files:**
- Modify: `components/portfolio-component.tsx`
- Modify: `components/portfolio-card.tsx`

**Interfaces:**
- Consumes: `SiteSetting['sectionHeadings']['work']` (passed from Task 6 Step 2's `<PortfolioComponent projects={projects} heading={siteSettings.sectionHeadings.work} />`).
- Produces: `PortfolioCard` becomes keyboard-reachable (`role="button" tabindex="0"`, `onKeyDown` for Enter/Space, real `focus-visible` outline) — this is the fix the design doc flags in §1f.

- [ ] **Step 1: Rewrite `components/portfolio-component.tsx`**

```tsx
'use client'
import { useState } from 'react'

import PortfolioCard from '@components/portfolio-card'
import type { Project, SiteSetting } from '@/payload-types'
import ProjectModal from './project-modal'

export function PortfolioComponent({
  projects,
  heading,
}: {
  projects: Project[]
  heading: SiteSetting['sectionHeadings']['work']
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const publishedProjects = projects?.filter((doc) => doc.published)
  const [lead, ...rest] = publishedProjects
  const sideProjects = rest.slice(0, 2)

  return (
    <>
      <section id="work" className="border-edge bg-paper border-t-2 px-6 py-11 md:px-9">
        <div className="border-edge mb-7 flex flex-wrap items-end justify-between gap-5 border-b-2 pb-4.5">
          <div>
            <p className="label-mono text-ink-2 mb-1.5">{heading.eyebrow}</p>
            <h2 className="font-display text-ink text-[40px] leading-[0.9] md:text-[60px]">{heading.heading}</h2>
          </div>
          <p className="text-ink-2 max-w-[300px] text-[13px] leading-[1.6]">{heading.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {lead && (
            <div className="md:col-span-7">
              <PortfolioCard project={lead} index={1} lead onSelect={setSelectedProject} />
            </div>
          )}
          <div className="flex flex-col gap-6 md:col-span-5">
            {sideProjects.map((project, i) => (
              <PortfolioCard key={project.id} project={project} index={i + 2} onSelect={setSelectedProject} />
            ))}
          </div>
        </div>
      </section>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  )
}
```

Note: `ProjectModal`'s props change here to `{ project, onClose }` (taking the whole `Project` doc rather than a spread of primitives) — that's Task 10's change; if Task 10 hasn't run yet, keep the current prop-spreading call in place instead of the one-liner above and revisit this file's modal-invocation line when Task 10 lands.

- [ ] **Step 2: Rewrite `components/portfolio-card.tsx`**

```tsx
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import type { Media, Project } from '@/payload-types'

function PortfolioCard({
  project,
  index,
  lead = false,
  onSelect,
}: {
  project: Project
  index: number
  lead?: boolean
  onSelect: (project: Project) => void
}) {
  const screenshotUrl =
    typeof project.screenshot === 'object' ? (project.screenshot as Media).url : undefined

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project)
        }
      }}
      className="border-edge bg-paper shadow-hard hard-lift flex cursor-pointer flex-col border-2"
    >
      <div className="border-edge flex items-center justify-between gap-3 border-b-2 px-3.5 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink">
          {String(index).padStart(2, '0')}
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
          {new Date(project.createdAt).getFullYear()} · SOLO BUILD
        </span>
      </div>

      {screenshotUrl && (
        <div className={`border-edge relative border-b-2 bg-[--tag-platform] ${lead ? 'h-[300px]' : 'h-[150px]'}`}>
          <Image
            src={screenshotUrl}
            alt={project.title as string}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3.5 px-4.5 py-5">
        <h3 className={`font-display text-ink ${lead ? 'text-[40px] leading-[0.95]' : 'text-[32px] leading-[0.95]'}`}>
          {project.title}
        </h3>
        <p className="text-ink-2 text-[15px] leading-[1.65]">{project.description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {project.techStack?.map((tech, idx) => (
            <span key={idx} className="chip bg-tag-framework">
              {tech.technology}
            </span>
          ))}
        </div>
      </div>

      <div className="border-edge flex border-t-2">
        {project.address && (
          <a
            href={project.address}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="border-edge hover:bg-accent-hot hover:text-on-accent flex flex-1 items-center justify-center gap-2.5 border-r-2 py-4 font-mono text-xs tracking-[0.1em] text-ink"
          >
            LIVE SITE
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:bg-accent-hot hover:text-on-accent flex flex-1 items-center justify-center gap-2.5 py-4 font-mono text-xs tracking-[0.1em] text-ink"
          >
            SOURCE
            <Github className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

export default PortfolioCard
```

Note: the `role="button" tabindex="0"` div plus its own nested real `<a>` links (LIVE SITE / SOURCE) means a keyboard user tabs into the card wrapper first (Enter/Space opens the modal), then tabs again into each link — this matches the design doc's explicit annotation ("nested Live site/Source links stay real anchors with stopPropagation"). Verify in Step 3 that this tab order is sane (card → live site → source → next card), not reversed or skipped.

- [ ] **Step 3: Keyboard + visual check**

Run: `pnpm run dev`, go to `/#work`. Tab through the section with keyboard only: confirm each card receives a visible focus outline, Enter/Space opens the modal (stub is fine here — Task 10 replaces the modal itself), and the LIVE SITE/SOURCE links inside a card are separately tabbable without triggering the card's own click handler (click one and confirm it navigates rather than opening the modal).

- [ ] **Step 4: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/portfolio-component.tsx components/portfolio-card.tsx
git commit -m "feat(design): asymmetric project grid, fix keyboard-inaccessible cards"
```

---

## Task 10: Project modal on Radix Dialog

**Files:**
- Modify: `components/project-modal.tsx` (full rewrite, built on `components/ui/dialog.tsx`)
- Modify: `components/portfolio-component.tsx` (update the modal invocation to the new prop shape — see Task 9 Step 1's note)

**Interfaces:**
- Consumes: `components/ui/dialog.tsx`'s existing exports (`Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle` — already installed, currently unused anywhere in the repo), `Project` type from Task 3 (`longDescription`, `appImages`).
- Produces: `ProjectModal` now takes `{ project: Project; onClose: () => void }` instead of the current spread-of-primitives props.

- [ ] **Step 1: Rewrite `components/project-modal.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from '@components/ui/dialog'
import type { Media, Project } from '@/payload-types'
import { RichText } from '@/components/RichText'

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeImage, setActiveImage] = useState(0)

  const gallery = (project.appImages ?? [])
    .map((entry) => (typeof entry.image === 'object' ? (entry.image as Media) : null))
    .filter((m): m is Media => m !== null)

  const fallbackShot = typeof project.screenshot === 'object' ? (project.screenshot as Media) : null
  const images = gallery.length > 0 ? gallery : fallbackShot ? [fallbackShot] : []
  const activeShot = images[activeImage]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-ink/86" />
        <DialogContent
          className="border-edge shadow-hard-accent grid w-full max-w-[940px] translate-x-[-50%] translate-y-[-50%] gap-0 border-2 bg-paper p-0 md:grid-cols-[1.5fr_1fr]"
        >
          <DialogTitle className="sr-only">{project.title}</DialogTitle>

          <div className="border-edge col-span-full flex items-stretch border-b-2">
            <div className="flex-1 px-5 py-4">
              <p className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
                PROJECT · {new Date(project.createdAt).getFullYear()}
              </p>
              <h2 className="font-display text-ink text-[40px] leading-[0.95]">{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="border-edge hover:bg-ink hover:text-accent-hot flex w-[62px] flex-none items-center justify-center border-l-2 text-ink"
            >
              <X className="h-[22px] w-[22px]" />
            </button>
          </div>

          <div className="border-[color:var(--rule)] md:border-r">
            {activeShot?.url && (
              <div className="h-[340px] bg-[--tag-platform]">
                {/* eslint-disable-next-line @next/next/no-img-element -- variable aspect gallery image inside a fixed-height frame */}
                <img src={activeShot.url} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {images.length > 1 && (
              <div className="border-[color:var(--rule)] flex border-b">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`h-[72px] flex-1 border-r border-[color:var(--rule)] bg-[--tag-platform] font-mono text-[10px] text-ink-2 last:border-r-0 ${
                      i === activeImage ? 'outline-accent-hot -outline-offset-3 outline outline-3' : ''
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            )}
            <div className="p-5">
              <p className="label-mono mb-2.5 text-ink">THE BUILD</p>
              {project.longDescription ? (
                <RichText data={project.longDescription} className="text-[15px] leading-[1.7] text-ink" />
              ) : (
                <p className="text-[15px] leading-[1.7] text-ink-2">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <dl className="border-b border-[color:var(--rule)]">
              <div className="flex justify-between gap-2.5 border-b border-[color:var(--rule)] px-4.5 py-3">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-ink-3">YEAR</dt>
                <dd className="font-mono text-xs text-ink">{new Date(project.createdAt).getFullYear()}</dd>
              </div>
              <div className="flex justify-between gap-2.5 px-4.5 py-3">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-ink-3">STATUS</dt>
                <dd className="font-mono text-xs text-accent-text">
                  {project.published ? 'IN PRODUCTION' : 'IN PROGRESS'}
                </dd>
              </div>
            </dl>
            <div className="border-b border-[color:var(--rule)] p-4.5">
              <p className="label-mono mb-2.5 text-ink">STACK</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech, idx) => (
                  <span key={idx} className="chip bg-tag-framework">
                    {tech.technology}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-auto flex flex-col">
              {project.address && (
                <a
                  href={project.address}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-accent-hot text-on-accent border-edge flex items-center justify-between border-t-2 p-4.5 font-mono text-xs tracking-[0.1em]"
                >
                  VISIT LIVE SITE
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:bg-ink hover:text-accent-hot border-edge flex items-center justify-between border-t-2 p-4.5 font-mono text-xs tracking-[0.1em] text-ink"
                >
                  READ THE SOURCE
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
```

`project.techStack` is passed through as `{ technology: string }[]` directly (no cast), fixing the `as string[]` cast the design doc flags. Confirm `@/components/RichText` exists and exports a component taking `{ data, className }` (this repo's Posts already render Lexical richText somewhere — check `heros/PostHero`'s sibling content-rendering code or `app/(home)/posts/[slug]/page.tsx` for the exact import path and prop names before using it here; adjust the import/props to match exactly).

- [ ] **Step 2: Update the modal invocation in `components/portfolio-component.tsx`**

Confirm (or apply now if Task 9 used the placeholder note) that the modal call is:

```tsx
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
```

- [ ] **Step 3: Keyboard + focus behavior check**

Run: `pnpm run dev`, open a project card via Enter, confirm: focus moves into the dialog automatically, `Tab` cycles only within the dialog (focus trap), `Escape` closes it and focus returns to the card that opened it, clicking the overlay closes it. All six should work with zero custom code — they come from Radix `Dialog` — if any doesn't, something in the `DialogContent`/`DialogOverlay` className overrides broke a Radix data attribute; check for a stray `pointer-events-none` or missing `DialogPortal`.

- [ ] **Step 4: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/project-modal.tsx components/portfolio-component.tsx
git commit -m "feat(design): rebuild project modal on Radix Dialog, fix techStack cast"
```

---

## Task 11: Stack table wired to `stack-groups`

**Files:**
- Modify: `components/skills.tsx` (full rewrite)
- Modify: `app/(home)/page.tsx` (fetch `stack-groups` collection)
- Modify: `components/home.tsx` (thread `stackGroups` prop to `Skills`)

**Interfaces:**
- Consumes: `StackGroup[]` from Task 2, `SiteSetting['sectionHeadings']['stack']`.

- [ ] **Step 1: Fetch `stack-groups` in `app/(home)/page.tsx`**

Add to the `Promise.all`:

```ts
    payload.find({ collection: 'stack-groups', sort: 'createdAt', depth: 0, overrideAccess: false }),
```

Destructure the result as `stackGroups` and pass `stackGroups={stackGroups.docs}` to `HomeComponent`.

- [ ] **Step 2: Thread `stackGroups` through `components/home.tsx`**

Add `stackGroups: StackGroup[]` to the props type and pass `<Skills heading={siteSettings.sectionHeadings.stack} groups={stackGroups} />`.

- [ ] **Step 3: Rewrite `components/skills.tsx`**

```tsx
import type { SiteSetting, StackGroup } from '@/payload-types'

const DEVICON_LOGOS = [
  { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg' },
  { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg' },
  { name: 'GraphQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain-wordmark.svg' },
  { name: 'Redis', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original-wordmark.svg' },
  { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
]

export function Skills({
  heading,
  groups,
}: {
  heading: SiteSetting['sectionHeadings']['stack']
  groups: StackGroup[]
}) {
  return (
    <section id="stack" className="border-edge bg-ink px-6 py-11 md:px-9">
      <div className="border-edge mb-0 flex flex-wrap items-end justify-between gap-5 border-b-2 pb-4.5">
        <div>
          <p className="label-mono text-accent-hot mb-1.5">{heading.eyebrow}</p>
          <h2 className="font-display text-paper text-[40px] leading-[0.9] md:text-[60px]">{heading.heading}</h2>
        </div>
        <p className="text-ink-2 max-w-[300px] text-[13px] leading-[1.6]">{heading.description}</p>
      </div>

      {groups.map((group, i) => (
        <div key={group.id} className="border-[color:var(--rule)] grid grid-cols-1 border-b md:grid-cols-[180px_1fr]">
          <div className="border-[color:var(--rule)] py-5 md:border-r">
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-3">{String(i + 1).padStart(2, '0')}</p>
            <p className="font-display text-paper text-[28px] leading-none">{group.label}</p>
          </div>
          <div className="flex flex-wrap content-center gap-2 py-5 md:pl-6">
            {group.items.map((item, idx) => (
              <span
                key={idx}
                className={
                  item.filled
                    ? 'bg-accent-hot text-on-accent font-mono text-[11px] tracking-[0.06em] px-2.5 py-2 font-semibold'
                    : 'text-ink-2 font-mono text-[11px] tracking-[0.06em] border border-ink-2 px-2.5 py-2'
                }
              >
                {item.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="border-[color:var(--rule)] mt-6.5 flex items-center overflow-hidden border">
        {DEVICON_LOGOS.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element -- decorative third-party SVG icon strip, not a Next-optimizable local asset
          <img
            key={logo.name}
            src={logo.url}
            alt={logo.name}
            className="border-[color:var(--rule)] h-[42px] border-r px-5 py-3.5 opacity-80 grayscale brightness-[1.7] last:border-r-0"
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Visual check**

Run: `pnpm run dev`, go to `/#stack`. Confirm: dark section (deliberate rhythm-break against the paper sections around it), 4 rows with numbered labels, filled vs. outlined chips visibly distinct, devicon strip desaturated.

- [ ] **Step 5: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/skills.tsx "app/(home)/page.tsx" components/home.tsx
git commit -m "feat(design): stack table as spec sheet, wired to stack-groups collection"
```

---

## Task 12: CTA band wired to `site-settings`

**Files:**
- Modify: `components/cta.tsx` (full rewrite)
- Modify: `components/home.tsx` (already threading `cta`/`email` per Task 6 Step 2 — verify)

**Interfaces:**
- Consumes: `SiteSetting['cta']`, `contact.email`.

- [ ] **Step 1: Rewrite `components/cta.tsx`**

```tsx
import type { SiteSetting } from '@/payload-types'

export default function CTA({ cta, email }: { cta: SiteSetting['cta']; email: string }) {
  return (
    <section className="border-edge bg-accent-hot border-t-2 border-b-2">
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        <div className="border-edge px-6 py-11 md:border-r-2 md:px-10">
          <p className="font-mono text-[11px] tracking-[0.14em] text-on-accent mb-3.5">{cta.eyebrow}</p>
          <h2 className="font-display text-ink text-[52px] leading-[0.86] md:text-[96px]">{cta.heading}</h2>
          <p className="text-ink mt-4.5 max-w-[560px] text-[17px] leading-[1.6]">{cta.body}</p>
        </div>
        <div className="flex flex-col">
          <a
            href={`mailto:${email}`}
            className="bg-ink text-paper border-edge flex flex-1 flex-col justify-center gap-2 border-b-2 px-6.5 py-7 hover:bg-[--on-accent]"
          >
            <span className="text-accent-hot font-mono text-[11px] tracking-[0.14em]">EMAIL ME</span>
            <span className="font-mono text-[15px]">{email}</span>
          </a>
          <a
            href="/contact"
            className="text-on-accent border-edge flex flex-1 flex-col justify-center gap-2 border-b-2 px-6.5 py-7 hover:bg-ink hover:text-accent-hot"
          >
            <span className="font-mono text-[11px] tracking-[0.14em]">OR USE THE FORM</span>
            <span className="font-mono text-[15px]">/contact →</span>
          </a>
          <a
            href="/cv"
            className="text-on-accent flex flex-1 flex-col justify-center gap-2 px-6.5 py-7 hover:bg-ink hover:text-accent-hot"
          >
            <span className="font-mono text-[11px] tracking-[0.14em]">DOWNLOAD</span>
            <span className="font-mono text-[15px]">CV.PDF →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
```

Note: `/cv` as a direct download route may not exist in this repo (the CV is served via the `cvs` collection's media URL, already used as `cvDoc` in Task 8's Hero). Before wiring this exact href, `grep -rn "cvDoc\|cv\.url" app components` to find how the rest of the site already links to the CV file, and use that same URL source here instead of a bare `/cv` route — pass a `cvUrl` prop into `CTA` alongside `cta`/`email` (threaded the same way `cvDoc` reaches `Hero` in Task 8) rather than hardcoding a path that may 404.

- [ ] **Step 2: Thread `cvUrl` into `CTA`'s call site in `components/home.tsx`**

```tsx
      <CTA cta={siteSettings.cta} email={siteSettings.contact.email} cvUrl={cvUrl} />
```

And update the `CTA` signature to accept it: `{ cta, email, cvUrl }: { cta: SiteSetting['cta']; email: string; cvUrl?: string }`, using `href={cvUrl ?? '#'}` on the download link.

- [ ] **Step 3: Visual check**

Run: `pnpm run dev`, scroll to the CTA band. Confirm: full-bleed teal background, three stacked link rows, real email (not `hello@example.com`) and real CV link (not `calendly.com`).

- [ ] **Step 4: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/cta.tsx components/home.tsx
git commit -m "feat(design): rebuild CTA band, replace calendly/hello@example.com placeholders"
```

---

## Task 13: Blog listing — rows instead of cards

**Files:**
- Modify: `components/CollectionArchive/index.tsx` (full rewrite)
- Modify: `app/(home)/posts/page.tsx`, `app/(home)/posts/page/[pageNumber]/page.tsx` (pass `siteSettings.sectionHeadings.writing` heading through)

**Interfaces:**
- Produces: `CollectionArchive`'s `Props` changes from `{ posts: CardPostData[] }` to `{ posts: (CardPostData & Pick<Post, 'publishedAt'>)[] }` — `CardPostData` (`Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>`, defined in `components/Card/index.tsx`) has no `publishedAt`, but the row layout needs a date, so the prop type is widened here rather than widening `CardPostData` itself (which `Card` also uses, unrelated to this task). Every caller must select `publishedAt` in its Payload query (Step 3).
- Consumes: `post.meta?.description` for the excerpt line (confirmed in `components/Card/index.tsx:27` — there is no separate excerpt field, `Card` reads the same `meta.description` and strips embedded non-breaking spaces with `.replace(/\s/g, ' ')`; this task's row does the same).

- [ ] **Step 1: Rewrite `components/CollectionArchive/index.tsx`**

```tsx
import { cn } from '@lib/utils'
import Link from 'next/link'
import React from 'react'

import type { CardPostData } from '@components/Card'
import type { Post } from '@payload-types/'

export type Props = {
  posts: (CardPostData & Pick<Post, 'publishedAt'>)[]
}

export const CollectionArchive: React.FC<Props> = ({ posts }) => {
  return (
    <div className={cn('border-edge border-2 bg-paper')}>
      {posts.map((post, index) => {
        if (typeof post !== 'object' || post === null) return null
        const category =
          post.categories && post.categories.length > 0 && typeof post.categories[0] === 'object'
            ? post.categories[0].title
            : null
        const excerpt = post.meta?.description?.replace(/\s/g, ' ')

        return (
          <Link
            key={post.slug ?? index}
            href={`/posts/${post.slug}`}
            className="border-[color:var(--rule)] hover:bg-[--tag-platform] grid grid-cols-1 items-baseline gap-3 border-b px-1.5 py-5.5 last:border-b-0 md:grid-cols-[150px_1fr_130px] md:gap-5"
          >
            <span className="font-mono text-xs text-ink-3">
              {post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : ''}
            </span>
            <span>
              <span className="font-display text-ink mb-1.5 block text-[28px] leading-none md:text-[34px]">
                {post.title}
              </span>
              {excerpt && (
                <span className="text-ink-2 block max-w-[640px] text-sm leading-[1.6]">{excerpt}</span>
              )}
            </span>
            {category && (
              <span className="flex justify-self-start md:justify-self-end">
                <span className="chip bg-tag-framework">{category}</span>
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Add `publishedAt` to the `select` in `app/(home)/posts/page.tsx`, fetch `site-settings`, fix the leftover template title**

This file currently uses `select: { title, slug, categories, meta }` (no `publishedAt`) and `generateMetadata` returns the literal leftover string `` `Payload Website Template Posts` `` — the exact default-title bug the spec's rollout order calls out. Fix both:

```tsx
import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const [posts, siteSettings] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        publishedAt: true,
      },
    }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false }),
  ])

  const { writing } = siteSettings.sectionHeadings

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <p className="label-mono text-ink-2 mb-1.5">{writing.eyebrow}</p>
        <h1 className="font-display text-ink text-[40px] leading-[0.9] md:text-[60px]">
          {writing.heading}
        </h1>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Writing | aolausoro.tech`,
  }
}
```

- [ ] **Step 3: Mirror the same two fixes in `app/(home)/posts/page/[pageNumber]/page.tsx`**

This file fetches full `Post` docs (no `select` block), so `publishedAt` is already present on each doc — no query change needed there. It does need: the same `site-settings` fetch + heading swap as Step 2 (replace whatever static `<h1>` it currently renders with the `writing.eyebrow`/`writing.heading` block), and its `generateMetadata` currently returns the literal string `` `Payload Website Template Posts Page ${pageNumber || ''}` `` (confirmed at `app/(home)/posts/page/[pageNumber]/page.tsx:68`) — replace with `` `Writing — Page ${pageNumber} | aolausoro.tech` ``.

- [ ] **Step 4: Visual check**

Run: `pnpm run dev`, visit `/posts`. Confirm: date/title/category rows instead of a card grid, hover wash on each row, pagination still functions.

- [ ] **Step 5: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add components/CollectionArchive "app/(home)/posts"
git commit -m "feat(design): blog listing as rows, wire heading to site-settings"
```

---

## Task 14: Blog post — type-only header, kill the image-hero contrast bug

**Files:**
- Modify: `heros/PostHero/index.tsx` (full rewrite)
- Modify: `app/(home)/posts/[slug]/page.tsx` (adjust layout wrapper if it assumes the old hero's negative-margin overlap; remove now-dead `setHeaderTheme('light')` call)
- Modify or delete: `app/(home)/posts/[slug]/page.client.tsx`

**Interfaces:**
- Produces: `PostHero` keeps its `{ post: Post }` prop — internal rendering changes from an image-behind-text hero to type-only.

- [ ] **Step 1: Rewrite `heros/PostHero/index.tsx`**

```tsx
import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="border-edge border-b-2 bg-paper px-6 py-11 md:px-9">
      <div className="mb-4.5 flex flex-wrap items-center gap-2.5">
        {categories?.map((category, index) => {
          if (typeof category !== 'object' || category === null) return null
          return (
            <span key={index} className="chip bg-tag-framework">
              {category.title ?? 'Untitled category'}
            </span>
          )
        })}
        <span className="font-mono text-xs text-ink-2">
          {publishedAt ? formatDateTime(publishedAt) : ''}
          {hasAuthors ? ` · ${formatAuthors(populatedAuthors)}` : ''}
        </span>
      </div>
      <h1 className="font-display text-ink max-w-[900px] text-[52px] leading-[0.88] md:text-[84px]">
        {title}
      </h1>
    </div>
  )
}
```

The `heroImage` field and its `<Media fill priority .../>` render, plus the `text-white`-over-`min-h-[80vh]` gradient overlay, are removed entirely — this is the fix the design doc flags (uncontrolled contrast against an arbitrary CMS upload). If a post has a hero image, it now needs to render inline below the intro instead — that placement lives in `app/(home)/posts/[slug]/page.tsx`, not in this component; see Step 2.

- [ ] **Step 2: Move the hero image inline in `app/(home)/posts/[slug]/page.tsx`**

Read the current file to find where `RichTextContent`/`post.content` is rendered below `<PostHero post={post} />`, and where `post.heroImage` is currently read (it was previously only consumed inside `PostHero`). Insert the image, if present, directly above the rendered content:

```tsx
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="border-edge mx-auto mb-8 max-w-[680px] border-2">
            <Media resource={post.heroImage} />
          </div>
        )}
```

(`Media` is `@/components/Media`, already imported by the old `PostHero` — import it here instead.)

Also remove the now-dead call site: this page currently imports and renders `PageClient` (`./page.client.tsx`), which exists solely to call `setHeaderTheme('light')` "while we have an image behind it" — a comment that is no longer true once the hero is type-only. Delete the `<PageClient />` render from `page.tsx` and delete `app/(home)/posts/[slug]/page.client.tsx`. Before deleting, run `grep -rn "useHeaderTheme\|HeaderTheme" --include="*.tsx" app components providers` — if `HeaderTheme` is used elsewhere (e.g. by the nav to decide light/dark chrome on other image-hero pages), keep the provider itself and only remove this one call site; if this was its only consumer, the provider (`providers/HeaderTheme`) becomes dead code too and is worth flagging to the user as a further cleanup candidate rather than deleting unilaterally in this task (out of this task's stated scope).

- [ ] **Step 3: Add the TOC rail and retune measure**

In the same page file, wrap the existing prose/content render in the two-column layout (mono TOC rail + 680px measure) matching design §1l — the exact TOC entries are derived from the post's own `h2`s, which this repo does not currently auto-extract. Do **not** hand-write fake TOC links: if there is no existing heading-extraction utility in this repo (check `utilities/` for one before assuming), skip the TOC rail for this task and note it as a follow-up rather than fabricating static anchor text that won't match the actual rendered headings. Apply only the layout/measure change:

```tsx
        <div className="mx-auto max-w-[680px] px-6 py-9">
          {/* existing RichText/content render stays here, unchanged */}
        </div>
```

- [ ] **Step 4: Visual check**

Run: `pnpm run dev`, open any post. Confirm: header is type-only (no image-behind-text), contrast is obviously fine in both themes, code blocks still render with the existing `highlight.js github-dark` theme (untouched by this task).

- [ ] **Step 5: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add heros/PostHero "app/(home)/posts/[slug]"
git commit -m "feat(design): type-only PostHero, remove uncontrolled-contrast image overlay"
```

---

## Task 15: Search — fix router.push bug, wire in Projects, redesign

**Files:**
- Modify: `search/Component.tsx` (full rewrite)
- Modify: `app/(home)/search/page.tsx`
- Modify: `plugins/index.ts` (add `'projects'` to `searchPlugin({ collections: [...] })`, add a `skipSync` guard)

**Interfaces:**
- Produces: search now indexes both `posts` and `projects`; results are typed via the search plugin's own `doc.relationTo` field (`'posts' | 'projects'`).

- [ ] **Step 1: Extend the search plugin to index Projects**

In `plugins/index.ts`, change:

```ts
  searchPlugin({
    collections: ['posts'],
```

to:

```ts
  searchPlugin({
    collections: ['posts', 'projects'],
    skipSync: ({ collectionSlug, doc }) => {
      // Projects has no _status/draft concept (unlike Posts) — it uses a
      // plain `published` checkbox instead. Without this guard, unpublished
      // projects would still be indexed and show up in site search.
      if (collectionSlug === 'projects') return doc?.published !== true
      return false
    },
```

- [ ] **Step 2: Update the search query in `app/(home)/search/page.tsx`**

Add `doc` to the `select` block so the component can read `doc.relationTo`:

```ts
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      doc: true,
    },
```

- [ ] **Step 3: Rewrite `search/Component.tsx` — fix the router.push bug**

```tsx
'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search as SearchIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'

export const Search: React.FC = () => {
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const nextQuery = debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''
    const currentQuery = searchParams.get('q') ? `?q=${searchParams.get('q')}` : ''
    if (nextQuery === currentQuery) return
    router.replace(`/search${nextQuery}`)
  }, [debouncedValue, router, searchParams])

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="shadow-hard border-edge mb-3.5 flex border-2"
    >
      <span className="border-edge flex items-center border-r-2 px-4 text-ink">
        <SearchIcon className="h-[19px] w-[19px]" />
      </span>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        id="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search"
        className="h-auto flex-1 border-0 px-4 py-4.5 font-mono text-lg"
      />
      <button
        type="submit"
        className="bg-accent-hot text-on-accent border-edge border-l-2 px-6 font-mono text-xs tracking-[0.12em]"
      >
        SEARCH
      </button>
    </form>
  )
}
```

This fixes the flagged bug: `router.push` → `router.replace` (no more one-history-entry-per-keystroke), and the effect now bails out (`return`, no navigation call) when the computed query string matches what's already in the URL, instead of firing unconditionally on every debounce tick.

- [ ] **Step 4: Redesign the results list in `app/(home)/search/page.tsx`**

Read the current file's rendering below the `CollectionArchive` call (it likely passes `posts.docs` straight through). Since results can now be `posts` or `projects`, and `CollectionArchive` (Task 13) is posts-shaped, render typed rows directly in this page instead of reusing `CollectionArchive` for mixed-type results:

```tsx
        <p className="mb-6.5 font-mono text-xs text-ink-2">
          {posts.totalDocs} RESULT{posts.totalDocs === 1 ? '' : 'S'} FOR &ldquo;{query?.toUpperCase()}&rdquo;
        </p>
        {posts.docs.map((result) => {
          const isProject = result.doc?.relationTo === 'projects'
          return (
            <a
              key={result.id}
              href={isProject ? `/#work` : `/posts/${result.slug}`}
              className="border-[color:var(--rule)] hover:bg-[--tag-platform] grid grid-cols-1 items-baseline gap-3 border-t px-1.5 py-5 md:grid-cols-[110px_1fr_120px]"
            >
              <span className="border-edge justify-self-start border px-2 py-1.5 font-mono text-[11px] tracking-[0.1em] text-ink">
                {isProject ? 'PROJECT' : 'POST'}
              </span>
              <span className="font-display text-ink text-[26px] leading-none md:text-[30px]">
                {result.title}
              </span>
            </a>
          )
        })}
        {posts.docs.length === 0 && (
          <div className="border-edge/30 mt-7 border-2 border-dashed p-6.5 text-center">
            <p className="font-display text-ink text-[32px] leading-none">Nothing for that</p>
            <p className="text-ink-2 mt-1.5 mb-4 text-sm">
              No results — try a different term.
            </p>
          </div>
        )}
```

Do not hardcode the `<mark>`-highlighted-match or suggested-query-chip pieces from the design mockup unless the current query pipeline actually returns match-position data — it doesn't (it's a `like` filter, not a highlighter). Render plain titles; highlighting the match substring client-side (wrapping the query string wherever it occurs in `result.title`) is a reasonable small addition if you want visual parity with the mockup, but it is not required by the spec's bug-fix scope — note this as an optional follow-up if skipped.

- [ ] **Step 4b: Fix the same leftover template title on this page**

`app/(home)/search/page.tsx`'s `generateMetadata` currently returns the literal string `` `Payload Website Template Search` `` (confirmed at `app/(home)/search/page.tsx:86`). Replace with `` `Search | aolausoro.tech` ``.

- [ ] **Step 5: Verify back-button behavior**

Run: `pnpm run dev`, go to `/search`, type a query, wait for it to settle, then press the browser back button. Expected: it returns to wherever you were before `/search`, not through a dozen intermediate `/search?q=...` history entries (the bug being fixed).

- [ ] **Step 6: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add search "app/(home)/search" plugins/index.ts
git commit -m "fix(search): router.replace instead of router.push, index projects, redesign results"
```

---

## Task 16: Contact page — two-panel redesign

**Files:**
- Modify: `app/(home)/contact/page.tsx` (full rewrite)
- Modify: `components/contact-form.tsx` (field skin only — schema/wiring unchanged per the design doc's explicit note)

**Interfaces:**
- Consumes: `SiteSetting['contact']`, `SiteSetting['sectionHeadings']['contactPage']`. Keeps `useContactController`/`contactSchema`/`react-hook-form`/Zod exactly as-is (`hooks/use-contact-controller.tsx` is not modified by this task).

- [ ] **Step 1: Fetch `site-settings` in `app/(home)/contact/page.tsx` and rewrite the layout**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { Github, Linkedin } from 'lucide-react'
import { FaStackOverflow } from 'react-icons/fa'

import ContactForm from '@components/contact-form'

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  stackoverflow: FaStackOverflow,
  other: Github,
} as const

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const { contact, sectionHeadings } = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: false,
  })
  const { contactPage } = sectionHeadings

  return (
    <section className="border-edge grid grid-cols-1 border-2 md:grid-cols-[1fr_1.3fr]">
      <div className="border-edge bg-[--tag-platform] border-b-2 px-8 py-11 md:border-r-2 md:border-b-0">
        <p className="label-mono text-ink-2 mb-2.5">{contactPage.eyebrow}</p>
        <h1 className="font-display text-ink mb-4 text-[52px] leading-[0.88] md:text-[68px]">
          {contactPage.heading}
        </h1>
        <p className="text-ink-2 mb-6.5 text-[15px] leading-[1.7]">{contactPage.body}</p>

        <dl className="border-t border-[color:var(--ink)]/22">
          <div className="border-b border-[color:var(--ink)]/22 py-3.5">
            <dt className="text-ink-3 mb-1 font-mono text-[11px] tracking-[0.1em]">EMAIL</dt>
            <dd>
              <a href={`mailto:${contact.email}`} className="border-accent-hot text-ink border-b-2 font-mono text-sm">
                {contact.email}
              </a>
            </dd>
          </div>
          <div className="border-b border-[color:var(--ink)]/22 py-3.5">
            <dt className="text-ink-3 mb-1 font-mono text-[11px] tracking-[0.1em]">BASED</dt>
            <dd className="font-mono text-sm text-ink">{contact.location}</dd>
          </div>
          <div className="py-3.5">
            <dt className="text-ink-3 mb-1 font-mono text-[11px] tracking-[0.1em]">RESPONSE</dt>
            <dd className="font-mono text-sm text-accent-text">{contact.responsePromise}</dd>
          </div>
        </dl>

        <div className="border-edge mt-5.5 flex border">
          {contact.socialLinks.map((social) => {
            const Icon = SOCIAL_ICONS[social.platform]
            return (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="border-edge hover:bg-accent-hot hover:text-on-accent flex flex-1 items-center justify-center border-r p-3.5 text-ink last:border-r-0"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            )
          })}
        </div>
      </div>

      <div className="px-8 py-11">
        <ContactForm />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Restyle `components/contact-form.tsx` field skin only**

Change only the classNames on `FormLabel` (add `className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink"`) and the submit `Button` (`className="mt-2"` — the hard-shadow/border chrome already comes from Task 5's `Button` primitive rewrite, nothing to add here beyond spacing). Add the RECAPTCHA/no-newsletter note below the button:

```tsx
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">SEND IT</Button>
          <p className="font-mono text-[11px] leading-[1.5] text-ink-3">
            PROTECTED BY RECAPTCHA
            <br />
            NO NEWSLETTER, NO LIST
          </p>
        </div>
```

(Replace the current bare `<Button type="submit">Submit</Button>` line with the block above, keeping everything else in the file — the `Form`/`FormField`/`useContactController` wiring — completely unchanged, per the design doc's explicit "keep react-hook-form + Zod... only the field skin changes" note.)

Do **not** change `hooks/use-contact-controller.tsx`'s `contactSchema` (the design mockup's sample error copy "TELL ME A LITTLE MORE — 20 CHARACTERS MINIMUM" is illustrative design copy, not a real validation message in this codebase — the actual message stays whatever `contactSchema.message`'s Zod error produces, currently `'Message is required'`). The `FormMessage` component already renders that real error text; no message-copy change is needed or correct here.

- [ ] **Step 3: Visual + functional check**

Run: `pnpm run dev`, visit `/contact`. Confirm: two side-by-side panels (not nested cards), submit button is fully visible without clipping on a normal laptop viewport height, submitting an incomplete form shows the real Zod error message styled with the red border/label from Task 5's `Input` primitive (`aria-invalid:border-destructive`), and the form still actually sends (check the network tab for the `POST /api/messages` call — unchanged from before this task).

- [ ] **Step 4: Lint, type-check, commit**

```bash
pnpm run lint && pnpm exec tsc --noEmit
git add "app/(home)/contact" components/contact-form.tsx
git commit -m "feat(design): two-panel contact page, keep form wiring unchanged"
```

---

## Final verification (after all 16 tasks)

- [ ] Run the full suite: `pnpm run lint && pnpm exec tsc --noEmit && pnpm run test:int && pnpm run build`. All four must pass — this branch does not inherit the legacy-code CI exemption documented in `AGENT.md`.
- [ ] Manually click through the site in both light and dark mode at 390px, 768px, and 1440px viewports (matching `admin.livePreview.breakpoints` in `payload.config.ts`), confirming: nav collapses correctly, hero stacks to one column at 390px, project cards go single-column, the stack table's label column becomes a stacked row header (not a horizontally-scrolling table) at 390px.
- [ ] Confirm `prefers-reduced-motion: reduce` (toggle via browser devtools' rendering panel) stops the ticker and collapses all transitions, per Task 4's `globals.css`.
- [ ] Confirm no remaining reference to `three`, `@types/three`, `components/animations`, or `helvetiker_regular.typeface.json` anywhere in the tree (`grep -rn "three\b" --include="*.ts" --include="*.tsx" --include="*.json" app components package.json` — expect zero hits outside `node_modules`/lockfile).
- [ ] Re-read `docs/superpowers/specs/2026-09-12-portfolio-redesign-design.md` end to end and confirm every numbered bug fix it lists is actually addressed: footer name/email (Task 7), card keyboard a11y (Task 9), modal focus/escape/scroll-lock (Task 10), techStack cast (Task 10), search `router.push`→`replace` (Task 15), PostHero contrast (Task 14), dark-mode raw-HSL tokens (Task 4).
- [ ] Invoke `superpowers:finishing-a-development-branch` to run the standard test-verify → present-options → execute flow before merging `feature/portfolio-redesign` back to `main` (merge triggers production auto-deploy per `docs/deployment-plan.md` — confirm with the user before choosing the merge option).
