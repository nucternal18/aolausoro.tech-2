import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="border-edge bg-paper border-b-2 px-6 py-11 md:px-9">
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
