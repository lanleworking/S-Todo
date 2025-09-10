import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import { MainLayout } from '@/layouts/MainLayout'
import HomePage from '@/pages/main/HomePage'
import { useMediaQuery } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  if (isMobile) return <h1>Mobile UI is under development, please wait!</h1>
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  )
}
