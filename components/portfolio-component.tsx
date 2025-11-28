import React, { useState } from "react";
import { FaGithub, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Loader from "./Loader";

// components
import PortfolioCard from "@components/portfolio-card";
import { Button } from "@components/ui/button";
import type { PartialProjectProps } from "@src/entities/models/Project";
import ProjectModal from "./project-modal";
import { Typography } from "./Typography";

export function PortfolioComponent({
  projects,
}: {
  projects: PartialProjectProps[];
}) {
  const [selectedProject, setSelectedProject] =
    useState<PartialProjectProps | null>(null);
  const publishedProjects = projects?.filter((doc) => doc.published);
  return (
    <>
      <section id="projects" className="px-4 py-20 mx-auto max-w-5xl md:px-0">
        <div className="mb-12 space-y-4">
          <Typography className="text-sm font-semibold tracking-wider uppercase text-white/80">
            Featured Work
          </Typography>
          <Typography
            variant="h2"
            className="text-4xl font-bold md:text-5xl text-white/90"
          >
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
          title={selectedProject.projectName as string}
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
  );
}
