import { UploadAvtBtn } from '@/components/Buttons/UploadAvtBtn'
import { Button, Grid, PasswordInput, TextInput } from '@mantine/core'
import Box from '@mui/material/Box'
import { Link, useNavigate } from '@tanstack/react-router'

import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import KeyIcon from '@mui/icons-material/Key'
import { useForm } from '@mantine/form'
import { validateForm } from '@/utils/validate/validateForm'
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { fetchError } from '@/utils/toast/fetchError'
import { AuthContext } from '@/providers/Context/AuthContext'

function Register() {
  const [avtFile, setAvtFile] = useState<File | null>(null)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const { registerMutation } = useAuth()
  const { mutate, isPending } = registerMutation
  const { onSubmit, key, getInputProps } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      userId: '',
      password: '',
      email: '',
      fullName: '',
    },
    validate: {
      userId: (value) =>
        validateForm(value, t, {
          minLength: 3,
          maxLength: 50,
          isNonWhitespace: true,
        }),
      password: (value) =>
        validateForm(value, t, {
          minLength: 6,
          maxLength: 50,
        }),
      email: (value) =>
        validateForm(value, t, {
          required: false,
          isEmail: true,
          maxLength: 50,
        }),
      fullName: (value) =>
        validateForm(value, t, {
          required: false,
          maxLength: 50,
        }),
    },
  })

  // OnSubmit
  const handleRegister = (formData: any, avtFile: File | null) => {
    const inputData = {
      ...formData,
      avtFile,
    }
    mutate(inputData, {
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
    <Box>
      <form onSubmit={onSubmit((values) => handleRegister(values, avtFile))}>
        <Box display={'flex'} justifyContent={'center'}>
          <UploadAvtBtn setAvtFile={setAvtFile} />
        </Box>
        <Grid align="end">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              disabled={isPending}
              styles={{
                input: {
                  backgroundColor: 'var(--auth-input-bg-color)',
                },
              }}
              key={key('userId')}
              {...getInputProps('userId')}
              label="Username"
              placeholder="Username"
              description={t('usernameDescription')}
              leftSection={<PersonIcon />}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <PasswordInput
              disabled={isPending}
              styles={{
                input: {
                  backgroundColor: 'var(--auth-input-bg-color)',
                },
              }}
              key={key('password')}
              {...getInputProps('password')}
              label={t('password')}
              placeholder={t('password')}
              leftSection={<KeyIcon />}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              disabled={isPending}
              styles={{
                input: {
                  backgroundColor: 'var(--auth-input-bg-color)',
                },
              }}
              key={key('fullName')}
              {...getInputProps('fullName')}
              label={t('fullName')}
              placeholder={t('fullName')}
              leftSection={<EmailIcon />}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              disabled={isPending}
              styles={{
                input: {
                  backgroundColor: 'var(--auth-input-bg-color)',
                },
              }}
              key={key('email')}
              {...getInputProps('email')}
              label={t('email')}
              placeholder={t('email')}
              leftSection={<EmailIcon />}
            />
          </Grid.Col>
        </Grid>
        <Button loading={isPending} mt={20} mb={12} fullWidth type="submit">
          {t('register')}
        </Button>
        <Box fontSize={'0.8rem'} textAlign={'center'}>
          <Link to={'/auth/login'}>{t('backToLogin')}</Link>
        </Box>
      </form>
    </Box>
  )
}

export default Register
