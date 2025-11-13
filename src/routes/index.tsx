import MetaTag from '@/components/Meta'
import axiosClient from '@/config/axios'
import { listenForMessages, requestNotificationPermission } from '@/firebase'
import { MainLayout } from '@/layouts/MainLayout'
import HomePage from '@/pages/main/HomePage'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      const res = await axiosClient.get('/todo/recent')
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      console.error('Failed to load recent todos:', error)
      return []
    }
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
    <>
      <MetaTag
        title="Home | S-Todo"
        description="A Project made by Snw - Have Fun to use UwU"
      />
      <MainLayout>
        <HomePage todoData={todoData} />
      </MainLayout>
    </>
  )
}
