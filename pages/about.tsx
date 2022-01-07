import React from "react";
import Image from "next/image";
import { Layout } from "../components/layout";
// import url from 'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1623533235/2C7EB02D-5902-4970-9807-43E09C9D5AED_1_201_a_mwr1ys.jpg'

const url =
  "https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1623533235/2C7EB02D-5902-4970-9807-43E09C9D5AED_1_201_a_mwr1ys.jpg";

const about = () => {
  return (
    <Layout title="aolausoro.tech - about">
      <section className="max-w-screen-lg px-2 md:px-0 pt-4 md:-pt-8 mx-auto">
        <div className="flex items-center justify-between px-2  text-gray-800 border-b-2 border-current dark:border-yellow-500 dark:text-gray-100">
          <h1 className="text-3xl font-bold tracking-wider md:text-5xl mb-2 dark:text-yellow-500">
            About Me
          </h1>
        </div>
      </section>
      <section className=" grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-screen-lg px-2 md:px-0 pt-4 mx-auto ">
        <div className="relative w-full h-72 md:w-['400px'] md:h-full  mb-5 border-2 border-current  rounded-sm dark:border-yellow-500">
          <Image
            src={url}
            alt="Profile picture"
            objectFit="cover"
            quality={75}
            layout="fill"
            className="rounded-sm"
          />
        </div>

        <div className=" leading-normal tracking-wider text-justify px-2 font-light text-block sm:subpixel-antialiased md:antialiased">
          <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Dad, husband, coffee lover, anime lover and technology enthusiast. I
            have always had a love for technology and computing. I took an
            interest in software development after signing up for a BSC in
            computing and IT. The first module required some basic understanding
            of the python programming language, so I decided to take a quick
            course in Python. I really enjoyed the course, so I got stuck in and
            started learning to code alongside my degree. I have cultivated a
            desire to build things and keep learning more technologies. The
            added bonus of being a developer is a fun and fulfilling career and
            there is always something new to learn. As a developer, there is
            always something new to learn. I am looking for a role as a Software
            developer at a company that provides ongoing training with an
            opportunity for growth and career advancements.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default about;
