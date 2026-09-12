import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'eager'
  const priority = priorityFromProps || 'high'

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- Payload's admin
       graphics.Logo slot renders this outside Next's app tree; next/image
       isn't guaranteed available there. */
    <img
      alt="aolausoro.tech"
      width={32}
      height={32}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-8 w-8', className)}
      src="/android-chrome-512x512.png"
    />
  )
}
