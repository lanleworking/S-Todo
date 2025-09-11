import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
