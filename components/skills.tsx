import type { SiteSetting, StackGroup } from '@/payload-types'

const DEVICON_LOGOS = [
  {
    name: 'TypeScript',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'Node.js',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'Docker',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  {
    name: 'MongoDB',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg',
  },
  {
    name: 'PostgreSQL',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg',
  },
  {
    name: 'GraphQL',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain-wordmark.svg',
  },
  {
    name: 'Redis',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original-wordmark.svg',
  },
  { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
]

export function Skills({
  heading,
  groups,
}: {
  heading: SiteSetting['sectionHeadings']['stack']
  groups: StackGroup[]
}) {
  return (
    <section id="stack" className="border-edge bg-ink px-6 py-11 md:px-9">
      <div className="border-edge mb-0 flex flex-wrap items-end justify-between gap-5 border-b-2 pb-4.5">
        <div>
          <p className="label-mono text-accent-hot mb-1.5">{heading.eyebrow}</p>
          <h2 className="font-display text-paper text-[40px] leading-[0.9] md:text-[60px]">
            {heading.heading}
          </h2>
        </div>
        <p className="text-ink-2 max-w-[300px] text-[13px] leading-[1.6]">{heading.description}</p>
      </div>

      {groups.map((group, i) => (
        <div
          key={group.id}
          className="grid grid-cols-1 border-b border-[color:var(--rule)] md:grid-cols-[180px_1fr]"
        >
          <div className="border-[color:var(--rule)] py-5 md:border-r">
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="font-display text-paper text-[28px] leading-none">{group.label}</p>
          </div>
          <div className="flex flex-wrap content-center gap-2 py-5 md:pl-6">
            {group.items.map((item, idx) => (
              <span
                key={idx}
                className={
                  item.filled
                    ? 'bg-accent-hot text-on-accent px-2.5 py-2 font-mono text-[11px] font-semibold tracking-[0.06em]'
                    : 'text-ink-2 border-ink-2 border px-2.5 py-2 font-mono text-[11px] tracking-[0.06em]'
                }
              >
                {item.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6.5 flex items-center overflow-hidden border border-[color:var(--rule)]">
        {DEVICON_LOGOS.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element -- decorative third-party SVG icon strip, not a Next-optimizable local asset
          <img
            key={logo.name}
            src={logo.url}
            alt={logo.name}
            className="h-[42px] border-r border-[color:var(--rule)] px-5 py-3.5 opacity-80 grayscale brightness-[1.7] last:border-r-0"
          />
        ))}
      </div>
    </section>
  )
}
