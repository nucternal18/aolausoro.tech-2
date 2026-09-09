import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeComponent from '@/components/home'

export default async function Page() {
  const payload = await getPayload({ config })

  const [projects, cvs, posts] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { published: { equals: true } },
      limit: 50,
      sort: '-createdAt',
      depth: 1,
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
      where: { _status: { equals: 'published' } },
      limit: 3,
      sort: '-publishedAt',
      depth: 1,
    }),
  ])

  return <HomeComponent projects={projects.docs} cv={cvs.docs[0] ?? null} posts={posts.docs} />
}
