import axiosClient from '@/config/axios'
import type { ISelectOption } from '@/constants/Data'
import { CreateTodo } from '@/pages/todo/create'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/create/')({
  loader: async () => {
    try {
      const res = await axiosClient.get('/user/options')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      console.error('Failed to load user options:', error)
      return []
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const userOptions = useLoaderData({
    from: '/manage/create/',
  }) as ISelectOption[]
  return <CreateTodo userOptionsData={userOptions} />
}
