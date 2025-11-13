import MetaTag from '@/components/Meta'
import axiosClient from '@/config/axios'
import type { ITodoData } from '@/constants/Data'
import { TodoItem } from '@/pages/todo/item'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/todo/$id/')({
  loader: async ({ params }: any) => {
    try {
      const todoId = params.id
      const res = await axiosClient.get(`/todo/${todoId}`)
      return res.data || {}
    } catch (error) {
      console.error('Failed to load todo item:', error)
      throw error // Re-throw to let TanStack Router handle the error
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const todoItemData = useLoaderData({ from: '/todo/$id/' }) as ITodoData
  return (
    <>
      <MetaTag
        title={`Todo | ${todoItemData.title}`}
        description={todoItemData.shortDescription}
      />
      <TodoItem data={todoItemData} />
    </>
  )
}
