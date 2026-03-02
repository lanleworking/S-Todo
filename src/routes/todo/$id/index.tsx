import { useContext } from 'react'
import {
  createFileRoute,
  notFound,
  useLoaderData,
} from '@tanstack/react-router'
import type { ITodoData } from '@/constants/Data'
import MetaTag from '@/components/Meta'
import axiosClient from '@/config/axios'
import { TodoItem } from '@/pages/todo/item'
import { AuthContext } from '@/providers/Context/AuthContext'

export const Route = createFileRoute('/todo/$id/')({
  loader: async ({ params }: any) => {
    try {
      const todoId = params.id
      const res = await axiosClient.get(`/todo/${todoId}`)
      return res.data || {}
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 404 || status === 403) {
        throw notFound()
      }
      throw error
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const todoItemData = useLoaderData({ from: '/todo/$id/' }) as ITodoData
  const { user } = useContext(AuthContext)

  const isMember =
    todoItemData.createdBy === user?.userId ||
    todoItemData.users?.some((u) => u.userId === user?.userId)

  if (!isMember) {
    throw notFound()
  }

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
