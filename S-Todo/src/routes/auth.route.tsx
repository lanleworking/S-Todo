import { AuthLayout } from '@/layouts/AuthLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
