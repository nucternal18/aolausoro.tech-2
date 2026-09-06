import { Suspense } from 'react'
import { getProjects } from '@components/admin-route-components/actions/projects'
import { ProjectsComponent } from './projects'
import Loader from '@components/Loader'

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <section className="container mx-auto h-screen w-full flex-grow space-y-4 p-2 sm:p-6">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <Loader classes="w-8 h-8" />
          </div>
        }
      >
        <ProjectsComponent projects={projects} />
      </Suspense>
    </section>
  )
}
