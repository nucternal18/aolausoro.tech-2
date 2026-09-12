'use client'
import { useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { ModeToggle } from '@components/mode-toggle'

type NavLinkProps = {
  children: ReactNode
  left?: boolean
  right?: boolean
  center?: boolean
}

function NavRoot({ bgColor, children }: { bgColor: string; children: ReactNode }) {
  return (
    <nav
      className={`bg-background/95 border-border fixed top-0 z-50 w-full border-b backdrop-blur ${bgColor} md:block md:px-6 md:py-1`}
    >
      {children}
    </nav>
  )
}

function NavContainer({ children, textColor }: { textColor: string; children: ReactNode }) {
  return (
    <div
      className={`z-50 container m-0 mx-auto font-semibold ${textColor} sm:max-w-screen-xl sm:px-1 md:relative md:flex md:flex-row md:items-center md:justify-between md:px-0`}
    >
      {children}
    </div>
  )
}

/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
function NavBrand({ children, href }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="m-0 mr-2 hidden cursor-pointer p-0 py-1.5 text-2xl font-bold whitespace-nowrap hover:text-gray-400 md:block"
    >
      {children}
    </Link>
  )
}

function NavToggler({ toggle, isOpen, color }: { toggle(): void; isOpen: boolean; color: string }) {
  return (
    <div className="text-current">
      <button
        type="button"
        aria-expanded="false"
        aria-disabled={isOpen}
        disabled={isOpen}
        aria-label="Toggle navigation"
        className={`m-0 ml-3 items-center text-4xl font-semibold text-current focus:shadow-none focus:outline-none md:hidden ${color}`}
        onClick={toggle}
      >
        <span>&#8801;</span>
      </button>
    </div>
  )
}

const sideNavClassName = {
  default: `flex fixed top-0 right-0 flex-col h-screen transition-all duration-300 ease-in-out lg:hidden`,
  enabled: `overflow-y-hidden py-4 w-8/12 text-lg bg-gray-800 translate-y-0`,
  disabled: `overflow-x-hidden w-0 bg-gray-800 translate-x-full text-primary-foreground`,
}

function NavSideNav({
  isOpen,
  toggle,
  children,
}: {
  toggle(arg?: boolean): void
  isOpen: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (!isOpen) return
        toggle(false)
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, ref, toggle])
  return (
    <aside
      className={
        isOpen
          ? `${sideNavClassName.default} ${sideNavClassName.enabled}`
          : `${sideNavClassName.default} ${sideNavClassName.disabled}`
      }
      ref={ref}
    >
      <div className="mb-2 flex flex-row items-center justify-between px-4">
        <ModeToggle />
        <button
          aria-label="Close"
          className="text-primary top-3 z-50 cursor-pointer p-1 text-4xl focus:border-transparent focus:shadow-none focus:ring-2 focus:ring-current focus:outline-none dark:focus:ring-yellow-500"
          onClick={() => toggle(false)}
        >
          &times;
        </button>
      </div>
      <div className="mb-2 space-y-2 px-4">{children}</div>
    </aside>
  )
}

function NavNavLinks({ children, left, right, center }: NavLinkProps) {
  const linksClassName = left
    ? 'hidden  pl-0 mb-0 mr-auto md:flex md:items-center md:pl-0 md:mb-0'
    : right
      ? 'hidden  pl-0 mb-0 ml-auto md:flex md:items-center md:pl-0 md:mb-0 '
      : center
        ? 'hidden  pl-0 mb-0 ml-auto md:flex md:pl-0 md:mb-0 md:mx-auto '
        : 'hidden  pl-0 mb-0 mr-auto md:flex md:pl-0 md:mb-0'
  return <ul className={linksClassName}>{children}</ul>
}

function NavItem({ children }: { children: ReactNode }) {
  return (
    <li className="z-50 mb-1 flex cursor-pointer list-none px-2 py-1 text-sm font-medium sm:block md:mb-0 md:ml-0 md:px-1 md:py-1">
      {children}
    </li>
  )
}

/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
function NavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="z-50 mb-1 flex cursor-pointer list-none px-2 py-1 font-mono text-sm font-medium sm:block md:mb-0 md:ml-0 md:px-1 md:py-1"
    >
      {children}
    </Link>
  )
}

const Nav = Object.assign(NavRoot, {
  Container: NavContainer,
  Brand: NavBrand,
  Toggler: NavToggler,
  SideNav: NavSideNav,
  NavLinks: NavNavLinks,
  Item: NavItem,
  Link: NavLink,
})

export default Nav
