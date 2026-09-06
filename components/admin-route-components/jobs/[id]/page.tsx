import { Suspense } from 'react'
// component
import Header from '@components/header'
import EditJobComponent from './EditJobComponent'
import { Button } from '@components/ui/button'
import Loader from '../../../../../components/Loader'
import type { PartialJobProps } from '@src/entities/models/Job'
import { getJobById } from '@components/admin-route-components/actions/jobs'

// redux

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params
  const job = await getJobById(id)
  return (
    <section className="container mx-auto min-h-screen w-full p-4">
      <section className="mb-4 flex w-full items-center justify-between">
        <Header title="Edit Job" order={1} />
        <Button variant={'outline'} className="w-ful text-primary border-primary sm:w-1/3 md:w-1/4">
          Go Back
        </Button>
      </section>
      <Suspense fallback={<Loader classes="w-8 h-8" />}>
        <EditJobComponent job={job} />
      </Suspense>
    </section>
  )
}
