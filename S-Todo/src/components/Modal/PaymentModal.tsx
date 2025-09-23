import {
  Anchor,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  NumberFormatter,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core'
import { MdAttachMoney } from 'react-icons/md'
import { IoQrCodeOutline } from 'react-icons/io5'
import usePayment from '@/hooks/usePayment'
import type { ITodoData } from '@/constants/Data'
import { fetchError } from '@/utils/toast/fetchError'
import { useEffect, useState } from 'react'
import { QRCode, Result } from 'antd'
import appLogo from '@/assets/logos/App_Logo.png'
import { useForm } from '@mantine/form'
import { validateForm } from '@/utils/validate/validateForm'
import { useTranslation } from 'react-i18next'

type PaymentModalProps = {
  open: boolean
  onClose: () => void
  title: string
  data: ITodoData
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

function PaymentModal({ open, onClose, title, data }: PaymentModalProps) {
  const [paymentDetails, setPaymentDetails] =
    useState<ICreatePaymentResponse | null>(null)
  const [paymentStatus, setPaymentStatus] = useState('')
  const { createPaymentMutate, getPayment, cancelPayment } = usePayment()
  const { t } = useTranslation()
  const { key, onSubmit, reset, getInputProps, getValues } = useForm({
    mode: 'controlled',
    initialValues: {
      amount: 0,
    },
    validate: {
      amount: (value) =>
        validateForm(value, t, {
          min: 2000,
        }),
    },
  })
  const { mutate: getPaymentMutate, isPending: isChecking } = getPayment
  const { mutate: cancelPaymentMutate, isPending: isCancelling } = cancelPayment
  const { mutate, isPending } = createPaymentMutate

  const handleClose = () => {
    if (isPending) return
    if (paymentDetails?.paymentLinkId && paymentStatus !== 'PAID') {
      handleCancelPayment(paymentDetails.paymentLinkId)
    }
    setPaymentDetails(null)
    onClose()
    setPaymentStatus('')
    reset()
  }

  const handleCreatePayment = (value: { amount: number }) => {
    mutate(
      {
        amount: value.amount,
        todoId: data.id,
      },
      {
        onSuccess: (data) => {
          setPaymentDetails(data)
        },
        onError: (e) => fetchError(e),
      },
    )
  }

  const handleCheckPayment = (paymentId: string) => {
    getPaymentMutate(paymentId, {
      onSuccess: (data) => {
        setPaymentStatus(data.status)
      },
    })
  }

  const handleCancelPayment = (paymentId: string) => {
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
            title="Successfully Donated"
            subTitle="Thank you for your donation!"
            extra={[<Button onClick={handleClose}>Close</Button>]}
          />
        )
      case 'CANCELLED':
        return (
          <Result
            status={'error'}
            title="Donation Cancelled"
            subTitle="Your donation has been cancelled."
            extra={[<Button onClick={handleClose}>Close</Button>]}
          />
        )
      case 'EXPIRED':
        return (
          <Result
            status={'warning'}
            title="Donation Expired"
            subTitle="Your donation link has expired."
            extra={[<Button onClick={handleClose}>Close</Button>]}
          />
        )

      default:
        return (
          <Result
            status={'info'}
            title="Donation Pending"
            subTitle="Your donation is being processed."
            extra={[
              <Button onClick={() => handleCheckPayment(paymentID)}>
                Check Payment
              </Button>,
            ]}
          />
        )
    }
  }

  useEffect(() => {
    return () => {
      if (paymentDetails?.paymentLinkId && paymentStatus !== 'PAID') {
        handleCancelPayment(paymentDetails.paymentLinkId)
      }
      reset()
      setPaymentDetails(null)
      setPaymentStatus('')
    }
  }, [])
  return (
    <Modal
      size="lg"
      centered
      closeOnClickOutside={false}
      opened={open}
      onClose={handleClose}
      title={title}
    >
      {paymentDetails?.qrCode ? (
        !paymentStatus || paymentStatus === 'PENDING' ? (
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Center>
                  <QRCode
                    value={paymentDetails?.qrCode!}
                    errorLevel="H"
                    icon={appLogo}
                  />
                </Center>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 8 }}>
                <Stack>
                  <Text size="lg" fw={'500'}>
                    Payment Info:
                  </Text>
                  <Flex gap={8} align={'center'} justify={'space-between'}>
                    <Text>Amount: </Text>
                    <Text>
                      <NumberFormatter
                        value={getValues().amount}
                        suffix="đ"
                        thousandSeparator
                      />
                    </Text>
                  </Flex>
                  <Flex gap={8} align={'center'} justify={'space-between'}>
                    <Text>Content:</Text>
                    <Text>{paymentDetails?.description}</Text>
                  </Flex>
                  <Anchor
                    ta={'center'}
                    href={paymentDetails?.checkoutUrl}
                    target="_blank"
                  >
                    Click here to view payment details
                  </Anchor>
                </Stack>
              </Grid.Col>
            </Grid>
            <Text c={'dimmed'} ta={'center'}>
              Scan the QR Code with banking app, then click Confirm Payment to
              verify your payment
            </Text>
            <Group w={'100%'} justify="center">
              <Button
                loading={isCancelling}
                disabled={isChecking}
                flex={1}
                fullWidth
                variant="default"
                onClick={() =>
                  handleCancelPayment(paymentDetails.paymentLinkId)
                }
              >
                Cancel
              </Button>
              <Button
                flex={1}
                fullWidth
                disabled={isCancelling}
                loading={isChecking}
                onClick={() => handleCheckPayment(paymentDetails.paymentLinkId)}
              >
                Confirm Payment
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
              label="Amount"
              placeholder="Enter amount"
              description={
                "! This amount is for testing purposes only and won't be charged."
              }
            />
            <Button
              type="submit"
              loading={isPending}
              leftSection={<IoQrCodeOutline />}
              fullWidth
            >
              Generate QRCode
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  )
}

export default PaymentModal
