import type { SiteSetting } from '@/payload-types'

export default function CTA({
  cta,
  email,
  cvUrl,
}: {
  cta: SiteSetting['cta']
  email: string
  cvUrl?: string
}) {
  return (
    <section className="border-edge bg-accent-hot border-t-2 border-b-2">
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        <div className="border-edge px-6 py-11 md:border-r-2 md:px-10">
          <p className="text-on-accent mb-3.5 font-mono text-[11px] tracking-[0.14em]">
            {cta.eyebrow}
          </p>
          <h2 className="font-display text-ink text-[52px] leading-[0.86] md:text-[96px]">
            {cta.heading}
          </h2>
          <p className="text-ink mt-4.5 max-w-[560px] text-[17px] leading-[1.6]">{cta.body}</p>
        </div>
        <div className="flex flex-col">
          <a
            href={`mailto:${email}`}
            className="bg-ink text-paper border-edge hover:bg-[--on-accent] flex flex-1 flex-col justify-center gap-2 border-b-2 px-6.5 py-7"
          >
            <span className="text-accent-hot font-mono text-[11px] tracking-[0.14em]">
              EMAIL ME
            </span>
            <span className="font-mono text-[15px]">{email}</span>
          </a>
          <a
            href="/contact"
            className="text-on-accent border-edge hover:bg-ink hover:text-accent-hot flex flex-1 flex-col justify-center gap-2 border-b-2 px-6.5 py-7"
          >
            <span className="font-mono text-[11px] tracking-[0.14em]">OR USE THE FORM</span>
            <span className="font-mono text-[15px]">/contact →</span>
          </a>
          <a
            href={cvUrl ?? '#'}
            target={cvUrl ? '_blank' : undefined}
            rel={cvUrl ? 'noreferrer' : undefined}
            className="text-on-accent hover:bg-ink hover:text-accent-hot flex flex-1 flex-col justify-center gap-2 px-6.5 py-7"
          >
            <span className="font-mono text-[11px] tracking-[0.14em]">DOWNLOAD</span>
            <span className="font-mono text-[15px]">CV.PDF →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
