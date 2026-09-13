'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from '@components/ui/dialog'
import type { Media, Project } from '@/payload-types'
import RichText from '@/components/RichText'

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [activeImage, setActiveImage] = useState(0)

  const gallery = (project.appImages ?? [])
    .map((entry) => (typeof entry.image === 'object' ? (entry.image as Media) : null))
    .filter((m): m is Media => m !== null)

  const fallbackShot = typeof project.screenshot === 'object' ? (project.screenshot as Media) : null
  const images = gallery.length > 0 ? gallery : fallbackShot ? [fallbackShot] : []
  const activeShot = images[activeImage]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-ink/86" />
        <DialogContent className="border-edge shadow-hard-accent grid w-full max-w-[940px] translate-x-[-50%] translate-y-[-50%] gap-0 border-2 bg-paper p-0 md:grid-cols-[1.5fr_1fr]">
          <DialogTitle className="sr-only">{project.title}</DialogTitle>

          <div className="border-edge col-span-full flex items-stretch border-b-2">
            <div className="flex-1 px-5 py-4">
              <p className="font-mono text-[11px] tracking-[0.12em] text-ink-3">
                PROJECT · {new Date(project.createdAt).getFullYear()}
              </p>
              <h2 className="font-display text-ink text-[40px] leading-[0.95]">{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="border-edge hover:bg-ink hover:text-accent-hot flex w-[62px] flex-none items-center justify-center border-l-2 text-ink"
            >
              <X className="h-[22px] w-[22px]" />
            </button>
          </div>

          <div className="border-[color:var(--rule)] md:border-r">
            {activeShot?.url && (
              <div className="h-[340px] bg-[--tag-platform]">
                {/* eslint-disable-next-line @next/next/no-img-element -- variable aspect gallery image inside a fixed-height frame */}
                <img src={activeShot.url} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {images.length > 1 && (
              <div className="flex border-b border-[color:var(--rule)]">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`h-[72px] flex-1 border-r border-[color:var(--rule)] bg-[--tag-platform] font-mono text-[10px] text-ink-2 last:border-r-0 ${
                      i === activeImage ? 'outline-accent-hot -outline-offset-3 outline outline-3' : ''
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            )}
            <div className="p-5">
              <p className="label-mono mb-2.5 text-ink">THE BUILD</p>
              {project.longDescription ? (
                <RichText
                  data={project.longDescription}
                  enableGutter={false}
                  className="text-[15px] leading-[1.7] text-ink"
                />
              ) : (
                <p className="text-[15px] leading-[1.7] text-ink-2">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <dl className="border-b border-[color:var(--rule)]">
              <div className="flex justify-between gap-2.5 border-b border-[color:var(--rule)] px-4.5 py-3">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-ink-3">YEAR</dt>
                <dd className="font-mono text-xs text-ink">
                  {new Date(project.createdAt).getFullYear()}
                </dd>
              </div>
              <div className="flex justify-between gap-2.5 px-4.5 py-3">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-ink-3">STATUS</dt>
                <dd className="font-mono text-xs text-accent-text">
                  {project.published ? 'IN PRODUCTION' : 'IN PROGRESS'}
                </dd>
              </div>
            </dl>
            <div className="border-b border-[color:var(--rule)] p-4.5">
              <p className="label-mono mb-2.5 text-ink">STACK</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech, idx) => (
                  <span key={idx} className="chip bg-tag-framework">
                    {tech.technology}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-auto flex flex-col">
              {project.address && (
                <a
                  href={project.address}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-accent-hot text-on-accent border-edge flex items-center justify-between border-t-2 p-4.5 font-mono text-xs tracking-[0.1em]"
                >
                  VISIT LIVE SITE
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:bg-ink hover:text-accent-hot border-edge flex items-center justify-between border-t-2 p-4.5 font-mono text-xs tracking-[0.1em] text-ink"
                >
                  READ THE SOURCE
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
