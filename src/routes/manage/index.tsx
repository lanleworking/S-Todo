import axiosClient from '@/config/axios'
import { TodoListDrag } from '@/pages/manage/TodoListDrag'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/')({
  loader: async () => {
    try {
      const res = await axiosClient.get('/todo/all')
      // Ensure the returned data has the proper structure for IManageTodoData
      const data = res.data
      if (data && typeof data === 'object') {
        return data
      }
      return { NEW: [], DOING: [], DONE: [] }
    } catch (error) {
      console.error('Failed to load manage todo data:', error)
      return { NEW: [], DOING: [], DONE: [] }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const manageTodoData = useLoaderData({ from: '/manage/' })

  return <TodoListDrag manageTodoData={manageTodoData} />
}
