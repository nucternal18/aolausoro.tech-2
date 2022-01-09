import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { Card, CardBody, CardTitle } from "./Card";

function PortfolioCard({ doc }) {
  return (
    <Card>
      <div>
        <Image
          src={doc.url}
          alt="project"
          layout="intrinsic"
          width={500}
          height={350}
          quality={50}
          className="overflow-hidden"
        />
      </div>
      <CardBody>
        <div className="flex flex-col justify-evenly-between">
          <div className="flex-1">
            <div className="mb-2">
              <CardTitle className="my-2 text-xl text-center">
                {doc.projectName}
              </CardTitle>
              <div className="w-1/4 mx-auto border-b-2 border-yellow-400"></div>
            </div>
            {/* <div className='w-full mb-2'>
                <p className='text-sm text-center'>
                  {doc?.description}
                </p>
              </div> */}
          </div>

          <div className="flex items-center mx-auto my-2">
            {doc.techStack?.map((tech, idx) => (
              <div key={idx} className="mr-2 text-sm text-blue-400">
                {tech}
              </div>
            ))}
          </div>

          <div className="my-2 ">
            <div className="flex items-center justify-between">
              <a
                href={doc.address}
                className="px-2 py-1 text-gray-200 bg-gray-400 rounded-full"
              >
                Live Preview
              </a>
              <a
                href={doc.github}
                className="flex items-center px-2 py-1 text-gray-200 bg-gray-400 rounded-full"
              >
                <FaGithub className="mr-1" />
                <span>Source Code</span>
              </a>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default PortfolioCard;
