import {
  Button,
  Modal,
  NumberFormatter,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { FaRegStickyNote } from 'react-icons/fa'
import { MdAttachMoney } from 'react-icons/md'
import type { ITodoData } from '@/constants/Data'
import usePayment from '@/hooks/usePayment'
import { fetchError } from '@/utils/toast/fetchError'
import { validateForm } from '@/utils/validate/validateForm'

type WithdrawModalProps = {
  opened: boolean
  onClose: () => void
  data: ITodoData
  refetchTodo: () => void
}

function WithdrawModal({
  opened,
  onClose,
  data,
  refetchTodo,
}: WithdrawModalProps) {
  const { t } = useTranslation()
  const { withdrawFund } = usePayment()
  const { mutate, isPending } = withdrawFund

  const maxAmount = data.totalAmount

  const { key, onSubmit, reset, getInputProps } = useForm({
    mode: 'controlled',
    initialValues: {
      amount: 0,
      note: '',
    },
    validate: {
      amount: (value) =>
        validateForm(value, t, {
          min: 1000,
          max: maxAmount,
        }),
    },
  })

  const handleClose = () => {
    if (isPending) return
    reset()
    onClose()
  }

  const handleWithdraw = (values: { amount: number; note?: string }) => {
    mutate(
      {
        todoId: data.id,
        amount: values.amount,
        note: values.note,
      },
      {
        onSuccess: () => {
          toast.success(t('withdraw.success'))
          reset()
          onClose()
          refetchTodo()
        },
        onError: (e) => fetchError(e),
      },
    )
  }

  return (
    <Modal
      centered
      opened={opened}
      onClose={handleClose}
      title={t('label.withdraw')}
    >
      <form onSubmit={onSubmit(handleWithdraw)}>
        <Stack>
          <Text size="sm" c="dimmed">
            {t('withdraw.maxAmount')}:{' '}
            <Text span fw={600} c="green">
              <NumberFormatter value={maxAmount} thousandSeparator suffix="đ" />
            </Text>
          </Text>
          <NumberInput
            key={key('amount')}
            {...getInputProps('amount')}
            withAsterisk
            leftSection={<MdAttachMoney />}
            thousandSeparator
            hideControls
            rightSection="đ"
            label={t('label.amount')}
            placeholder={t('label.amount')}
            max={maxAmount}
            min={1000}
          />
          <TextInput
            key={key('note')}
            {...getInputProps('note')}
            leftSection={<FaRegStickyNote />}
            placeholder={t('label.note')}
            label={t('label.note')}
          />
          <Button
            type="submit"
            loading={isPending}
            leftSection={<BiMoneyWithdraw />}
            color="red"
            fullWidth
          >
            {t('button.withdraw')}
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}

export default WithdrawModal
