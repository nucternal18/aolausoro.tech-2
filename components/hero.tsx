import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Typography } from './Typography'

export function Hero({ cvDoc }: { cvDoc: string }) {
  return (
    <section id="hero" className="mx-auto flex min-h-screen max-w-5xl items-center px-6 pt-20">
      <div className="max-w-3xl">
        <div className="space-y-6">
          <div>
            <Typography
              variant="small"
              className="font-semibold tracking-wider text-white/80 uppercase"
            >
              Welcome
            </Typography>
            <Typography
              variant="h1"
              className="mt-4 text-5xl leading-tight font-bold text-white/90 md:text-7xl"
            >
              Full-Stack Developer & Creative Problem Solver
            </Typography>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-white/80">
            I build beautiful, performant web applications from concept to deployment. Specializing
            in React, Next.js, and full-stack systems that solve real-world problems.
          </p>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Link
              href="#projects"
              className="bg-background text-primary inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              View My Work
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={cvDoc}
              target="_blank"
              className="border-border hover:bg-card hover:text-foreground inline-flex items-center justify-center rounded-lg border px-8 py-3 font-semibold text-white/80 transition-colors"
              rel="noreferrer"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
