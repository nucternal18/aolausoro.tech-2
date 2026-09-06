import React, { Suspense } from 'react'
import { User } from './user'
import Loader from '@components/Loader'
import { getUser } from '@components/admin-route-components/actions/user'

export default async function Page() {
  const userData = await getUser()
  return (
    <section className="h-full w-full">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader classes="w-8 h-8" />
          </div>
        }
      >
        <User userData={userData} />
      </Suspense>
    </section>
  )
}
