import axiosClient from '@/config/axios'
import { TodoListTable } from '@/pages/manage/TodoListTable'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/todo/')({
  loader: async () => {
    try {
      const res = await axiosClient.get('/todo/list')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      console.error('Failed to load todo list:', error)
      return []
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const todoList = useLoaderData({ from: '/todo/' })
  return <TodoListTable data={todoList} />
}
