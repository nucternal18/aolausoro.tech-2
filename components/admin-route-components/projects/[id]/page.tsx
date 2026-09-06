import { getProjectById } from '@components/admin-route-components/actions/projects'
import { EditProject } from './edit-project'
import { Suspense } from 'react'
import Loader from '@components/Loader'

export default async function Page({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)
  return (
    <section className="flex h-screen w-full items-center overflow-y-auto px-11 py-4">
      <Suspense fallback={<Loader classes="w-8 h-8" />}>
        <EditProject project={project} />
      </Suspense>
    </section>
  )
}
