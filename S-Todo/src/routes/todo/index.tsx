import axiosClient from '@/config/axios'
import { TodoListTable } from '@/pages/manage/TodoListTable'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/todo/')({
  loader: async () => {
    const res = await axiosClient.get('/todo/list')
    return res.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const todoList = useLoaderData({ from: '/todo/' })
  return <TodoListTable data={todoList} />
}
