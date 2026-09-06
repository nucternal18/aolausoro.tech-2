import { auth } from '@clerk/nextjs/server'
import '../../globals.css'
import 'highlight.js/styles/github-dark.css'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

// components
import { AdminLayoutWrapper } from './admin-layout-wrapper'

// redux global state
import { Providers } from '@components/admin-route-components/global-redux-store/providers'
import { getUser } from '@components/admin-route-components/actions/user'

export default async function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  const { isAuthenticated } = await auth()

  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return await getUser()
    },
  })

  if (!isAuthenticated) {
    return redirect('/')
  }

  return (
    <html>
      <body className="border-box bg-background m-0 flex flex-col scroll-smooth p-0 text-gray-800">
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  )
}
