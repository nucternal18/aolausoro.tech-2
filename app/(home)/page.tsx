import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeComponent from '@/components/home'

// The homepage renders live CMS content (projects, CV, latest posts) pulled
// through Payload's local API, so it is rendered per-request rather than
// prerendered at build time. This also keeps `next build` free of any
// database dependency.
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
