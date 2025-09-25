import AppHeader from '@/components/Headers/AppHeader'
import { LINKS } from '@/constants/App'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import { AuthContext } from '@/providers/Context/AuthContext'
import { AppShell, Box, Burger, NavLink, Stack } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Link, useRouter } from '@tanstack/react-router'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CiBoxList } from 'react-icons/ci'
import { RiListSettingsLine } from 'react-icons/ri'

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const [opened, { toggle }] = useDisclosure(false)
  const path = router.state.location.pathname ?? ''

  return (
    <AppShell
      header={{
        height: 60,
      }}
      navbar={
        isMobile
          ? {
              width: 100,
              breakpoint: 'sm',
              collapsed: {
                mobile: !opened,
              },
            }
          : undefined
      }
    >
      <AppShell.Header>
        <AppHeader
          burgerBtb={
            <Burger onClick={toggle} hiddenFrom="sm" opened={opened} />
          }
        />
      </AppShell.Header>
      {isMobile && (
        <AppShell.Navbar p="md">
          <Stack>
            {LINKS.map((l, i) => (
              <NavLink
                leftSection={
                  l.type === 'list' ? <CiBoxList /> : <RiListSettingsLine />
                }
                hidden={l.notAllowRole === user?.role}
                component={Link}
                key={i}
                style={{
                  borderRadius: '8px',
                  width: 'fit-content',
                }}
                to={l.href}
                label={t(l.label)}
                active={path.includes(l.href)}
              />
            ))}
          </Stack>
        </AppShell.Navbar>
      )}
      <AppShell.Main>
        <Box px={{ base: 20, sm: 40 }} mt={20}>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
