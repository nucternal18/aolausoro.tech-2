import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { techSkillsData } from "config/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import type { PartialProjectProps } from "@src/entities/models/Project";
import { ExternalLink, Github } from "lucide-react";

function PortfolioCard({
  project,
  setSelectedProject,
}: {
  project: PartialProjectProps;
  setSelectedProject: React.Dispatch<
    React.SetStateAction<PartialProjectProps | null>
  >;
}) {
  // map through the techSkilsData array and return the image url that matches the project?.techStack array.
  // if the project?.techStack array includes the tech.name.toLowerCase() then return the tech.iconUrl
  // ensure both the project?.techStack and tech.name.toLowerCase() are in lowercase
  const tecStackImgUrl = techSkillsData.map((tech) => {
    if (project?.techStack?.includes(tech.name)) {
      return tech.iconUrl;
    }
  });

  return (
    <Card
      className="overflow-hidden relative p-0 grid grid-rows-[auto_1fr_auto] rounded-lg border transition-colors duration-300 cursor-pointer group border-border hover:border-primary"
      onClick={() => setSelectedProject(project)}
    >
      <CardHeader className="p-0">
        <div className="overflow-hidden relative h-64 bg-card">
          <Image
            src={project.url as string}
            alt={project.projectName as string}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={300}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="grid-rows-[auto_1fr_auto] p-6 space-y-2 bg-card">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          {project.projectName}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack?.map((techStack, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-semibold rounded-full text-primary bg-primary/10"
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
              className="inline-flex gap-2 items-center text-sm font-semibold transition-all text-primary hover:gap-3"
              rel="noreferrer"
            >
             <span >Live Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
        {project.github && (
          <Button variant="outline" asChild>
            <a
              href={project.github}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex gap-2 items-center text-sm font-semibold transition-colors text-muted-foreground hover:text-primary"
              rel="noreferrer"
            >
              <span>Code</span>
              <FaGithub className="w-4 h-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default PortfolioCard;
