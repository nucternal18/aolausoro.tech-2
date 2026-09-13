'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavDesktopLink({
  href,
  label,
  index,
}: {
  href: string
  label: string
  index: number
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href.startsWith('/#') && pathname === '/')

  return (
    <Link
      href={href}
      className={`flex items-center gap-[7px] border-r border-[color:var(--rule)] px-4 py-4 font-mono text-[11px] tracking-[0.12em] transition-colors duration-120 ${
        isActive
          ? 'border-b-accent-hot border-b-4'
          : 'hover:border-b-accent-hot border-b-4 border-b-transparent'
      }`}
    >
      <span className="text-ink-3">{String(index).padStart(2, '0')}</span>
      {label}
    </Link>
  )
}

export function NavMobileLink({
  href,
  label,
  onNavigate,
}: {
  href: string
  label: string
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="border-edge flex min-h-[48px] items-center border-b-2 px-4 font-mono text-sm tracking-[0.1em]"
    >
      {label}
    </Link>
  )
}

export function NavShell({ children }: { children: ReactNode }) {
  return <nav className="border-edge bg-paper sticky top-0 z-50 border-b-2">{children}</nav>
}
