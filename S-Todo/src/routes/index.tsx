import axiosClient from '@/config/axios'
import { listenForMessages, requestNotificationPermission } from '@/firebase'
import { MainLayout } from '@/layouts/MainLayout'
import HomePage from '@/pages/main/HomePage'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  loader: async () => {
    const res = await axiosClient.get('/todo/recent')
    return res.data
  },
  component: App,
})

function App() {
  const todoData = useLoaderData({ from: '/' })

  useEffect(() => {
    requestNotificationPermission().catch((err) => {
      console.error('Notification permission denied:', err)
    })

    listenForMessages()
  }, [])

  return (
    <MainLayout>
      <HomePage todoData={todoData} />
    </MainLayout>
  )
}
