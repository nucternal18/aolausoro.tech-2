import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { Github, Linkedin } from 'lucide-react'
import { FaStackOverflow } from 'react-icons/fa'

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  stackoverflow: FaStackOverflow,
  other: Github,
} as const

export function Footer({ siteSettings }: { siteSettings: SiteSetting }) {
  const { footer, nav, contact } = siteSettings
  const year = new Date().getFullYear()

  return (
    <footer className="border-edge bg-ink border-t-2">
      <div className="grid grid-cols-1 border-b border-[color:var(--rule)] md:grid-cols-4">
        <div className="border-[color:var(--rule)] px-7 py-8 md:col-span-2 md:border-r">
          <p className="label-mono text-accent-hot mb-2.5">AOLAUSORO.TECH</p>
          <p className="max-w-[420px] text-[15px] leading-[1.6] text-paper">{footer.bio}</p>
          <a
            href={`mailto:${contact.email}`}
            className="bg-accent-hot text-on-accent border-paper mt-4 inline-flex items-center gap-[9px] border-2 px-[17px] py-[13px] font-mono text-xs tracking-[0.1em]"
          >
            {footer.buttonLabel}
          </a>
        </div>

        <nav className="border-[color:var(--rule)] px-6 py-8 md:border-r">
          <p className="label-mono mb-3.5 text-ink-3">PAGES</p>
          <div className="flex flex-col gap-[9px]">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent-hot font-mono text-[13px] text-paper"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-6 py-8">
          <p className="label-mono mb-3.5 text-ink-3">ELSEWHERE</p>
          <div className="flex flex-col gap-[9px]">
            {contact.socialLinks.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform]
              return (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-hot flex min-h-[44px] items-center gap-[9px] font-mono text-[13px] text-paper"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {social.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-b border-[color:var(--rule)] px-7">
        <p className="text-outline [--ink:var(--paper)] font-display py-2 text-[132px] leading-none tracking-[0.01em] whitespace-nowrap">
          AOLAUSORO.TECH
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-7 py-3.5">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-3">
          © {year} ADEWOYIN OLADIPUPO-USORO
        </p>
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-3">{footer.colophon}</p>
      </div>
    </footer>
  )
}
