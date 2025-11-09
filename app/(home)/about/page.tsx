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
    <section className="mx-auto mb-6 max-w-3xl h-full grow text-primary">
      <section className="px-2 pt-4 mx-auto max-w-3xl md:px-0 md:-pt-8">
        <div className="flex justify-between items-center px-2 border-b-2 border-current dark:border-primary">
          <h1 className="mb-2 text-3xl font-bold tracking-wider md:text-5xl">
            About Me
          </h1>
        </div>
      </section>
      <section className="grid relative gap-2 justify-items-center px-2 pt-4 w-full h-full content gird-cols-1 md:px-0">
        <Image
          src={url}
          alt="Profile picture"
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
          quality={75}
          className="float-left mx-2 mt-8 rounded-full border-4 drop-shadow-xl border-primary shadow-black"
        />

        <article className="col-span-1 px-2 mb-4 space-y-4 font-light tracking-wider leading-normal text-justify text-block sm:subpixel-antialiased md:antialiased">
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            🎓 Computing and IT (Software) Graduate | 2.1 BSc Hons | Software
            Developer 🚀 | Security Engineer
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            Hello, and thank you for visiting my portfolio!👋 I am a Software
            Developer 🚀 with a passion for creating innovative solutions
            through software development. Armed with over 2 years experience as
            a fullstack developer and a solid foundation from a Bachelor's
            degree in Computing and IT (Software), I am eager to contribute my
            skills and knowledge to the dynamic field of technology.
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            🌟 Key Highlights:
          </p>
          <ul className="space-y-1 max-w-full list-disc list-inside text-gray-500 dark:text-gray-400">
            <li>
              🎓 Graduated with a 2.1 BSc Hons in Computing and IT (Software).
            </li>
            <li>💻 2 years of hands-on experience in software development.</li>
            <li>
              🚀 Experienced in ReactJS, React Native, JavaScript, TypeScript
              and NodeJS.
            </li>
          </ul>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            🔨 Project Experience:
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            During my academic journey and professional experience, I've had the
            opportunity to work on diverse projects, honing my skills and
            gaining valuable insights into the software development lifecycle.
            From conceptualization to implementation, I thrive in collaborative
            environments that foster creativity and innovation.
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            🚀 Why Work With Me:
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            I am a proactive problem solver, always eager to take on new
            challenges and learn emerging technologies. My dedication to
            delivering high-quality, efficient, and scalable solutions is
            complemented by my ability to adapt quickly to evolving project
            requirements.
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            🔗 Let's Connect:
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            I am excited about the prospect of connecting with like-minded
            professionals, mentors, and potential collaborators. Whether you
            have advice to share, opportunities to discuss, or just want to
            connect over our shared passion for technology, I would love to hear
            from you!
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            Feel free to reach out, and let's explore how we can collaborate to
            make a positive impact through technology. 🚀
          </p>
          <p className="mb-2 space-y-2 text-lg font-semibold md:text-xl">
            #SoftwareDeveloper #RecentGraduate #ReactJS #ReactNative #JavaScript
            #NodeJS #TechEnthusiast
          </p>
        </article>
        <section className="cols-span-1">
          <div className="flex justify-between items-center px-2 border-b-2 border-current dark:border-primary">
            <h2 className="mb-2 text-2xl font-bold tracking-wider sm:text-3xl md:text-4xl">
              Tech Stack and Tools I Use
            </h2>
          </div>
          <div className="grid grid-cols-6 w-full sm:grid-cols-8 md:grid-cols-10 md:gap-4">
            {techSkillsData.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex justify-center items-center m-2"
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
