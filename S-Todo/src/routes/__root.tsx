import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/providers/Provider/AuthProvider'
import NotFound from '@/pages/not-found'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <AuthProvider>
        <Toaster />
        <Outlet />
      </AuthProvider>
    </>
  ),
  notFoundComponent: () => <NotFound />,
})
