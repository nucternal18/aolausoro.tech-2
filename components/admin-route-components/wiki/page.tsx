import React from 'react'

import { WikiComponent } from './wiki-component'
import { getWiki } from '@components/admin-route-components/actions/wiki'

export default async function Page() {
  const wikis = await getWiki()
  return (
    <section className="container mx-auto h-screen w-full flex-grow space-y-4 p-2 sm:p-6">
      {Array.isArray(wikis) && wikis.length > 0 ? (
        <WikiComponent wikis={wikis} />
      ) : (
        <div className="flex h-full items-center justify-center text-center">
          <div className="text-lg font-semibold">
            {'message' in wikis ? wikis.message : 'No wikis found'}
          </div>
        </div>
      )}
    </section>
  )
}
