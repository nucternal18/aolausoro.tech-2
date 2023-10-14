"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@components/ui/button";

const randomImage =
  "https://source.unsplash.com/random/1600x900/?coder-setup,code";

const cvDoc =
  "https://res.cloudinary.com/dus5nxe5w/image/upload/v1682539569/Adewoyin_Oladipupo-Usoro_CV_fnqnq1.pdf";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function HomeComponent() {
  return (
    <>
      <div className="absolute top-0 w-full" style={{ height: "100%" }}>
        <Image
          src={randomImage}
          alt="home background image"
          quality={75}
          fill
          priority
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          className="h-full"
        />
        <span
          id="blackOverlay"
          className="absolute w-full h-full bg-black opacity-75"
        ></span>
      </div>
      <div className="container relative mx-auto">
        <div className="flex flex-wrap items-center justify-center ">
          <motion.div
            className="p-8 opacity-75 "
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 2.0 }}
          >
            <div className="flex flex-col md:flex-row gap-2 max-w-screen-lg md:max-w-screen-md">
              <div className="p-2 sm:w-2/3">
                <div className="mx-auto mb-1 text-left w-full">
                  <div>
                    <h1 className="grid grid-cols- mb-4 text-lg sm:text-3xl gap-2 font-thin text-gray-300 md:text-4xl text-justify ">
                      <span>Hi 👋, I'm Woyin.</span>
                      <span>
                        A Full-Stack developer who enjoys developing real world
                        application from web to mobile to backend systems.
                      </span>
                    </h1>
                    <div className="border-b-2 border-yellow-400  "></div>
                  </div>
                </div>
                <div className="w-full">
                  <h1 className="mb-4 text-2xl font-thin text-gray-300 md:text-5xl ">
                    Welcome to My Portfolio!
                  </h1>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="text-sm font-semibold bg-transparent text-zinc-50 border border-zinc-50"
                >
                  <a
                    data-testid="cv-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={cvDoc}
                  >
                    My Resume
                  </a>
                </Button>
              </div>
              <div></div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
