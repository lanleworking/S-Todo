import {
  Anchor,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  NumberFormatter,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { MdAttachMoney } from 'react-icons/md'
import { IoQrCodeOutline } from 'react-icons/io5'
import usePayment from '@/hooks/usePayment'
import type { ITodoData } from '@/constants/Data'
import { fetchError } from '@/utils/toast/fetchError'
import { useEffect, useState, useRef } from 'react'
import { QRCode, Result } from 'antd'
import appLogo from '@/assets/logos/App_Logo.png'
import { useForm } from '@mantine/form'
import { validateForm } from '@/utils/validate/validateForm'
import { useTranslation } from 'react-i18next'
import { FaRegStickyNote } from 'react-icons/fa'

type PaymentModalProps = {
  open: boolean
  onClose: () => void
  title: string
  data: ITodoData
  refetchTodo: () => void
}

interface ICreatePaymentResponse {
  bin: string
  accountNumber: string
  accountName: string
  amount: number
  description: string
  orderCode: number
  currency: string
  paymentLinkId: string
  status: string
  expiredAt?: number
  checkoutUrl: string
  qrCode: string
}

function PaymentModal({
  open,
  onClose,
  title,
  data,
  refetchTodo,
}: PaymentModalProps) {
  const [paymentDetails, setPaymentDetails] =
    useState<ICreatePaymentResponse | null>(null)
  const [paymentStatus, setPaymentStatus] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { createPaymentMutate, getPayment, cancelPayment } = usePayment()
  const { t } = useTranslation()
  const { key, onSubmit, reset, getInputProps, getValues } = useForm({
    mode: 'controlled',
    initialValues: {
      amount: 0,
      note: '',
    },
    validate: {
      amount: (value) =>
        validateForm(value, t, {
          min: 2000,
          max: 5000000,
        }),
    },
  })
  const { mutate: getPaymentMutate, isPending: isChecking } = getPayment
  const { mutate: cancelPaymentMutate, isPending: isCancelling } = cancelPayment
  const { mutate, isPending } = createPaymentMutate

  const clearPaymentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startPaymentPolling = (paymentId: string) => {
    // Clear any existing interval
    clearPaymentInterval()

    // Start polling every 5 seconds
    intervalRef.current = setInterval(() => {
      if (!paymentId || isChecking) return
      getPaymentMutate(paymentId, {
        onSuccess: (data) => {
          setPaymentStatus(data.status)
          // Stop polling if payment is completed, cancelled, or expired
          if (['PAID', 'CANCELLED', 'EXPIRED'].includes(data.status)) {
            clearPaymentInterval()
          }
        },
        onError: (error) => {
          console.error('Error checking payment status:', error)
          // Continue polling even on error, but maybe add retry limit
        },
      })
    }, 5000) // 5 seconds
  }

  const handleClose = (type: 'success' | 'cancel') => {
    if (isPending) return

    // Clear polling interval
    clearPaymentInterval()

    if (paymentDetails?.paymentLinkId && paymentStatus !== 'PAID') {
      handleCancelPayment(paymentDetails.paymentLinkId)
    }
    setPaymentDetails(null)
    onClose()
    setPaymentStatus('')
    reset()
    if (type === 'success') {
      refetchTodo() // Refresh todo data to reflect any changes
    }
  }

  const handleCreatePayment = (value: { amount: number; note?: string }) => {
    mutate(
      {
        ...value,
        todoId: data.id,
      },
      {
        onSuccess: (data) => {
          setPaymentDetails(data)
          setPaymentStatus('PENDING')
          // Start auto-checking payment status
          startPaymentPolling(data.paymentLinkId)
        },
        onError: (e) => fetchError(e),
      },
    )
  }

  const handleCheckPayment = (paymentId: string) => {
    getPaymentMutate(paymentId, {
      onSuccess: (data) => {
        setPaymentStatus(data.status)
        // If payment is completed, stop auto-polling
        if (['PAID', 'CANCELLED', 'EXPIRED'].includes(data.status)) {
          clearPaymentInterval()
        }
      },
    })
  }

  const handleCancelPayment = (paymentId: string) => {
    // Clear polling when cancelling
    clearPaymentInterval()

    cancelPaymentMutate(paymentId, {
      onSuccess: () => {
        reset()
        onClose()
        setPaymentDetails(null)
        setPaymentStatus('')
      },
      onError: (e) => fetchError(e),
    })
  }

  const resultContainer = (status: string, paymentID: string) => {
    switch (status) {
      case 'PAID':
        return (
          <Result
            status={'success'}
            title={t('payment.success.title')}
            subTitle={t('payment.success.subtitle')}
            extra={[
              <Button key={'close'} onClick={() => handleClose('success')}>
                {t('button.close')}
              </Button>,
            ]}
          />
        )
      case 'CANCELLED':
        return (
          <Result
            status={'error'}
            title={t('payment.cancel.title')}
            subTitle={t('payment.cancel.subtitle')}
            extra={[
              <Button onClick={() => handleClose('cancel')}>
                {' '}
                {t('button.close')}
              </Button>,
            ]}
          />
        )
      case 'EXPIRED':
        return (
          <Result
            status={'warning'}
            title={t('payment.expired.title')}
            subTitle={t('payment.expired.subtitle')}
            extra={[
              <Button onClick={() => handleClose('cancel')}>
                {' '}
                {t('button.close')}
              </Button>,
            ]}
          />
        )

      default:
        return (
          <Result
            status={'info'}
            title={t('payment.pending.title')}
            subTitle={t('payment.pending.subtitle')}
            extra={[
              <Button
                onClick={() => handleCheckPayment(paymentID)}
                loading={isChecking}
              >
                {t('button.check')}
              </Button>,
            ]}
          />
        )
    }
  }

  // Cleanup on component unmount or modal close
  useEffect(() => {
    return () => {
      clearPaymentInterval()
      if (paymentDetails?.paymentLinkId && paymentStatus !== 'PAID') {
        // Note: This might not work reliably on unmount
        // Consider moving cleanup to handleClose instead
      }
      reset()
      setPaymentDetails(null)
      setPaymentStatus('')
    }
  }, [])

  // Clear interval when modal is closed
  useEffect(() => {
    if (!open) {
      clearPaymentInterval()
    }
  }, [open])

  return (
    <Modal
      size="lg"
      centered
      closeOnClickOutside={false}
      opened={open}
      onClose={() => handleClose('cancel')}
      title={title}
    >
      {paymentDetails?.qrCode ? (
        !paymentStatus || paymentStatus === 'PENDING' ? (
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Center>
                  <QRCode
                    size={200}
                    value={paymentDetails?.qrCode!}
                    errorLevel="H"
                    icon={appLogo}
                  />
                </Center>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 8 }}>
                <Card
                  shadow="sm"
                  styles={{
                    root: {
                      backgroundColor: '#8080801c',
                    },
                  }}
                >
                  <Stack>
                    <Text size="lg" fw={'500'}>
                      {t('label.paymentModal.info')}:
                    </Text>
                    <Flex gap={8} align={'center'} justify={'space-between'}>
                      <Text>{t('label.amount')}:</Text>
                      <Text>
                        <NumberFormatter
                          value={getValues().amount}
                          suffix="đ"
                          thousandSeparator
                        />
                      </Text>
                    </Flex>
                    <Flex gap={8} align={'center'} justify={'space-between'}>
                      <Text>{t('label.content')}:</Text>
                      <Text>{paymentDetails?.description}</Text>
                    </Flex>
                    <Anchor
                      ta={'center'}
                      href={paymentDetails?.checkoutUrl}
                      target="_blank"
                    >
                      {t('label.paymentModal.openBankingLink')}
                    </Anchor>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
            <Text c={'dimmed'} ta={'center'}>
              {t('label.paymentModal.qrNote')}
            </Text>
            <Text c={'red'} ta={'center'}>
              {t('warning.notCloseTab')}
            </Text>
            <Group w={'100%'} justify="center">
              <Button
                flex={1}
                fullWidth
                disabled={isCancelling}
                loading={isChecking}
                onClick={() => handleCheckPayment(paymentDetails.paymentLinkId)}
              >
                {t('button.check')}
              </Button>
            </Group>
          </Stack>
        ) : (
          resultContainer(paymentStatus, paymentDetails?.paymentLinkId)
        )
      ) : (
        <form onSubmit={onSubmit(handleCreatePayment)}>
          <Stack>
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
              description={t('label.paymentModal.amountMin', {
                amount: '2,000',
              })}
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
              leftSection={<IoQrCodeOutline />}
              fullWidth
            >
              {t('button.generateQRCode')}
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  )
}

export default PaymentModal
