"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@components/ui/button";

import Link from "next/link";
import { getLatestCV } from "@lib/utils";

import { Typography } from "@components/Typography";
import type { PartialCvProps } from "@src/entities/models/cv";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function HomeComponent(data: PartialCvProps[]) {
  const cvDoc = getLatestCV(data);

  return (
    <section className="h-full w-full">
      <div className="absolute top-0 w-full" style={{ height: "100%" }}>
        <Image
          src={"/images/rahul-mishra-unsplash.jpg"}
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
      <div className=" relative w-full h-full">
        <motion.div
          className="p-8 opacity-75 container mx-auto max-w-screen-xl h-full"
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 2.0 }}
        >
          <div className="flex flex-col md:flex-row items-center h-full gap-2 w-full">
            <div className="p-2 sm:w-2/3">
              <div className="mx-auto mb-1 text-left w-full">
                <div className="grid grid-cols-1 text-white mb-4 gap-2 text-justify ">
                  <Typography
                    variant="h1"
                    className="grid grid-cols-1 text-white mb-4 gap-2 text-justify "
                  >
                    <span>Hi 👋, I'm Woyin.</span>
                  </Typography>
                  <Typography variant="h3" className="font-thin">
                    <span>
                      A Full-Stack developer who enjoys developing real world
                      application from web to mobile to backend systems.
                    </span>
                  </Typography>
                  <div className="border-b-2 border-yellow-400  "></div>
                </div>
              </div>
              <div className="w-full">
                <Typography
                  variant="h1"
                  className="mb-4 text-gray-300 text-3xl "
                >
                  Welcome to My Portfolio!
                </Typography>
              </div>
              <Button
                type="button"
                variant="outline"
                asChild
                className="text-sm font-semibold bg-transparent text-zinc-50 border border-zinc-50 cursor-pointer"
              >
                <Link
                  data-testid="cv-button"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={cvDoc as string}
                >
                  My Resume
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
