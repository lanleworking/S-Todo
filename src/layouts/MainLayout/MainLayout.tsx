import AvtWithMenu from '@/components/AvtWithMenu'
import AppHeader from '@/components/Headers/AppHeader'
import { LINKS } from '@/constants/App'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import { AuthContext } from '@/providers/Context/AuthContext'
import { AppShell, Box, Flex, Text, UnstyledButton } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link, useRouter } from '@tanstack/react-router'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CiBoxList } from 'react-icons/ci'
import { FaHouse } from 'react-icons/fa6'
import { RiListSettingsLine } from 'react-icons/ri'
import { MdHistory } from 'react-icons/md'

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const path = router.state.location.pathname ?? ''

  const iconMenuSwitch = (type: string) => {
    switch (type) {
      case 'list':
        return <CiBoxList size={20} />
      case 'manage':
        return <RiListSettingsLine size={20} />
      case 'home':
        return <FaHouse size={20} />
      case 'payment-history':
        return <MdHistory size={20} />
      default:
        return null
    }
  }

  const mobileLinks = LINKS.filter(
    (l) => !l.hideOnMobileFooter && l.notAllowRole !== user?.role,
  )

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
          <Flex
            align="stretch"
            h={58}
            style={{
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--mantine-color-body)',
            }}
          >
            {mobileLinks.map((l, i) => {
              // Leaf links use startsWith; parent links (that have children in the list) match exactly
              const hasChildren = mobileLinks.some(
                (other) =>
                  other.href !== l.href && other.href.startsWith(l.href + '/'),
              )
              const isActive =
                l.href === '/'
                  ? path === l.href
                  : hasChildren
                    ? path === l.href || path === l.href + '/'
                    : path.startsWith(l.href)
              return (
                <UnstyledButton
                  key={i}
                  component={Link}
                  to={l.href}
                  style={{ flex: 1 }}
                >
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap={3}
                    h="100%"
                    style={{
                      color: isActive
                        ? 'var(--primary-color)'
                        : 'var(--mantine-color-dimmed)',
                      transition: 'color 0.15s',
                    }}
                  >
                    {iconMenuSwitch(l.type)}
                    <Text
                      size="0.55rem"
                      fw={isActive ? 600 : 400}
                      ta="center"
                      lh={1.2}
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {t(l.label)}
                    </Text>
                  </Flex>
                </UnstyledButton>
              )
            })}

            {/* Me tab */}
            <Box style={{ flex: 1 }}>
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap={3}
                h="100%"
                style={{ color: 'var(--mantine-color-dimmed)' }}
              >
                <AvtWithMenu />
              </Flex>
            </Box>
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
