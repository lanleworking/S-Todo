import AvtWithMenu from '@/components/AvtWithMenu'
import AppHeader from '@/components/Headers/AppHeader'
import { LINKS } from '@/constants/App'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import { AuthContext } from '@/providers/Context/AuthContext'
import { AppShell, Box, Flex, NavLink, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link, useRouter } from '@tanstack/react-router'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CiBoxList, CiCirclePlus } from 'react-icons/ci'
import { FaHouse } from 'react-icons/fa6'
import { RiListSettingsLine } from 'react-icons/ri'

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const path = router.state.location.pathname ?? ''

  const iconMenuSwitch = (type: string) => {
    switch (type) {
      case 'list':
        return <CiBoxList />
      case 'manage':
        return <RiListSettingsLine />
      case 'home':
        return <FaHouse />
      case 'create':
        return <CiCirclePlus />
      default:
        return null
    }
  }

  return (
    <AppShell
      header={{
        height: { base: 0, sm: 60 },
      }}
    >
      {!isMobile && (
        <AppShell.Header>
          <AppHeader />
        </AppShell.Header>
      )}

      {isMobile && (
        <AppShell.Footer>
          <Flex align={'center'} justify="space-around" py={10}>
            {LINKS.map((l, i) => (
              <NavLink
                leftSection={iconMenuSwitch(l.type)}
                hidden={l.notAllowRole === user?.role}
                component={Link}
                key={i}
                style={{
                  borderRadius: '8px',
                  width: 'fit-content',
                }}
                to={l.href}
                label={<Text size={'0.6rem'}>{t(l.label)}</Text>}
                styles={{
                  root: {
                    display: 'block',
                  },
                  section: {
                    marginBottom: '4px',
                    marginRight: 0,
                  },
                }}
                active={path === l.href}
              />
            ))}
            <AvtWithMenu />
          </Flex>
        </AppShell.Footer>
      )}
      <AppShell.Main pb={{ base: 60, sm: 0 }}>
        <Box
          px={{ base: 20, sm: 40 }}
          py={{ base: 20, sm: 0 }}
          mt={{ base: 0, sm: 20 }}
        >
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
