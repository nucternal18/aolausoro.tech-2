# aolausoro.tech

Personal portfolio and content site for Adewoyin Oladipupo-Usoro. Payload CMS
manages every content type; the Next.js App Router frontend renders the public
site and Payload serves the `/admin` panel.

Registered collections (`payload.config.ts`): Posts, Projects, Jobs, Messages,
Wiki, Issues, Users, Media. The `Posts` collection is a partial port from the
Payload website template — its layout-builder blocks and a `categories`
relationship are not yet wired up (Phase 3 of the migration).

## Language

**Project**:
A piece of work in the portfolio — the primary showcased content type.
_Avoid_: Portfolio item, work sample

**Post**:
A blog/article entry, published over time. Layout-builder and drafts intended
(port from the Payload template incomplete — see above).
_Avoid_: Article, blog (as a content-type name — "Post" is the collection)

**Job**:
A work-history / experience entry.
_Avoid_: Role, position (in the data model — those are fields)

**Message**:
A contact-form submission captured from the public site.
_Avoid_: Contact, enquiry, lead

**Wiki**:
A long-form knowledge/notes entry, rich-text.
_Avoid_: Doc, note (as the collection name)

**Issue**:
An internally-tracked task or bug recorded as content (distinct from GitHub
Issues, which are the engineering issue tracker — see
`docs/agents/issue-tracker.md`).
_Avoid_: Ticket, task

**Media**:
The uploads collection. In production, files are stored in DigitalOcean Spaces,
not on the host disk.
_Avoid_: Asset, file, upload (as the collection name)

**User**:
An auth-enabled account with `/admin` access.
_Avoid_: Admin, account
