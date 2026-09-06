'use client'
import { useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from 'next-themes'
import { ModeToggle } from '@components/mode-toggle'

type NavLinkProps = {
  children: ReactNode
  left?: boolean
  right?: boolean
  center?: boolean
}

const Nav = ({ bgColor, children }: { bgColor: string; children: ReactNode }) => (
  <nav
    className={`bg-background/95 border-border fixed top-0 z-50 w-full border-b backdrop-blur ${bgColor} md:block md:px-6 md:py-1`}
  >
    {children}
  </nav>
)

Nav.Container = ({ children, textColor }: { textColor: string; children: ReactNode }) => (
  <div
    className={`z-50 container m-0 mx-auto font-semibold ${textColor} sm:max-w-screen-xl sm:px-1 md:relative md:flex md:flex-row md:items-center md:justify-between md:px-0`}
  >
    {children}
  </div>
)
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Brand = ({ children, href }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="m-0 mr-2 hidden cursor-pointer p-0 py-1.5 text-2xl font-bold whitespace-nowrap hover:text-gray-400 md:block"
  >
    {children}
  </Link>
)

Nav.Toggler = ({ toggle, isOpen, color }: { toggle(): void; isOpen: boolean; color: string }) => (
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

Nav.SideNav = ({
  isOpen,
  toggle,
  children,
}: {
  toggle(arg?: boolean): void
  isOpen: boolean
  children: ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (!isOpen) return
        toggle(false)
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, ref])
  return (
    <aside
      className={
        isOpen
          ? `${className.default} ${className.enabled}`
          : `${className.default} ${className.disabled}`
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

Nav.NavLinks = ({ children, left, right, center }: NavLinkProps) => {
  const className = left
    ? 'hidden  pl-0 mb-0 mr-auto md:flex md:items-center md:pl-0 md:mb-0'
    : right
      ? 'hidden  pl-0 mb-0 ml-auto md:flex md:items-center md:pl-0 md:mb-0 '
      : center
        ? 'hidden  pl-0 mb-0 ml-auto md:flex md:pl-0 md:mb-0 md:mx-auto '
        : 'hidden  pl-0 mb-0 mr-auto md:flex md:pl-0 md:mb-0'
  return <ul className={className}>{children}</ul>
}

Nav.Item = ({ children }: { children: ReactNode }) => (
  <li className="z-50 mb-1 flex cursor-pointer list-none px-2 py-1 text-sm font-medium sm:block md:mb-0 md:ml-0 md:px-1 md:py-1">
    {children}
  </li>
)
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Link = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link
    href={href}
    className="z-50 mb-1 flex cursor-pointer list-none px-2 py-1 font-mono text-sm font-medium sm:block md:mb-0 md:ml-0 md:px-1 md:py-1"
  >
    {children}
  </Link>
)

const className = {
  default: `flex fixed top-0 right-0 flex-col h-screen transition-all duration-300 ease-in-out lg:hidden`,
  enabled: `overflow-y-hidden py-4 w-8/12 text-lg bg-gray-800 translate-y-0`,
  disabled: `overflow-x-hidden w-0 bg-gray-800 translate-x-full text-primary-foreground`,
}

export default Nav
