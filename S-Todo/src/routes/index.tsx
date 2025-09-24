import axiosClient from '@/config/axios'
import { MainLayout } from '@/layouts/MainLayout'
import HomePage from '@/pages/main/HomePage'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    const res = await axiosClient.get('/todo/recent')
    return res.data
  },
  component: App,
})

function App() {
  const todoData = useLoaderData({ from: '/' })
  // const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  // if (isMobile) return <h1>Mobile UI is under development, please wait!</h1>
  return (
    <MainLayout>
      <HomePage todoData={todoData} />
    </MainLayout>
  )
}
