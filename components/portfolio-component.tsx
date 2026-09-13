'use client'
import { useState } from 'react'

import PortfolioCard from '@components/portfolio-card'
import type { Project, SiteSetting } from '@/payload-types'
import ProjectModal from './project-modal'

export function PortfolioComponent({
  projects,
  heading,
}: {
  projects: Project[]
  heading: SiteSetting['sectionHeadings']['work']
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const publishedProjects = projects?.filter((doc) => doc.published)
  const [lead, ...rest] = publishedProjects
  const sideProjects = rest.slice(0, 2)

  return (
    <>
      <section id="work" className="border-edge bg-paper border-t-2 px-6 py-11 md:px-9">
        <div className="border-edge mb-7 flex flex-wrap items-end justify-between gap-5 border-b-2 pb-4.5">
          <div>
            <p className="label-mono text-ink-2 mb-1.5">{heading.eyebrow}</p>
            <h2 className="font-display text-ink text-[40px] leading-[0.9] md:text-[60px]">
              {heading.heading}
            </h2>
          </div>
          <p className="text-ink-2 max-w-[300px] text-[13px] leading-[1.6]">
            {heading.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {lead && (
            <div className="md:col-span-7">
              <PortfolioCard project={lead} index={1} lead onSelect={setSelectedProject} />
            </div>
          )}
          <div className="flex flex-col gap-6 md:col-span-5">
            {sideProjects.map((project, i) => (
              <PortfolioCard
                key={project.id}
                project={project}
                index={i + 2}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        </div>
      </section>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  )
}
