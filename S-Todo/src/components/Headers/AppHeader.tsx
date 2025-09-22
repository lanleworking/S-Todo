import { Avatar, Box, Flex, Image, Menu, NavLink, Text } from '@mantine/core'
import WebLogo from '@/assets/logos/Web_Logo.png'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import useAuth from '@/hooks/useAuth'
import { useContext } from 'react'
import { AuthContext } from '@/providers/Context/AuthContext'
import { fetchError } from '@/utils/toast/fetchError'
import { IoMdExit } from 'react-icons/io'
function AppHeader() {
  const router = useRouter()
  const navigate = useNavigate()
  const { setUser, user } = useContext(AuthContext)
  const { logOutMutation } = useAuth()
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

  const links = [
    {
      href: '/todo',
      label: 'Todo List',
    },
    {
      href: '/manage',
      label: 'Manage Todo',
    },
  ]

  return (
    <Flex h={'100%'} px={20} justify={'space-between'} align={'center'}>
      <Link to="/">
        <Image w={80} src={WebLogo} alt="Web Logo" />
      </Link>

      {/* nav */}
      <Flex gap={8}>
        {links.map((l, i) => (
          <NavLink
            component={Link}
            key={i}
            style={{
              borderRadius: '8px',
              width: 'fit-content',
            }}
            to={l.href}
            label={l.label}
            active={path.includes(l.href)}
          />
        ))}
      </Flex>

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
          <Menu.Item
            onClick={handleLogout}
            color="red"
            leftSection={<IoMdExit />}
          >
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  )
}

export default AppHeader
