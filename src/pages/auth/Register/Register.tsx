import { UploadAvtBtn } from '@/components/Buttons/UploadAvtBtn'
import {
  Box,
  Button,
  Center,
  Grid,
  PasswordInput,
  TextInput,
} from '@mantine/core'
import { Link, useNavigate } from '@tanstack/react-router'

import { FaUser, FaKey, FaUserEdit } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { useForm } from '@mantine/form'
import { validateForm } from '@/utils/validate/validateForm'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    document.title = `${t('register')} | S-Todo`
  }, [])

  return (
    <Box>
      <form onSubmit={onSubmit((values) => handleRegister(values, avtFile))}>
        <Center>
          <UploadAvtBtn setAvtFile={setAvtFile} />
        </Center>
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
              leftSection={<FaUser />}
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
              leftSection={<FaKey />}
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
              leftSection={<FaUserEdit />}
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
              leftSection={<IoMdMail />}
            />
          </Grid.Col>
        </Grid>
        <Button loading={isPending} mt={20} mb={12} fullWidth type="submit">
          {t('register')}
        </Button>
        <Center fs={'0.8rem'}>
          <Link to={'/auth/login'}>{t('backToLogin')}</Link>
        </Center>
      </form>
    </Box>
  )
}

export default Register
