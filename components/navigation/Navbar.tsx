'use client'
import { useState } from 'react'
import Link from 'next/link'

import { links, social } from '../../data'

// components
import Nav from './nav-components'
import { ModeToggle } from '@components/mode-toggle'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@components/ui/sheet'
import { ScrollArea } from '@components/ui/scroll-area'

type NavProps = {
  textColor?: string
}

export function Navbar({ textColor = 'text-primary' }: NavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Nav bgColor=" drop-shadow-sm">
      <Nav.Toggler toggle={toggle} isOpen={isOpen} color={textColor} />
      {/* Main navigation */}
      <Nav.Container textColor={`${textColor} `}>
        <Nav.Brand href="/">
          <img src={'/android-chrome-512x512.png'} alt="logo" className="h-8 w-8" />
        </Nav.Brand>
        <Nav.NavLinks right>
          {links.map((link) => {
            const { id, url, text } = link
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{text}</Nav.Link>
              </Nav.Item>
            )
          })}
        </Nav.NavLinks>
        <Nav.NavLinks right>
          <Nav.Item>
            <ModeToggle />
          </Nav.Item>
          {social.map((link) => {
            const { id, url, icon } = link
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{icon}</Nav.Link>
              </Nav.Item>
            )
          })}
        </Nav.NavLinks>
      </Nav.Container>
    </Nav>
  )
}

export function MobileNavbar({ height }: { height: number }) {
  const SHEET_HEIGHT = height - 200
  const SCROLL_AREA_HEIGHT = height - 400

  return (
    <header>
      <Sheet>
        <SheetTrigger className="navbar-burger text-primary flex items-center p-4">
          <svg
            className="text-primary block h-6 w-6 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
          <span hidden>Mobile Menu</span>
        </SheetTrigger>

        <SheetContent side={'bottom'} className={`shadow h-[${SHEET_HEIGHT}] shadow-neutral-400`}>
          <SheetHeader>
            <SheetTitle>
              <div className="flex w-full justify-between">
                <div className="text-primary flex items-center">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="whitespace-no-wrap flex items-center text-left text-xs font-bold uppercase md:pb-2"
                    >
                      <img src={'/android-chrome-512x512.png'} alt="logo" className="h-8 w-8" />
                      <span className="ml-1">aolausoro.tech</span>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className={`text-primary py-12`} style={{ height: SCROLL_AREA_HEIGHT }}>
            {links.map((link) => {
              const { id, url, text } = link
              return (
                <Nav.Item key={id}>
                  <SheetClose asChild>
                    <Link
                      href={url}
                      className="z-50 mb-1 flex cursor-pointer list-none px-2 font-mono text-lg font-medium sm:block md:mb-0 md:ml-0 md:px-1 md:py-1"
                    >
                      {text}
                    </Link>
                  </SheetClose>
                </Nav.Item>
              )
            })}
            <div className={`absolute bottom-0 mb-2 flex items-center justify-center`}>
              {social.map((link) => {
                const { id, url, icon } = link
                return (
                  <Nav.Item key={id}>
                    <Nav.Link href={url}>{icon}</Nav.Link>
                  </Nav.Item>
                )
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  )
}
