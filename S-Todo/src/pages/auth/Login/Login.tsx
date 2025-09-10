import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
// icon
import PersonIcon from '@mui/icons-material/Person'
import KeyIcon from '@mui/icons-material/Key'
import { useTranslation } from 'react-i18next'
import { validateForm } from '@/utils/validate/validateForm'
import Box from '@mui/material/Box'
import { Link, useNavigate } from '@tanstack/react-router'
import { EResetPasswordMode } from '@/constants/App'
import useAuth from '@/hooks/useAuth'
import { fetchError } from '@/utils/toast/fetchError'
import { useContext } from 'react'
import { AuthContext } from '@/providers/Context/AuthContext'

function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const { loginMutation } = useAuth()
  const { mutate, isPending } = loginMutation
  const { onSubmit, getInputProps, key } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) =>
        validateForm(value, t, {
          required: true,
          isNonWhitespace: true,
          maxLength: 20,
        }),
      password: (value) =>
        validateForm(value, t, {
          required: true,
          maxLength: 50,
        }),
    },
  })

  const handleLogin = (formData: any) => {
    mutate(formData, {
      onError: (error) => fetchError(error),
      onSuccess: (data) => {
        setUser(data)
        navigate({
          to: '/',
        })
      },
    })
  }

  return (
    <form onSubmit={onSubmit(handleLogin)}>
      <Stack gap={'xs'}>
        <TextInput
          disabled={isPending}
          {...getInputProps('username')}
          key={key('username')}
          style={{
            fontSize: '20px',
          }}
          styles={{
            input: {
              backgroundColor: 'transparent',
            },
          }}
          placeholder={t('username')}
          leftSection={<PersonIcon />}
        />
        <PasswordInput
          disabled={isPending}
          {...getInputProps('password')}
          key={key('password')}
          styles={{
            input: {
              backgroundColor: 'transparent',
            },
          }}
          placeholder={t('password')}
          leftSection={<KeyIcon />}
        />
        <Box
          color={'var(--primary-color)'}
          fontSize={'0.8rem'}
          textAlign={'right'}
        >
          <Link
            disabled={isPending}
            to="/auth/reset-password"
            search={{
              mode: EResetPasswordMode.FORGOT,
            }}
          >
            {t('forgotPassword')}
          </Link>
        </Box>
        <Button loading={isPending} type="submit">
          {t('login')}
        </Button>
        <Box
          color={'var(--primary-color)'}
          fontSize={'0.8rem'}
          textAlign={'center'}
        >
          <Link disabled={isPending} to="/auth/register">
            {t('register')}
          </Link>
        </Box>
      </Stack>
    </form>
  )
}

export default Login
