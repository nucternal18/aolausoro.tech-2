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
            className="hover:bg-[--tag-platform] grid grid-cols-1 items-baseline gap-3 border-b border-[color:var(--rule)] px-1.5 py-5.5 last:border-b-0 md:grid-cols-[150px_1fr_130px] md:gap-5"
          >
            <span className="font-mono text-xs text-ink-3">
              {post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : ''}
            </span>
            <span>
              <span className="font-display text-ink mb-1.5 block text-[28px] leading-none md:text-[34px]">
                {post.title}
              </span>
              {excerpt && (
                <span className="text-ink-2 block max-w-[640px] text-sm leading-[1.6]">
                  {excerpt}
                </span>
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
