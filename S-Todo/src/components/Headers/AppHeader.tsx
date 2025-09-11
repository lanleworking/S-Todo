import { Avatar, Flex, Image, Menu, NavLink, Text } from '@mantine/core'
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
  const { setUser } = useContext(AuthContext)
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
      <Flex>
        {links.map((l, i) => (
          <NavLink
            key={i}
            style={{
              borderRadius: '8px',
            }}
            href={l.href}
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
            <Text>Full Name</Text>
            <Avatar src={null} name="Le Lan" color="initials" />
          </Flex>
        </Menu.Target>

        <Menu.Dropdown>
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
