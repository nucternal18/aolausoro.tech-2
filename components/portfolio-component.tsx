import React, { useState } from 'react'
import { FaGithub, FaChevronRight } from 'react-icons/fa'
import Link from 'next/link'
import Loader from './Loader'

// components
import PortfolioCard from '@components/portfolio-card'
import { Button } from '@components/ui/button'
import type { Project } from '@/payload-types'
import ProjectModal from './project-modal'
import { Typography } from './Typography'

export function PortfolioComponent({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const publishedProjects = projects?.filter((doc) => doc.published)
  return (
    <>
      <section id="projects" className="mx-auto max-w-5xl px-4 py-20 md:px-0">
        <div className="mb-12 space-y-4">
          <Typography className="text-sm font-semibold tracking-wider text-white/80 uppercase">
            Featured Work
          </Typography>
          <Typography variant="h2" className="text-4xl font-bold text-white/90 md:text-5xl">
            Selected Projects
          </Typography>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {publishedProjects.map((project, i) => (
            <PortfolioCard
              key={project.id}
              project={project}
              setSelectedProject={setSelectedProject}
            />
          ))}
        </div>
      </section>
      {selectedProject && (
        <ProjectModal
          title={selectedProject.title as string}
          description={selectedProject.description as string}
          longDescription={selectedProject.description as string}
          tags={selectedProject.techStack as string[]}
          image={selectedProject.url as string}
          appImages={[]}
          liveUrl={selectedProject.address as string}
          githubUrl={selectedProject.github as string}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
