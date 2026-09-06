import { Suspense } from 'react'

// components
import Header from '@components/header'
import { MessagesComponent } from './messages'
import Loader from '@components/Loader'
import { getMessages } from '@components/admin-route-components/actions/messages'

export default async function Page() {
  const messages = await getMessages()
  return (
    <section className="container mx-auto h-screen w-full flex-grow space-y-4 p-2 sm:p-6">
      <Header title="Messages" order={1} />
      <Suspense
        fallback={
          <section className="container mx-auto flex h-full w-full max-w-screen-xl flex-grow items-center justify-center px-2">
            <Loader classes="w-8 h-8" />
          </section>
        }
      >
        <MessagesComponent messages={messages} />
      </Suspense>
    </section>
  )
}
