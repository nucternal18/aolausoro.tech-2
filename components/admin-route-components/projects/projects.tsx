'use client'

// Components
import Table from '@components/admin-route-components/projects/project-table'
import Loader from '@components/Loader'
import { AddProjectForm } from './add-project-form'
import Header from '@components/header'

// controller
import useProjectController from './use-project-controller'
import type { PartialProjectProps } from '@src/entities/models/Project'

export function ProjectsComponent({ projects }: { projects: PartialProjectProps[] }) {
  return (
    <section className="w-full py-4 sm:pl-11">
      <div className="mb-4 flex w-full items-center justify-between overflow-hidden">
        <Header title="Projects" order={1} />
        <AddProjectForm />
      </div>
      <Table projects={projects} />
    </section>
  )
}
