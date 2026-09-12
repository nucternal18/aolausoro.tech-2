import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import type { Media, Project } from '@/payload-types'

function PortfolioCard({
  project,
  index,
  lead = false,
  onSelect,
}: {
  project: Project
  index: number
  lead?: boolean
  onSelect: (project: Project) => void
}) {
  const screenshotUrl =
    typeof project.screenshot === 'object' ? (project.screenshot as Media).url : undefined

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project)
        }
      }}
      className="border-edge bg-paper shadow-hard hard-lift flex cursor-pointer flex-col border-2"
    >
      <div className="border-edge flex items-center justify-between gap-3 border-b-2 px-3.5 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink">
          {String(index).padStart(2, '0')}
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
          {new Date(project.createdAt).getFullYear()} · SOLO BUILD
        </span>
      </div>

      {screenshotUrl && (
        <div
          className={`border-edge relative border-b-2 bg-[--tag-platform] ${lead ? 'h-[300px]' : 'h-[150px]'}`}
        >
          <Image
            src={screenshotUrl}
            alt={project.title as string}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3.5 px-4.5 py-5">
        <h3
          className={`font-display text-ink ${lead ? 'text-[40px] leading-[0.95]' : 'text-[32px] leading-[0.95]'}`}
        >
          {project.title}
        </h3>
        <p className="text-ink-2 text-[15px] leading-[1.65]">{project.description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {project.techStack?.map((tech, idx) => (
            <span key={idx} className="chip bg-tag-framework">
              {tech.technology}
            </span>
          ))}
        </div>
      </div>

      <div className="border-edge flex border-t-2">
        {project.address && (
          <a
            href={project.address}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="border-edge hover:bg-accent-hot hover:text-on-accent flex flex-1 items-center justify-center gap-2.5 border-r-2 py-4 font-mono text-xs tracking-[0.1em] text-ink"
          >
            LIVE SITE
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:bg-accent-hot hover:text-on-accent flex flex-1 items-center justify-center gap-2.5 py-4 font-mono text-xs tracking-[0.1em] text-ink"
          >
            SOURCE
            <Github className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

export default PortfolioCard
