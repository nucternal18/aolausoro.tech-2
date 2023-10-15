import React from "react";
import Image from "next/image";
import { techSkillsData } from "config/data";

export const metadata = {
  title: "aolausoro.tech - about",
};

const url =
  "https://res.cloudinary.com/dus5nxe5w/image/upload/e_auto_color,q_80,r_30/v1684008562/Screenshot_2023-05-13_at_21.06.25_aerrka.webp";

const about = () => {
  return (
    <section className="mx-auto h-full flex-grow max-w-screen-md mb-6 text-primary">
      <section className="max-w-screen-lg px-2 md:px-0 pt-4 md:-pt-8 mx-auto">
        <div className="flex items-center justify-between px-2   border-b-2 border-current dark:border-primary ">
          <h1 className="text-3xl font-bold tracking-wider md:text-5xl mb-2 ">
            About Me
          </h1>
        </div>
      </section>
      <section className="content relative w-full h-full grid gird-cols-1 gap-2 px-2 md:px-0 pt-4 justify-items-center ">
        <Image
          src={url}
          alt="Profile picture"
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
          quality={75}
          className="border-4 float-left border-primary drop-shadow-xl shadow-black rounded-full mx-2 mt-8"
        />

        <article className="col-span-1 leading-normal tracking-wider text-justify px-2 mb-4 font-light text-block sm:subpixel-antialiased md:antialiased">
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            I am a software developer with experience in ReactJS, React Native,
            JavaScript, and NodeJS. I enjoy building high-performing and
            responsive web and mobile applications, and I am passionate about
            solving complex problems and collaborating with others.
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold ">
            In addition to being a developer, I am also a dad, husband, coffee
            lover, anime lover, and technology enthusiast. I have always had a
            love for technology and computing, and I pursued software
            development after signing up for a BSC in computing and IT. Since
            then, I have continued to learn and develop my skills, always
            looking for new technologies to master.
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            As a developer, I believe that there is always something new to
            learn. I am seeking a role as a software developer at a company that
            values ongoing training and development, and that offers
            opportunities for growth and career advancement. Please take a look
            at my portfolio and feel free to get in touch!
          </p>
        </article>
        <section className="cols-span-1">
          <div className="flex items-center justify-between px-2   border-b-2 border-current dark:border-primary">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wider md:text-4xl mb-2 ">
              Tech Stack and Tools I Use
            </h2>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 md:gap-4 w-full">
            {techSkillsData.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center justify-center m-2"
              >
                <Image
                  src={skill.iconUrl}
                  width={50}
                  height={50}
                  alt="Skill icon"
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
};

export default about;
