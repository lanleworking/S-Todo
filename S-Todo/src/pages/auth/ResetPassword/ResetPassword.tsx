import { EResetPasswordMode } from '@/constants/App'
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FaUser, FaKey } from 'react-icons/fa'

function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const query = useSearch({ from: '/auth/reset-password' }) as {
    mode?: EResetPasswordMode
  }

  if (query?.mode === EResetPasswordMode.FORGOT) {
    return (
      <Stack gap={'xs'}>
        <TextInput
          leftSection={<FaUser />}
          label={t('username')}
          placeholder={t('username')}
          description="Enter your username or email"
          styles={{
            input: {
              backgroundColor: 'var(--auth-input-bg-color)',
            },
          }}
          withAsterisk
        />
        <Button>Confirm</Button>
      </Stack>
    )
  } else if (query?.mode === EResetPasswordMode.CHANGE) {
    return (
      <form>
        <Stack>
          <PasswordInput
            label="Old Password"
            placeholder="Old Password"
            styles={{
              input: {
                backgroundColor: 'var(--auth-input-bg-color)',
              },
            }}
            withAsterisk
            leftSection={<FaKey />}
          />
          <PasswordInput
            label="New Password"
            placeholder="New Password"
            styles={{
              input: {
                backgroundColor: 'var(--auth-input-bg-color)',
              },
            }}
            withAsterisk
            leftSection={<FaKey />}
          />
          <PasswordInput
            label="Re-enter Password"
            placeholder="Re-enter Password"
            styles={{
              input: {
                backgroundColor: 'var(--auth-input-bg-color)',
              },
            }}
            withAsterisk
            leftSection={<FaKey />}
          />
          <Button>Update</Button>
        </Stack>
      </form>
    )
  } else {
    navigate({
      to: '/not-found',
      replace: true,
    })
  }
}

export default ResetPassword
