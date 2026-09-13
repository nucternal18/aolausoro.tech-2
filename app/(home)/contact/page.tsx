import { getPayload } from 'payload'
import config from '@payload-config'
import { Github, Linkedin } from 'lucide-react'
import { FaStackOverflow } from 'react-icons/fa'

import ContactForm from '@components/contact-form'

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  stackoverflow: FaStackOverflow,
  other: Github,
} as const

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const { contact, sectionHeadings } = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: false,
  })
  const { contactPage } = sectionHeadings

  return (
    <section className="border-edge grid grid-cols-1 border-2 md:grid-cols-[1fr_1.3fr]">
      <div className="bg-[--tag-platform] border-edge border-b-2 px-8 py-11 md:border-r-2 md:border-b-0">
        <p className="label-mono text-ink-2 mb-2.5">{contactPage.eyebrow}</p>
        <h1 className="font-display text-ink mb-4 text-[52px] leading-[0.88] md:text-[68px]">
          {contactPage.heading}
        </h1>
        <p className="text-ink-2 mb-6.5 text-[15px] leading-[1.7]">{contactPage.body}</p>

        <dl className="border-t border-[color:var(--ink)]/22">
          <div className="border-b border-[color:var(--ink)]/22 py-3.5">
            <dt className="text-ink-3 mb-1 font-mono text-[11px] tracking-[0.1em]">EMAIL</dt>
            <dd>
              <a
                href={`mailto:${contact.email}`}
                className="border-accent-hot text-ink border-b-2 font-mono text-sm"
              >
                {contact.email}
              </a>
            </dd>
          </div>
          <div className="border-b border-[color:var(--ink)]/22 py-3.5">
            <dt className="text-ink-3 mb-1 font-mono text-[11px] tracking-[0.1em]">BASED</dt>
            <dd className="font-mono text-sm text-ink">{contact.location}</dd>
          </div>
          <div className="py-3.5">
            <dt className="text-ink-3 mb-1 font-mono text-[11px] tracking-[0.1em]">RESPONSE</dt>
            <dd className="text-accent-text font-mono text-sm">{contact.responsePromise}</dd>
          </div>
        </dl>

        <div className="border-edge mt-5.5 flex border">
          {contact.socialLinks.map((social) => {
            const Icon = SOCIAL_ICONS[social.platform]
            return (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="border-edge hover:bg-accent-hot hover:text-on-accent flex flex-1 items-center justify-center border-r p-3.5 text-ink last:border-r-0"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            )
          })}
        </div>
      </div>

      <div className="px-8 py-11">
        <ContactForm />
      </div>
    </section>
  )
}
