"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import Link from "next/link";
import { getLatestCV } from "@lib/utils";

import { Typography } from "@components/Typography";
import type { PartialCvProps } from "@src/entities/models/cv";
import { NetworkAnimation } from "@components/animations/network-animations";
import { MatrixRainAnimation } from "@components/animations";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function HomeComponent({ data }: { data: PartialCvProps[] }) {
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
      <div className=" relative w-full h-full flex justify-center items-center">
        <div className="container mx-auto px-4 py-16 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center place-content-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                className=" text-white mb-4 gap-2 text-justify "
              >
                Hi{" "}
                <motion.span
                  className="inline-block mx-2"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  👋
                </motion.span>
                , I'm Woyin.
              </Typography>

              <Typography variant="h3" className="font-thin text-white">
                <span>
                  A Full-Stack developer who enjoys developing real world
                  application from web to mobile to backend systems.
                </span>
              </Typography>
              <Typography variant="h2" className="mb-4 text-gray-300 text-3xl ">
                Welcome to My Portfolio!
              </Typography>
              <motion.button
                className="bg-white text-black px-6 py-2 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  data-testid="cv-button"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={cvDoc as string}
                >
                  My Resume
                </Link>
              </motion.button>
            </motion.div>
            <MatrixRainAnimation />
            {/* <NetworkAnimation /> */}
            {/* <div className="w-full h-64 md:h-96">
              <CodeAnimation />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
