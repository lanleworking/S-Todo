import { Avatar, Box, Flex, Image, Menu, NavLink, Text } from '@mantine/core'
import WebLogo from '@/assets/logos/Web_Logo.png'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import useAuth from '@/hooks/useAuth'
import { useContext } from 'react'
import { AuthContext } from '@/providers/Context/AuthContext'
import { fetchError } from '@/utils/toast/fetchError'
import { IoMdExit } from 'react-icons/io'
import { LINKS } from '@/constants/App'
import { CiImageOn } from 'react-icons/ci'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { IoKeyOutline, IoLanguageOutline } from 'react-icons/io5'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import ChangeAvt from '../Modal/ChangeAvt'
import ChangePassModal from '../Modal/ChangePassModal'
import ChangeNameModal from '../Modal/ChangeNameModal'
import { useTranslation } from 'react-i18next'
import LangSwitch from '../Switch/LangSwitch'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'

type AppHeaderProps = {
  burgerBtb?: React.ReactNode
}
function AppHeader({ burgerBtb }: AppHeaderProps) {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { setUser, user } = useContext(AuthContext)
  const { logOutMutation } = useAuth()
  const [openedChangeAvt, { open: openChangeAvt, close: closeChangeAvt }] =
    useDisclosure(false)
  const [
    openedChangePassModal,
    { open: openChangePassModal, close: closeChangePassModal },
  ] = useDisclosure(false)
  const [
    openedChangeNameModal,
    { open: openChangeNameModal, close: closeChangeNameModal },
  ] = useDisclosure(false)
  const { mutate } = logOutMutation

  const path = router.state.location.pathname ?? ''

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        setUser(null)
        navigate({
          to: '/auth/login',
        })
      },
      onError: (error) => fetchError(error),
    })
  }

  return (
    <>
      <ChangeAvt onClose={closeChangeAvt} opened={openedChangeAvt} />
      <ChangePassModal
        onClose={closeChangePassModal}
        opened={openedChangePassModal}
      />
      <ChangeNameModal
        onClose={closeChangeNameModal}
        opened={openedChangeNameModal}
      />
      <Flex h={'100%'} px={20} justify={'space-between'} align={'center'}>
        <Flex align={'center'} gap={24}>
          {burgerBtb}
          <Link to="/">
            <Image w={80} src={WebLogo} alt="Web Logo" />
          </Link>
        </Flex>

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

        <Menu>
          <Menu.Target>
            <Flex
              style={{
                cursor: 'pointer',
              }}
              gap={8}
              align={'center'}
            >
              <Avatar
                style={{
                  border: '1px solid var(--border-color)',
                }}
                src={user?.avatarUrl}
                name={user?.fullName}
                color="initials"
              />
            </Flex>
          </Menu.Target>
          <Menu.Dropdown>
            <Box ta={'center'} p={8}>
              <Text>{user?.fullName}</Text>
              <Text c="dimmed" size="xs">
                @{user?.userId}
              </Text>
            </Box>
            <Menu.Divider />
            <Menu.Label>{t('label.accountSettings')}</Menu.Label>
            <Menu.Item onClick={openChangeAvt} leftSection={<CiImageOn />}>
              {t('label.changeAvt')}
            </Menu.Item>
            <Menu.Item
              onClick={openChangeNameModal}
              leftSection={<MdDriveFileRenameOutline />}
            >
              {t('label.changeName')}
            </Menu.Item>
            <Menu.Item
              onClick={openChangePassModal}
              leftSection={<IoKeyOutline />}
            >
              {t('label.changePass')}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>{t('label.appSettings')}</Menu.Label>
            <Menu.Item leftSection={<IoLanguageOutline />}>
              <Flex align={'center'} justify={'space-between'}>
                <Text size="sm">{t('label.language')}</Text>
                <LangSwitch size="md" />
              </Flex>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={handleLogout}
              color="red"
              leftSection={<IoMdExit />}
            >
              {t('label.logOut')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </>
  )
}

export default AppHeader
