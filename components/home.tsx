"use client";

// utils
import { getLatestCV } from "@lib/utils";

// components
import { Typography } from "@components/Typography";
import { MatrixRainAnimation } from "@components/animations";
import { Navbar } from "./navigation/Navbar";
import { Hero } from "./hero";
import { Footer } from "./Footer";
import {PortfolioComponent} from "./portfolio-component";
import { Skills } from "./skills";

// types
import type {  Meta } from "types/index";
import type { PartialCvProps } from "@src/entities/models/cv";
import type { PartialProjectProps } from "@src/entities/models/Project";
import CTA from "./cta";


export default function HomeComponent({
  data,
  posts,
  projects,
}: {
  data: PartialCvProps[];
    posts: Meta[];
  projects: PartialProjectProps[];
}) {
  const cvDoc = getLatestCV(data);

  return (
    <main className="relative min-h-screen bg-background">
      <MatrixRainAnimation />
      <div className="relative z-10 space-y-20">
        <Navbar />
        <Hero cvDoc={cvDoc as string} />
        <PortfolioComponent projects={projects} />
        <Skills />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
