import AppHeader from '@/components/Headers/AppHeader'
import { AppShell } from '@mantine/core'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{
        height: 60,
      }}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
