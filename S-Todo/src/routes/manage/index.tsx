import axiosClient from '@/config/axios'
import { TodoListDrag } from '@/pages/manage/TodoListDrag'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/')({
  loader: async () => {
    const res = await axiosClient.get('/todo/all')
    return res.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const manageTodoData = useLoaderData({ from: '/manage/' })

  return <TodoListDrag manageTodoData={manageTodoData} />
}
