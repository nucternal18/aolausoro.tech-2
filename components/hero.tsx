import type { SiteSetting } from '@/payload-types'

function splitOutlinedName(name: string) {
  const parts = name.trim().split(' ')
  const last = parts.pop() ?? ''
  return { rest: parts.join(' '), last }
}

export function Hero({
  cvDoc,
  hero,
  ticker,
  location,
  status,
  email,
  projectsTotalDocs,
}: {
  cvDoc: string
  hero: SiteSetting['hero']
  ticker: SiteSetting['ticker']
  location: string
  status: string
  email: string
  projectsTotalDocs: number
}) {
  const { rest, last } = splitOutlinedName(hero.name)
  const shippedLabel = `${projectsTotalDocs} LIVE PROJECT${projectsTotalDocs === 1 ? '' : 'S'}`

  return (
    <section id="hero" className="border-edge bg-paper relative overflow-hidden border-b-2">
      <div
        aria-hidden="true"
        className="grid-rules pointer-events-none absolute inset-0 grid grid-cols-12"
      />

      <div className="relative px-6 pt-14 md:px-10">
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <span className="bg-ink text-accent-hot px-[11px] py-2 font-mono text-[11px] tracking-[0.14em]">
            {hero.eyebrow}
          </span>
          <span className="text-ink-2 font-mono text-[11px] tracking-[0.14em]">
            {hero.stackLine}
          </span>
        </div>

        <h1 className="font-display text-ink text-[62px] leading-[0.84] tracking-[0.004em] md:text-[158px] md:leading-[0.82]">
          {rest}
          <br />
          <span className="text-outline">{last}</span>
        </h1>

        <div className="border-edge mt-8 grid gap-10 border-t-2 pt-6 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-ink mb-5 max-w-[560px] text-[17px] leading-[1.6]">{hero.lead}</p>

            <div className="border-edge bg-paper shadow-hard mb-5 max-w-[560px] border-2">
              <div className="bg-ink flex items-center gap-[9px] px-3 py-2.5">
                <span className="bg-accent-hot block h-[9px] w-[9px]" />
                <span className="text-paper font-mono text-[10px] tracking-[0.12em]">
                  ~/aolausoro.tech
                </span>
              </div>
              <div className="flex flex-col gap-[7px] px-3 py-3.5">
                {hero.terminalLines.map((line, i) => (
                  <p key={i} className="font-mono text-[13px] leading-[1.5]">
                    <span className="text-accent-text">$</span> {line.prompt}
                    <br />
                    <span className="text-ink">{line.output}</span>
                  </p>
                ))}
                <p className="font-mono text-[13px] leading-[1.5]">
                  <span className="text-accent-text">$</span> availability
                  <span className="bg-accent-hot animate-caret ml-1.5 inline-block h-[15px] w-2 align-[-2px]" />
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3.5">
              <a
                href="#work"
                className="bg-accent-hot text-on-accent border-edge shadow-hard hard-lift inline-flex items-center gap-2.5 border-2 px-[22px] py-4 font-mono text-[13px] tracking-[0.1em]"
              >
                {hero.primaryCtaLabel}
              </a>
              <a
                href={cvDoc}
                target="_blank"
                rel="noreferrer"
                className="bg-paper text-ink border-edge shadow-hard hard-lift inline-flex items-center gap-2.5 border-2 px-[22px] py-4 font-mono text-[13px] tracking-[0.1em]"
              >
                {hero.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <dl className="flex flex-col border-t border-[color:var(--rule)]">
            <div className="rule-y flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">BASED</dt>
              <dd className="font-mono text-xs text-ink">{location}</dd>
            </div>
            <div className="rule-y flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">STATUS</dt>
              <dd className="font-mono text-xs text-ink">{status}</dd>
            </div>
            <div className="rule-y flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">SHIPPED</dt>
              <dd className="font-mono text-xs text-ink">{shippedLabel}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2.5">
              <dt className="text-ink-3 font-mono text-[11px] tracking-[0.1em]">EMAIL</dt>
              <dd className="font-mono text-xs">
                <a href={`mailto:${email}`} className="border-accent-hot text-ink border-b-2">
                  {email.split('@')[0]}@
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-edge bg-ink mt-9 overflow-hidden border-t-2">
        <div className="ticker flex w-max">
          {[0, 1].map((dup) => (
            <span
              key={dup}
              aria-hidden={dup === 1}
              className="text-paper flex font-mono text-xs tracking-[0.16em] whitespace-nowrap"
            >
              {ticker.map((item, i) => (
                <span key={i} className="flex">
                  <span className="px-5 py-3.5">{item.message}</span>
                  <span className="text-accent-hot px-5 py-3.5">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
