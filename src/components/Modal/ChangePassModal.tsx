import useUser from '@/hooks/useUser'
import { fetchError } from '@/utils/toast/fetchError'
import { validateForm } from '@/utils/validate/validateForm'
import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

type ChangePassModalProps = {
  onClose: () => void
  opened: boolean
}

function ChangePassModal({ onClose, opened }: ChangePassModalProps) {
  const { changePassMutate } = useUser()
  const { t } = useTranslation()
  const { mutate, isPending } = changePassMutate

  const { key, getInputProps, onSubmit, isDirty, reset } = useForm({
    mode: 'controlled',
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: {
      currentPassword: (value) => validateForm(value, t),
      newPassword: (value) =>
        validateForm(value, t, {
          maxLength: 20,
          minLength: 6,
        }),
      confirmNewPassword: (value, values) =>
        value !== values.newPassword ? t('error.passwordsDoNotMatch') : null,
    },
  })

  const handleSubmit = (values: any) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('success.changePass'))
        handleClose()
      },
      onError: (e) => fetchError(e),
    })
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
    <Modal
      onClose={handleClose}
      opened={opened}
      title="Change Password"
      centered
    >
      <Modal.Body>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              key={key('currentPassword')}
              {...getInputProps('currentPassword')}
              label="Current Password"
              type="password"
              withAsterisk
            />
            <TextInput
              key={key('newPassword')}
              {...getInputProps('newPassword')}
              label="New Password"
              type="password"
              withAsterisk
            />
            <TextInput
              key={key('confirmNewPassword')}
              {...getInputProps('confirmNewPassword')}
              label="Confirm New Password"
              type="password"
              withAsterisk
            />
            <Button disabled={!isDirty() || isPending} type="submit" fullWidth>
              Update
            </Button>
          </Stack>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ChangePassModal
