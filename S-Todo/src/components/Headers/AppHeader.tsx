import { Flex, Image, NavLink } from '@mantine/core'
import WebLogo from '@/assets/logos/Web_Logo.png'
import { Link, useRouter } from '@tanstack/react-router'
import { useContext } from 'react'
import { AuthContext } from '@/providers/Context/AuthContext'
import { LINKS } from '@/constants/App'

import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import AvtWithMenu from '../AvtWithMenu'

function AppHeader() {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const path = router.state.location.pathname ?? ''

  return (
    <>
      <Flex h={'100%'} px={20} justify={'space-between'} align={'center'}>
        <Link to="/">
          <Image w={80} src={WebLogo} alt="Web Logo" />
        </Link>

        {/* nav */}
        {!isMobile && (
          <Flex gap={8}>
            {LINKS.map((l, i) => (
              <NavLink
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
          </Flex>
        )}

        <AvtWithMenu />
      </Flex>
    </>
  )
}

export default AppHeader
