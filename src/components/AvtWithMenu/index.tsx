import useAuth from '@/hooks/useAuth'
import { AuthContext } from '@/providers/Context/AuthContext'
import { fetchError } from '@/utils/toast/fetchError'
import { Avatar, Box, Flex, Group, Menu, Text } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { useContext } from 'react'

import { IoMdExit } from 'react-icons/io'
import { CiImageOn } from 'react-icons/ci'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { IoKeyOutline, IoLanguageOutline } from 'react-icons/io5'
import LangSwitch from '../Switch/LangSwitch'
import { useTranslation } from 'react-i18next'
import ChangeAvt from '../Modal/ChangeAvt'
import ChangePassModal from '../Modal/ChangePassModal'
import ChangeNameModal from '../Modal/ChangeNameModal'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'

type AvtWithMenuProps = {
  displayName?: boolean
}

function AvtWithMenu({ displayName }: AvtWithMenuProps) {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const { setUser, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { logOutMutation } = useAuth()
  const { mutate } = logOutMutation

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
      <Menu>
        <Menu.Target>
          <Box ta={'center'}>
            <Group gap={8}>
              {displayName && (
                <Text size={isMobile ? '0.8rem' : 'sm'}>
                  {user?.fullName || user?.userId}
                </Text>
              )}
              <Avatar
                size={isMobile ? '1.5rem' : 'md'}
                style={{
                  margin: '0 auto',
                  border: '1px solid var(--border-color)',
                }}
                src={user?.avatarUrl}
                name={user?.fullName}
                color="initials"
              />
            </Group>

            {isMobile && (
              <Text mt={4} hiddenFrom="sm" size="0.6rem">
                {t('me')}
              </Text>
            )}
          </Box>
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
    </>
  )
}

export default AvtWithMenu
