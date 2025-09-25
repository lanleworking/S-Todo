import { Button, Center, Modal, Stack } from '@mantine/core'
import { useContext, useState } from 'react'
import { UploadAvtBtn } from '../Buttons/UploadAvtBtn'
import useUser from '@/hooks/useUser'
import { fetchError } from '@/utils/toast/fetchError'
import { AuthContext } from '@/providers/Context/AuthContext'
import toast from 'react-hot-toast'

type ChangeAvtProps = {
  onClose: () => void
  opened: boolean
}

function ChangeAvt({ onClose, opened }: ChangeAvtProps) {
  const [avtFile, setAvtFile] = useState<File | null>(null)
  const { setUser } = useContext(AuthContext)
  const { changeAvtMutate } = useUser()

  const { mutate, isPending } = changeAvtMutate

  const handleChangeAvt = () => {
    if (avtFile) {
      mutate(avtFile, {
        onSuccess: (data) => {
          toast.success('Change avatar successfully!')
          setUser((prev) =>
            prev ? { ...prev, avatarUrl: data.newAvtUrl } : prev,
          )
          onClose()
          setAvtFile(null)
        },
        onError: (e) => fetchError(e),
      })
    }
  }
  return (
    <Modal onClose={onClose} opened={opened} title="Change Avatar" centered>
      <Modal.Body>
        <Stack>
          <Center>
            <UploadAvtBtn disabled={isPending} setAvtFile={setAvtFile} />
          </Center>
          <Button
            disabled={!avtFile || isPending}
            loading={isPending}
            onClick={handleChangeAvt}
            fullWidth
          >
            Update
          </Button>
        </Stack>
      </Modal.Body>
    </Modal>
  )
}

export default ChangeAvt
