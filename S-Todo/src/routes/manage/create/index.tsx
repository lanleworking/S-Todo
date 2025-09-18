import { CreateTodo } from '@/pages/todo/create'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateTodo />
}
