import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const [posts, siteSettings] = await Promise.all([
    payload.find({
      collection: 'search',
      depth: 1,
      limit: 12,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        doc: true,
      },
      // pagination: false reduces overhead if you don't need totalDocs
      pagination: false,
      ...(query
        ? {
            where: {
              or: [
                {
                  title: {
                    like: query,
                  },
                },
                {
                  'meta.description': {
                    like: query,
                  },
                },
                {
                  'meta.title': {
                    like: query,
                  },
                },
                {
                  slug: {
                    like: query,
                  },
                },
              ],
            },
          }
        : {}),
    }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false }),
  ])

  return (
    <div className="border-edge bg-paper border-2 px-6 py-11 md:px-9">
      <PageClient />
      <h1 className="font-display text-ink mb-5.5 text-[40px] leading-[0.9] md:text-[60px]">
        {siteSettings.sectionHeadings.search.heading}
      </h1>
      <div className="mx-auto mb-3.5 max-w-[50rem]">
        <Search />
      </div>

      {query && (
        <p className="text-ink-2 mb-6.5 font-mono text-xs">
          {posts.totalDocs} RESULT{posts.totalDocs === 1 ? '' : 'S'} FOR &ldquo;
          {query.toUpperCase()}&rdquo;
        </p>
      )}

      {posts.docs.map((result) => {
        const isProject = result.doc?.relationTo === 'projects'
        return (
          <a
            key={result.id}
            href={isProject ? `/#work` : `/posts/${result.slug}`}
            className="hover:bg-[--tag-platform] grid grid-cols-1 items-baseline gap-3 border-t border-[color:var(--rule)] px-1.5 py-5 md:grid-cols-[110px_1fr_120px]"
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
          <p className="text-ink-2 mt-1.5 mb-4 text-sm">No results — try a different term.</p>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Search | aolausoro.tech`,
  }
}
