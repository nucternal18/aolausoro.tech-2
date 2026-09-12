'use client'

// components
import { MatrixRainAnimation } from '@components/animations'
import { Navbar } from './navigation/Navbar'
import { Hero } from './hero'
import { Footer } from './Footer'
import { PortfolioComponent } from './portfolio-component'
import { Skills } from './skills'
import CTA from './cta'

// types
import type { Cv, Post, Project, SiteSetting } from '@/payload-types'

export default function HomeComponent({
  cv,
  posts: _posts,
  projects,
  projectsTotalDocs: _projectsTotalDocs,
  siteSettings,
}: {
  cv: Cv | null
  posts: Post[]
  projects: Project[]
  projectsTotalDocs: number
  siteSettings: SiteSetting
}) {
  const cvUrl = cv?.url ?? undefined

  return (
    <main className="bg-background relative min-h-screen">
      <MatrixRainAnimation />
      <div className="relative z-10 space-y-20">
        <Navbar nav={siteSettings.nav} email={siteSettings.contact.email} />
        <Hero cvDoc={cvUrl as string} />
        <PortfolioComponent projects={projects} />
        <Skills />
        <CTA />
        <Footer siteSettings={siteSettings} />
      </div>
    </main>
  )
}
