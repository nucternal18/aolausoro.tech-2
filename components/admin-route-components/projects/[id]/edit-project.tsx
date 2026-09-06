'use client'

import { useRouter } from 'next/navigation'

// Components
import Loader from '@components/Loader'
import { Button } from '@components/ui/button'
import { EditProjectForm } from '../edit-project-form'

// controller
import useProjectController from '../use-project-controller'
import type { PartialProjectProps } from '@src/entities/models/Project'

export function EditProject({ project }: { project: PartialProjectProps }) {
  const router = useRouter()

  return (
    <section className="flex w-full items-center p-4">
      <div className="mt-20 mb-4 w-full items-center overflow-hidden rounded p-6 shadow-lg dark:shadow-none">
        <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
          <h3 className="mb-2 text-center text-2xl font-bold md:text-4xl dark:text-gray-300">
            Update project
          </h3>
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
        <EditProjectForm project={project} />
      </div>
    </section>
  )
}
