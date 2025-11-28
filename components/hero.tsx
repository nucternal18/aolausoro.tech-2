import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Typography } from "./Typography";

export function Hero({ cvDoc }: { cvDoc: string }) {
  return (
    <section
      id="hero"
      className="flex items-center px-6 pt-20 mx-auto max-w-5xl min-h-screen"
    >
      <div className="max-w-3xl">
        <div className="space-y-6">
          <div>
            <Typography
              variant="small"
              className="font-semibold tracking-wider uppercase text-white/80"
            >
              Welcome
            </Typography>
            <Typography
              variant="h1"
              className="mt-4 text-5xl font-bold leading-tight md:text-7xl text-white/90"
            >
              Full-Stack Developer & Creative Problem Solver
            </Typography>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-white/80">
            I build beautiful, performant web applications from concept to
            deployment. Specializing in React, Next.js, and full-stack systems
            that solve real-world problems.
          </p>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Link
              href="#projects"
              className="inline-flex gap-2 justify-center items-center px-8 py-3 font-semibold rounded-lg transition-opacity bg-background text-primary hover:opacity-90"
            >
              View My Work
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={cvDoc}
              target="_blank"
              className="inline-flex justify-center items-center px-8 py-3 font-semibold rounded-lg border transition-colors border-border text-white/80 hover:bg-card hover:text-foreground"
              rel="noreferrer"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
