// Components
import SearchForm from '@app/(protected)/admin/jobs/search-form'
import { JobsContainer } from '@app/(protected)/admin/jobs/Jobs'
import AddJobComponent from './add-job-component'
import Header from '@components/header'
import { getJobs } from '@components/admin-route-components/actions/jobs'
import type { JobsProps } from '@src/entities/models/Job'
import { Suspense } from 'react'
import Loader from '@components/Loader'

export default async function Jobs() {
  const jobs = await getJobs({})
  return (
    <section className="container mx-auto min-h-screen w-full py-4 sm:pl-11">
      <section className="container mx-auto mb-4 flex w-full items-center justify-between">
        <Header title="Jobs" order={1} />
        <AddJobComponent />
      </section>
      <section className="w-full">
        <SearchForm />
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <Loader classes="w-8 h-8" />
            </div>
          }
        >
          <JobsContainer jobs={jobs} />
        </Suspense>
      </section>
    </section>
  )
}
