import axiosClient from '@/config/axios'
import { TodoItem } from '@/pages/todo/item'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/todo/$id/')({
  loader: async ({ params }) => {
    const todoId = params.id
    const res = await axiosClient.get(`/todo/${todoId}`)
    return res.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const todoItemData = useLoaderData({ from: '/todo/$id/' })
  console.log('todoItemData:', todoItemData)
  return <TodoItem data={todoItemData} />
}
