import { Avatar, Flex, Image, Menu, Text } from '@mantine/core'
import WebLogo from '@/assets/logos/Web_Logo.png'
import LogoutIcon from '@mui/icons-material/Logout'
import { Link, useNavigate } from '@tanstack/react-router'
import useAuth from '@/hooks/useAuth'
import { useContext } from 'react'
import { AuthContext } from '@/providers/Context/AuthContext'
import { fetchError } from '@/utils/toast/fetchError'

function AppHeader() {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const { logOutMutation } = useAuth()
  const { mutate } = logOutMutation
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
    <Flex h={'100%'} px={20} justify={'space-between'} align={'center'}>
      <Link to="/">
        <Image w={80} src={WebLogo} alt="Web Logo" />
      </Link>

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
            leftSection={<LogoutIcon />}
          >
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  )
}

export default AppHeader
