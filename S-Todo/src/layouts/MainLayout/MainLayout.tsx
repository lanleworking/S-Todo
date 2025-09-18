import AppHeader from '@/components/Headers/AppHeader'
import { AppShell, Box } from '@mantine/core'

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
      <AppShell.Main>
        <Box px={40} mt={20}>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
