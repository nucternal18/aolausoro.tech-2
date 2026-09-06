import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { techSkillsData } from 'config/data'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { PartialProjectProps } from '@src/entities/models/Project'
import { ExternalLink, Github } from 'lucide-react'

function PortfolioCard({
  project,
  setSelectedProject,
}: {
  project: PartialProjectProps
  setSelectedProject: React.Dispatch<React.SetStateAction<PartialProjectProps | null>>
}) {
  // map through the techSkilsData array and return the image url that matches the project?.techStack array.
  // if the project?.techStack array includes the tech.name.toLowerCase() then return the tech.iconUrl
  // ensure both the project?.techStack and tech.name.toLowerCase() are in lowercase
  const tecStackImgUrl = techSkillsData.map((tech) => {
    if (project?.techStack?.includes(tech.name)) {
      return tech.iconUrl
    }
  })

  return (
    <Card
      className="group border-border hover:border-primary relative grid cursor-pointer grid-rows-[auto_1fr_auto] overflow-hidden rounded-lg border p-0 transition-colors duration-300"
      onClick={() => setSelectedProject(project)}
    >
      <CardHeader className="p-0">
        <div className="bg-card relative h-64 overflow-hidden">
          <Image
            src={project.url as string}
            alt={project.projectName as string}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="bg-card grid-rows-[auto_1fr_auto] space-y-2 p-6">
        <h3 className="text-foreground mb-2 text-xl font-bold">{project.projectName}</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack?.map((techStack, idx) => (
            <span
              key={idx}
              className="text-primary bg-primary/10 rounded-full px-3 py-1 text-xs font-semibold"
            >
              {techStack}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        {project.address && (
          <Button variant="outline" asChild>
            <a
              href={project.address}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-primary inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
              rel="noreferrer"
            >
              <span>Live Site</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {project.github && (
          <Button variant="outline" asChild>
            <a
              href={project.github}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              rel="noreferrer"
            >
              <span>Code</span>
              <FaGithub className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default PortfolioCard
