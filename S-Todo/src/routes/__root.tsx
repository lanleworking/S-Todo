import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/providers/Provider/AuthProvider'
import NotFound from '@/pages/not-found'
import { HelmetProvider } from 'react-helmet-async'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <HelmetProvider>
        <AuthProvider>
          <Toaster />
          <Outlet />
        </AuthProvider>
      </HelmetProvider>
    </>
  ),
  notFoundComponent: () => <NotFound />,
})
