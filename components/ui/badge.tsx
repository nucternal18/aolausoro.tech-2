import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'utils/utils'

const badgeVariants = cva('chip inline-flex items-center transition-colors', {
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
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
