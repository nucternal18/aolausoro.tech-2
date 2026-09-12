'use client'

// components
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
  projectsTotalDocs,
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
      <div className="relative z-10">
        <Navbar nav={siteSettings.nav} email={siteSettings.contact.email} />
        <Hero
          cvDoc={cvUrl as string}
          hero={siteSettings.hero}
          ticker={siteSettings.ticker}
          location={siteSettings.contact.location}
          status={siteSettings.hero.statStatus}
          email={siteSettings.contact.email}
          projectsTotalDocs={projectsTotalDocs}
        />
        <div className="space-y-20">
          <PortfolioComponent projects={projects} />
          <Skills />
          <CTA />
        </div>
        <Footer siteSettings={siteSettings} />
      </div>
    </main>
  )
}
