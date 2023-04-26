import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { Card, CardBody, CardText, CardTitle } from "./Card";
import { techSkillsData } from "config/data";
import Button from "./Button";

function PortfolioCard({ doc }) {
  // map through the techSkilsData array and return the image url that matches the doc.techStack array.
  // if the doc.techStack array includes the tech.name.toLowerCase() then return the tech.iconUrl
  // ensure both the doc.techStack and tech.name.toLowerCase() are in lowercase
  const tecStackImgUrl = techSkillsData.map((tech) => {
    if (doc.techStack.includes(tech.name)) {
      return tech.iconUrl;
    }
  });

  return (
    <Card imgUrl={doc.url}>
      <CardBody>
        <CardTitle className="my-2 text-xl text-center">
          {doc.projectName}
        </CardTitle>

        <div className="flex items-center justify-center space-x-4 mx-auto my-4">
          {tecStackImgUrl.map((iconUrl: string, idx: number) => {
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
          })}
        </div>

        <CardText>
          <p className="text-center">{doc.description}</p>
        </CardText>

        <div className="my-2">
          <div className="flex items-center justify-between">
            <Button type="button" color="dark">
              <a href={doc.address} className="text-xs">
                Live Preview
              </a>
            </Button>
            <Button type="button" color="dark">
              <a
                href={doc.github}
                className="flex items-center justify-center space-x-1"
              >
                <FaGithub className="mr-1" />
                <span className="text-xs">Source Code</span>
              </a>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default PortfolioCard;
