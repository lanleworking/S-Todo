import ManageTodo from '@/pages/manage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ManageTodo />
}
