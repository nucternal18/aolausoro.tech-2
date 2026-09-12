'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search as SearchIcon, Menu } from 'lucide-react'

import { NavDesktopLink, NavMobileLink, NavShell } from './nav-components'
import { ModeToggle } from '@components/mode-toggle'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@components/ui/sheet'
import type { SiteSetting } from '@/payload-types'

export function Navbar({ nav, email }: { nav: SiteSetting['nav']; email: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <NavShell>
      <div className="flex items-stretch">
        <Link
          href="/"
          className="flex flex-none items-center gap-[10px] border-r border-[color:var(--rule)] px-[18px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- site icon, matches other Logo usages in this repo */}
          <img src="/android-chrome-512x512.png" alt="" className="h-[26px] w-[26px]" />
          <span className="font-display text-xl tracking-[0.04em] text-ink">
            AOLAUSORO<span className="text-accent-text">.TECH</span>
          </span>
        </Link>

        <ul className="hidden flex-1 list-none items-stretch md:flex">
          {nav.links.map((link, i) => (
            <li key={link.href} className="flex">
              <NavDesktopLink href={link.href} label={link.label} index={i + 1} />
            </li>
          ))}
        </ul>

        <Link
          href="/search"
          aria-label="Search"
          className="hidden w-[52px] items-center justify-center border-l border-[color:var(--rule)] text-ink md:flex"
        >
          <SearchIcon className="h-[17px] w-[17px]" />
        </Link>

        <div className="hidden w-[52px] items-center justify-center border-l border-[color:var(--rule)] md:flex">
          <ModeToggle />
        </div>

        <a
          href={`mailto:${email}`}
          className="bg-accent-hot text-on-accent border-edge hidden items-center border-l-2 px-5 font-mono text-[11px] tracking-[0.12em] md:flex"
        >
          {nav.ctaLabel}
        </a>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Menu"
              className="bg-accent-hot text-on-accent border-edge flex min-h-[48px] w-[52px] flex-none items-center justify-center border-l-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="border-edge bg-paper w-full max-w-sm border-l-2 p-0">
            <SheetHeader className="border-edge border-b-2 p-4">
              <SheetTitle className="font-display text-xl text-ink">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col">
              {nav.links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <NavMobileLink
                    href={link.href}
                    label={link.label}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href={`mailto:${email}`}
                  className="bg-accent-hot text-on-accent flex min-h-[48px] items-center px-4 font-mono text-sm tracking-[0.1em]"
                >
                  {nav.ctaLabel}
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </NavShell>
  )
}
