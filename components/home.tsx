'use client'

// components
import { Hero } from './hero'
import { Footer } from './Footer'
import { PortfolioComponent } from './portfolio-component'
import { Skills } from './skills'
import CTA from './cta'

// types
import type { Cv, Post, Project, SiteSetting, StackGroup } from '@/payload-types'

export default function HomeComponent({
  cv,
  posts: _posts,
  projects,
  projectsTotalDocs,
  siteSettings,
  stackGroups,
}: {
  cv: Cv | null
  posts: Post[]
  projects: Project[]
  projectsTotalDocs: number
  siteSettings: SiteSetting
  stackGroups: StackGroup[]
}) {
  const cvUrl = cv?.url ?? undefined

  return (
    <main className="bg-background relative min-h-screen">
      <div className="relative z-10">
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
          <PortfolioComponent projects={projects} heading={siteSettings.sectionHeadings.work} />
          <Skills heading={siteSettings.sectionHeadings.stack} groups={stackGroups} />
          <CTA cta={siteSettings.cta} email={siteSettings.contact.email} cvUrl={cvUrl} />
        </div>
        <Footer siteSettings={siteSettings} />
      </div>
    </main>
  )
}
