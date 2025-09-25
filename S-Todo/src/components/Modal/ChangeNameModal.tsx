import useUser from '@/hooks/useUser'
import { AuthContext } from '@/providers/Context/AuthContext'
import { fetchError } from '@/utils/toast/fetchError'
import { validateForm } from '@/utils/validate/validateForm'
import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MdDriveFileRenameOutline } from 'react-icons/md'

type ChangeNameModalProps = {
  onClose: () => void
  opened: boolean
}

function ChangeNameModal({ onClose, opened }: ChangeNameModalProps) {
  const { t } = useTranslation()
  const { user, setUser } = useContext(AuthContext)
  const { changeNameMutate } = useUser()
  const { mutate, isPending } = changeNameMutate
  const { key, reset, getInputProps, isDirty, onSubmit } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      newName: '',
    },
    validate: {
      newName: (value) =>
        validateForm(value, t, {
          maxLength: 50,
          minLength: 3,
        }),
    },
  })

  const handleSubmit = (values: { newName: string }) => {
    mutate(values, {
      onSuccess: (data) => {
        toast.success(t('success.changeName'))
        setUser((prev) => (prev ? { ...prev, fullName: data.newName } : null))
        reset()
        onClose()
      },
      onError: (e) => fetchError(e),
    })
  }

  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title="Change Display Name"
      centered
    >
      <Modal.Body>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              disabled={isPending}
              leftSection={<MdDriveFileRenameOutline />}
              key={key('newName')}
              {...getInputProps('newName')}
              label="New Name"
              placeholder={user?.fullName}
              withAsterisk
            />
            <Button
              loading={isPending}
              disabled={!isDirty() || isPending}
              type="submit"
              fullWidth
            >
              Update
            </Button>
          </Stack>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ChangeNameModal
