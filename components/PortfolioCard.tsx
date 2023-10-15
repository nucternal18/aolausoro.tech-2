import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { techSkillsData } from "config/data";
import type { PartialProjectProps } from "schema/Project";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

function PortfolioCard({ project }: { project: PartialProjectProps }) {
  // map through the techSkilsData array and return the image url that matches the project?.techStack array.
  // if the project?.techStack array includes the tech.name.toLowerCase() then return the tech.iconUrl
  // ensure both the project?.techStack and tech.name.toLowerCase() are in lowercase
  const tecStackImgUrl = techSkillsData.map((tech) => {
    if (project?.techStack?.includes(tech.name)) {
      return tech.iconUrl;
    }
  });

  return (
    <Card className="w-[300px] relative grid grid-cols-1 border-primary">
      <CardHeader className="col-span-1">
        <CardTitle className="text-xl">{project?.projectName}</CardTitle>
      </CardHeader>
      <CardContent className="col-span-1 space-y-2">
        <Image
          src={project.url as string}
          alt={project.projectName as string}
          width={300}
          height={300}
        />
        <CardDescription>{project?.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1 col-span-1">
        <div className="flex items-center justify-center space-x-4 mx-auto my-2">
          {tecStackImgUrl.map((iconUrl: string | undefined, idx: number) => {
            if (iconUrl !== undefined) {
              return (
                <Image
                  key={`${idx}-stack`}
                  src={iconUrl}
                  width={40}
                  height={40}
                  alt="Stack icon"
                  quality={75}
                />
              );
            }
          })}
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Button type="button" asChild>
            <a
              href={project?.address}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs "
            >
              Live Preview
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={project?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1 text-xs"
            >
              <FaGithub className="mr-1" />
              <span className="text-xs">Source Code</span>
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PortfolioCard;
