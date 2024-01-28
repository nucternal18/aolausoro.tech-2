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

        <article className="col-span-1 leading-normal tracking-wider text-justify px-2 mb-4 space-y-4 font-light text-block sm:subpixel-antialiased md:antialiased">
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            🎓 Recent Computing and IT (Software) Graduate | 2.1 BSc Hons |
            Software Developer 🚀
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            Hello, and thank you for visiting my portfolio!👋 I am a recent
            graduate with a passion for creating innovative solutions through
            software development. Armed with a solid foundation from my
            Bachelor's degree in Computing and IT (Software), I am eager to
            contribute my skills and knowledge to the dynamic field of
            technology.
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            🌟 Key Highlights:
          </p>
          <ul className="max-w-full space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
            <li>
              🎓 Graduated with a 2.1 BSc Hons in Computing and IT (Software).
            </li>
            <li>💻 2 years of hands-on experience in software development.</li>
            <li>
              🚀 Proficient in ReactJS, React Native, JavaScript, and NodeJS.
            </li>
          </ul>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            🔨 Project Experience:
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            During my academic journey and professional experience, I've had the
            opportunity to work on diverse projects, honing my skills and
            gaining valuable insights into the software development lifecycle.
            From conceptualization to implementation, I thrive in collaborative
            environments that foster creativity and innovation.
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            🚀 Why Work With Me:
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            I am a proactive problem solver, always eager to take on new
            challenges and learn emerging technologies. My dedication to
            delivering high-quality, efficient, and scalable solutions is
            complemented by my ability to adapt quickly to evolving project
            requirements.
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            🔗 Let's Connect:
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            I am excited about the prospect of connecting with like-minded
            professionals, mentors, and potential collaborators. Whether you
            have advice to share, opportunities to discuss, or just want to
            connect over our shared passion for technology, I would love to hear
            from you!
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            Feel free to reach out, and let's explore how we can collaborate to
            make a positive impact through technology. 🚀
          </p>
          <p className="mb-2 text-lg md:text-xl space-y-2 font-semibold  ">
            #SoftwareDeveloper #RecentGraduate #ReactJS #ReactNative #JavaScript
            #NodeJS #TechEnthusiast
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
