# Design: Site-wide portfolio redesign ("edgy" visual system) + maximal CMS-editability

**Date:** 2026-09-12
**Branch:** `feature/portfolio-redesign` (new, off `main`)
**Status:** Draft — awaiting review

## Context

The user commissioned a visual redesign of `aolausoro.tech` via Claude Design
(project `1db145c0-be22-4905-aeac-2baf68b3b214`, "Portfolio redesign
direction") and approved the result. The design project's `Redesign.dc.html`
(16 sections, `1a`–`1p`) and `globals.css` are the source of truth for the
visual system; this spec translates them into a concrete implementation plan
for this codebase, with one addition the design doc didn't scope: **every
piece of copy the design doc treats as static text becomes a Payload-admin
field** (the user's explicit "maximal" answer), not just the handful of
places the doc calls out as CMS-driven (project data, the `projects.totalDocs`
stat).

The current site is mid-migration from Clerk/Prisma/Redux/inversify to
Payload CMS (Phase 3 of that migration is complete and live in production —
see `docs/deployment-plan.md`). This redesign is independent of that
migration but lands on top of it: it touches the same component tree, adds
new Payload collections/globals, and does **not** reintroduce any of the
removed legacy stack.

## Goals

1. Ship the approved visual system (design tokens, typography, hard-edge/
   hard-shadow component language, Hero A) across every page.
2. Make effectively all page copy and structural content editable from
   `/admin` — hero copy, nav labels, footer copy, CTA copy, contact copy,
   section headings, the homepage ticker messages, and a new Stack/Skills
   dataset — without duplicating the same fact (email, location) into
   multiple independent fields.
3. Fix the specific pre-existing bugs the design doc flags while touching
   each relevant area (see §6).
4. Remove the Matrix/Three.js hero animation and its dependencies entirely.
5. Land as one feature branch, merged to `main` only once the whole
   redesign is built and verified (per the user's explicit rollout choice —
   `main` auto-deploys to production on push).

## Non-goals

- Re-litigating the visual design itself. The design doc is approved;
  this spec is about *how* to build it in this codebase, not *what* it
  looks like.
- Changing the Posts/Projects editorial workflow beyond the two new
  Projects fields (§4.3) the design doc explicitly asks for.
- A staging environment or incremental production rollout. Per the
  confirmed rollout choice, this ships as one branch, verified locally/in
  a preview, then merged.
- Multi-language/i18n. Out of scope, not mentioned in the design doc.

## Approach

Three candidate structures for the CMS layer were considered:

1. **One `site-settings` global with everything, including stack data as a
   nested array field.** Simplest data model, but a 4-group × N-item nested
   array inside a global gives a worse admin UX (no drag-reorder between
   Payload's per-collection list view, no independent document permissions)
   for content that is genuinely a repeatable dataset.
2. **A global per section (`hero-settings`, `nav-settings`, `footer-settings`,
   ...).** More granular access control, but this site has one editor (the
   user) — the extra collections buy nothing and multiply the admin
   sidebar for no benefit.
3. **One `site-settings` global for section copy (recommended) + a small
   `stack-groups` collection for the repeatable Stack/Skills dataset.** The
   design doc itself calls out the stack table as wanting "a small CMS
   collection so it stops being a hard-coded array" — collections are the
   right Payload primitive for a reorderable list of independent records;
   copy fields that only ever exist once (hero heading, footer bio) belong
   in a global. This is the model used below.

Approach 3 is used. It also keeps a single write path for facts that would
otherwise drift: contact email, location, and social links live once, in
`site-settings.contact`, and every section that shows them (hero stat rail,
CTA band, footer, contact page) reads from that one field group instead of
having its own copy — this is what actually fixes the design doc's flagged
"hero says one email, CTA says `hello@example.com`" bug, rather than
reproducing it with CMS fields.

## Data model

### New global: `site-settings` (singleton)

Access: `read: () => true` (public site needs it for SSR), `update: authenticated` (matches every other collection in this repo, e.g. `payload/collections/Projects/index.ts`).

```
hero: group
  eyebrow            text     default: "FULL-STACK ENGINEER"
  stackLine          text     default: "TYPESCRIPT · NEXT.JS · NODE · DOCKER"
  name               text     default: "Adewoyin Oladipupo-Usoro"
                                 — component splits on the last space and
                                   applies the outline treatment to the
                                   final word; no separate "outlined word"
                                   field
  lead               textarea
  terminalLines      array of { prompt: text, output: text }
                                 — renders the "$ whoami" / "$ cat stack.txt"
                                   / "$ availability" block, in array order
  primaryCtaLabel    text     default: "SEE THE WORK"   (anchors to #work)
  secondaryCtaLabel  text     default: "CV (PDF)"        (existing CVs
                                                           collection supplies
                                                           the file; this is
                                                           label only)
  statLocation       text     default: "LONDON, UK"
  statStatus         text     default: "OPEN TO WORK"
                                 — the fourth stat, SHIPPED, is NOT a field:
                                   it stays computed from
                                   `projects.totalDocs` per the design doc's
                                   explicit instruction (§1c); EMAIL reuses
                                   `contact.email` below, also not duplicated

ticker: array of { message: text }
                                 — rotating marquee messages, homepage only;
                                   ships with the 3 messages from the design
                                   doc as seed data, editable/reorderable

nav: group
  links              array of { label: text, href: text }
                                 — seeded WORK/#work, STACK/#stack,
                                   WRITING/posts, CONTACT/contact
  ctaLabel           text     default: "HIRE ME"

contact: group        — single source of truth, read by hero, CTA band,
                         footer, and the contact page
  email              email
  location           text
  responsePromise    text     default: "REPLIES WITHIN A DAY"
  socialLinks        array of {
                        platform: select (github | linkedin | stackoverflow | other),
                        url: text,
                        label: text
                      }

cta: group             — the full-bleed CTA band (design doc §1i)
  eyebrow            text     default: "04 / CONTACT"
  heading            text     default: "Got a role or a build?"
  body               textarea

footer: group
  bio                textarea
  buttonLabel        text     default: "START A CONVERSATION"
  colophon           text     default: "NEXT.JS 16 · PAYLOAD CMS · DOCKER ON DIGITALOCEAN"

sectionHeadings: group
  work:     { eyebrow, heading, description }   default heading: "Selected projects"
  stack:    { eyebrow, heading, description }
  writing:  { eyebrow, heading }
  search:   { heading }
  contact:  { eyebrow, heading, body }           — the contact PAGE's intro,
                                                    distinct from the `cta`
                                                    group above (CTA band vs.
                                                    /contact page)
```

File: `payload/globals/SiteSettings/index.ts`, registered in
`payload.config.ts`'s `globals:` array (this repo currently has none — the
array needs adding alongside `collections:`).

### New collection: `stack-groups`

```
label   text      required          — "Frontend" / "Backend" / "Platform" / "Craft"
items   array of {
          name:   text    required
          filled: checkbox default:false   — true = solid/"daily" chip,
                                              false = outlined/"working
                                              knowledge" chip
        }
```

Sort order is the collection's natural document order; Payload's admin list
view supports drag-reorder out of the box for collections without a custom
`defaultSort`, so no explicit `order` field is needed. Access mirrors
`Projects`: `read: () => true`, `create/update/delete: authenticated`.

File: `payload/collections/StackGroups/index.ts`. Seed data: the four rows
and their tags come from the current hard-coded array in `components/
skills.tsx` (read at implementation time and transcribed into a one-off
seed script or entered manually via `/admin` — decided in the plan).

### `Projects` collection — two new fields

Added to the existing `payload/collections/Projects/index.ts`:

```
longDescription   richText (defaultLexical editor, matches Posts'
                   content field config)      — powers the modal's
                                                 "THE BUILD" write-up
appImages         array of { image: upload, relationTo: 'media' }
                                              — powers the modal's 4-thumbnail
                                                gallery
```

Both optional (existing project documents have neither populated yet); the
modal component treats an empty `appImages` array as "gallery not shown,
fall back to the single `screenshot` field already on the collection."

### What does *not* become a field

- Blog post content, categories, authorship — unchanged, existing `Posts`
  collection.
- Search page results — driven by the existing `@payloadcms/plugin-search`
  index, not new content.
- The Logo component's image (`/android-chrome-512x512.png`) — a build
  asset, not editorial copy; already fixed this session (`components/Logo/
  Logo.tsx`).
- Devicon/tech-stack-logo strip under the Stack table (design doc §1h,
  "the 30 devicon URLs sitting unused in `config/data.ts`") — this is a
  decorative logo-URL list, not prose. Making it CMS-managed buys nothing
  a code review wouldn't (broken icon URLs pasted via a text field are a
  worse failure mode than a broken icon URL caught in review), so it stays
  a static export the component imports directly. Flagging this exception
  explicitly since it cuts against "maximal" — happy to move it into
  `stack-groups` per-group if the user disagrees.

## Visual system implementation (design doc → files)

This section maps each of the design doc's 16 sections to the concrete file
changes, in the doc's own recommended rollout order (§1p). Component-level
visual detail (exact Tailwind classes, exact markup) is drawn from the fully
read `Redesign.dc.html` / `globals.css` and will be transcribed into the
implementation plan's task steps — this spec fixes *scope and order*, not
every class name.

### Step 1 — Tokens + fonts (zero component edits)

- `app/globals.css`: full replacement with the design project's `globals.css`
  (light/dark token sets, `@theme inline` scale, hard-shadow utilities,
  ticker keyframes, `prefers-reduced-motion` handling). This also fixes the
  **pre-existing bug** in the current file where `.dark`'s `--primary` and
  `--primary-foreground` are raw HSL triples not wrapped in `hsl()`/`oklch()`
  — the replacement file doesn't carry the bug forward.
- Delete from the current `app/globals.css` (folded into the replacement,
  not a separate diff): `.matrix-bg`/`.matrix-char`/`matrixFall`/
  `matrixGlow`.
- `app/(home)/layout.tsx`: register Bebas Neue correctly —
  `localFont({ src: '../../fonts/BebasNeue-Regular.ttf', variable:
  '--font-bebas', display: 'swap' })`, apply `bebas.variable` on `<body>`
  alongside the existing sans font variable, remove the current
  `font-bebas-neue` body-level class (headings opt in via the new
  `font-display` utility instead). Add Inter as the body face, exposed as
  `--font-inter` (via `next/font/google` — simpler than vendoring another
  `.ttf`, and this repo already uses `next/font/google` for Geist elsewhere;
  confirmed at implementation time by reading the current `layout.tsx`).
- `.masonry`/`.masonry-sm`/`.masonry-md`/`.break-inside` (globals.css
  §7 "KEEP") carry over unchanged — still used by the blog archive.

### Step 2 — Primitives

- `components/ui/button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`: patch
  `cva` variants for 2px edge borders, `--radius:0`, hard shadow
  (`shadow-hard` / `hard-lift` utility on hover/press), and the new focus
  ring (`outline: 3px solid var(--accent-hot); outline-offset: 2px`,
  replacing shadcn's default `focus-visible:ring-[3px] ring-ring/50`, which
  the design doc flags as effectively invisible against these tokens).

### Step 3 — Nav + Footer

- `components/navigation/Navbar.tsx` + `components/navigation/
  nav-components.tsx`: opaque (no `backdrop-blur`) sticky nav, 2px bottom
  border, active-section shown as a 4px accent underline rather than a
  color swap. Nav links and the "HIRE ME" CTA label read from
  `siteSettings.nav`. (This file was rewritten for lint fixes earlier this
  session — the named-function structure `NavRoot`/`NavContainer`/etc.
  stays; only styling and the data source change.)
- `components/Footer.tsx`: 4-column colophon layout, outlined full-bleed
  wordmark, bottom copyright/colophon bar. Bio, button label, colophon
  line, nav links (reuses `siteSettings.nav.links`), and social links
  (reuses `siteSettings.contact.socialLinks`) all come from
  `site-settings`. This fixes the **"John A." name-mismatch bug** and the
  `hello@example.com` placeholder the design doc flags — both are replaced
  by the single `site-settings.contact` source of truth.

### Step 4 — Hero (Hero A) + delete the Matrix

- `components/hero.tsx`: rebuilt as Hero A — 12-col visible grid overlay,
  badge row, 158px Bebas name (last word outlined), lead + terminal block
  + two CTAs on the left, stat `<dl>` on the right (BASED/STATUS/SHIPPED/
  EMAIL — SHIPPED from `projects.totalDocs`, singular/plural on `=== 1`
  per the doc; EMAIL from `siteSettings.contact.email`), ticker bar below.
  All copy fields read from `siteSettings.hero` + `siteSettings.ticker`.
- `components/home.tsx`: remove the `<MatrixRainAnimation />` usage.
- Delete: `components/animations/` (`matrix-rain-animation.tsx`,
  `code-animation.tsx`, `code-cube-animation.tsx`, `network-animations.tsx`,
  `index.ts`), `public/fonts/helvetiker_regular.typeface.json`.
- `package.json`: remove `three` and `@types/three`.
- This is called out in the design doc as "the biggest visual and
  performance win in one commit" — kept as its own commit for that reason.

### Step 5 — Cards + modal

- `components/portfolio-component.tsx` / `portfolio-card.tsx`: asymmetric
  7/5-column grid (not `md:grid-cols-2`), mono index/year header strip, tag
  chips using the tag-palette tokens, footer link pairs with real anchors
  (`stopPropagation`, not nested inside the card's own click handler). Card
  becomes `role="button" tabindex="0"` with a real `focus-visible` outline
  — fixes the keyboard-inaccessible click-div the design doc flags.
- `components/project-modal.tsx`: rebuilt on the already-present, currently
  unused `components/ui/dialog.tsx` (Radix Dialog) instead of the hand-rolled
  implementation. This is where the doc's six flagged missing behaviors
  (focus trap, Escape-to-close, scroll lock, `aria-modal`, focus restore,
  overlay-click-to-close) land for free. Gallery reads `project.appImages`;
  write-up reads `project.longDescription`; stack chips read
  `project.techStack` as `{ technology: string }[]` (its actual shape) —
  fixes the current `as string[]` cast.
- `payload/collections/Projects/index.ts`: add `longDescription` +
  `appImages` (§4.3).

### Step 6 — Stack + CTA

- `components/skills.tsx`: rebuilt as a 4-row spec table (180px numbered
  label column + wrapped chip list, filled vs. outlined per `item.filled`),
  reading rows from the new `stack-groups` collection. Devicon logo strip
  stays a static import per §4.4.
- `components/cta.tsx`: full-bleed `--accent-hot` band, copy from
  `siteSettings.cta`, the three link rows built from `siteSettings.contact.
  email` + `/contact` + the existing CVs collection — replacing the current
  dead `calendly.com` / `hello@example.com` placeholders.

### Step 7 — Blog, search, contact

- `app/(home)/posts/page.tsx`, `app/(home)/posts/page/[pageNumber]/page.tsx`
  + `components/CollectionArchive/index.tsx` (confirmed as the actual
  shared archive component, used by both listing routes and by
  `app/(home)/search/page.tsx`): rows instead of cards (date / title+excerpt
  / category+read-time grid row), pagination footer. Section heading from
  `siteSettings.sectionHeadings.writing`.
- `app/(home)/posts/[slug]/page.tsx` + `heros/PostHero/index.tsx`
  (confirmed import path: `@/heros/PostHero`): 680px prose measure,
  left-sidebar mono "ON THIS PAGE" TOC rail. Fixes the **uncontrolled-
  contrast image-hero bug** the doc flags (`text-white` over an arbitrary
  CMS upload at `min-h-[80vh]`) — header becomes type-only on paper
  background (17.8:1 contrast guaranteed by the token set), any hero image
  moves inline below the intro instead of behind the title. Note:
  `app/(home)/posts/[slug]/page.client.tsx` currently forces
  `setHeaderTheme('light')` "while we have an image behind it" — once the
  header goes type-only this forced override is dead code and should be
  removed together with the header component's dependence on it (confirm
  at implementation time whether `HeaderTheme` is still needed elsewhere).
- `search/Component.tsx` (confirmed path, imported as `@/search/Component`
  by `app/(home)/search/page.tsx`): bordered input, `POST`/`PROJECT`-typed
  result rows with
  `<mark>`-highlighted matches, dashed-border empty state with suggested
  queries. Fixes the **`router.push`-on-every-debounce-tick bug** — switches
  to `router.replace`, skips the call when the query is unchanged, so back
  button navigation works again. Heading from `siteSettings.
  sectionHeadings.search`.
- `app/(home)/contact/page.tsx` + `components/contact-form.tsx`: two-panel
  layout (bio + `<dl>` + socials on the left, form on the right) replacing
  the current nested Card-in-Card (which the doc notes clips the submit
  button inside `h-screen` on laptop screens). `react-hook-form` + Zod +
  the shadcn `Form` wiring stay exactly as-is — only the field skin
  changes, per the doc's explicit note. Page intro copy from `siteSettings.
  sectionHeadings.contact`; sidebar facts from `siteSettings.contact`.

Named "last" in the design doc because these pages are the least-visited
and still carry leftover Payload-website-template defaults.

### Responsive behavior (design doc §1o)

Not a separate step — every component task above includes the mobile
(390px) behavior specified for it: nav collapses to a hamburger, hero
stacks to a single column with a 62px headline, project cards go
single-column, the stack table's label column becomes a stacked row
header. Verified per-component during that component's task, not deferred
to a final pass.

## Motion & accessibility (carried through every step, per design doc §1p)

**What moves** — exactly four things, all `transform`/`opacity`:
hover/press lift (`translate(-3px,-3px)` + shadow grow, 130ms linear,
collapsing to 1px on press), the ticker (28s `translateX(-50%)`, pauses on
`:hover`/`:focus-within`), nav underline + row-wash color transitions
(120ms), and Radix Dialog's stock 150ms fade+zoom (`tw-animate-css`,
already a dependency).

**What doesn't** — no scroll-triggered entrances, no `useInView`, no
parallax, no counters, no glitch loops, no canvas/WebGL/
`requestAnimationFrame` anywhere in the redesigned surface.

**Contrast/a11y specifics locked by the token set** (not decisions left
open — copied from the approved design doc so implementers don't
re-derive them):
- `--accent-hot` (#00DCB3) is a surface color only, never text, on light
  mode (1.66:1). Text-weight accent use on light mode goes through
  `--accent-text` (#006B5B, 5.0:1) instead.
- 11px mono labels stay 11px for index/meta chips; anything body-adjacent
  uses 12px (`--text-meta`).
- All-caps Bebas is restricted to headings and ≤6-word titles, never
  prose.
- `-webkit-text-stroke` outlined type never appears below 48px, and only
  where the same words exist as solid text elsewhere on the page
  (decorative repetition, not the only rendering of that content).
- Focus ring is `outline`, not a border (`outline: 3px solid #00DCB3;
  outline-offset: 2px`), landed in Step 2 and inherited everywhere.
- `prefers-reduced-motion: reduce` disables all `.ticker`/`[class*=
  'animate-']` animation and drops transition durations to 1ms — this
  lives in the Step 1 `globals.css` replacement, so it's global from the
  first commit.

## Testing

- No new automated visual-regression tooling is introduced (none exists in
  this repo today; out of scope to add here).
- Existing `pnpm run test:int` (Payload integration tests) gets new/updated
  cases for: `site-settings` global read access, `stack-groups` collection
  CRUD, and the two new `Projects` fields — mirroring the existing test
  patterns in `payload/collections/*/tests` or equivalent (confirmed at
  implementation time).
- `pnpm run lint`, `pnpm exec tsc --noEmit`, `pnpm run build` must all pass
  before merge (this branch is not exempt from the CI gates the way the
  legacy-code migration currently is — this is new code, not pre-existing
  legacy debt).
- Manual verification pass across both color schemes and the 390px/768px/
  1440px breakpoints (matching the `admin.livePreview.breakpoints` already
  configured in `payload.config.ts`) before requesting merge.

## Rollout

New branch `feature/portfolio-redesign`, forked from `main` (the current
production branch). Seven commits/task-groups matching the design doc's own
order (§5, Steps 1–7 above), each independently buildable and (ideally)
independently revertable. Feature branch stays open — not merged — until
every step is implemented and the manual verification pass is done, per the
user's explicit rollout choice. `main`'s push-triggered auto-deploy
(`.github/workflows/deploy-production.yml`) means the merge commit itself
is effectively "go live" — the finishing-a-development-branch skill's
standard menu applies at that point, but Option 1 (merge locally) is
expected to be followed immediately by a real production push, unlike
earlier merges this session that used `workflow_dispatch` while the trigger
was still disabled.

## Open exception flagged for the user

§4.4 above (devicon logo strip) is the one place this spec pulls back from
literal "maximal" — recommend keeping it a static code-level array rather
than a CMS field, for the reason given there. Flagging it explicitly rather
than silently deciding it; happy to add it as a `stack-groups`-level field
if preferred.
