import { animate } from 'animejs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { QRCode, Empty } from 'antd'
import { isEmpty } from 'lodash'
import { MdAttachMoney } from 'react-icons/md'
import {
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Loader,
  Modal,
  NumberFormatter,
  Pagination,
  Stack,
  Table,
  TableScrollContainer,
  Text,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { TitleWithReturn } from '@/components/TitleWithReturn'
import { PAYMENT_EXPIRE_MINUTES } from '@/constants/payment'
import usePayment from '@/hooks/usePayment'
import useDayJs from '@/hooks/useDayJs'
import { usePaymentTimer } from '@/providers/Context/PaymentTimerContext'
import type { IPaymentHistoryItem } from '@/constants/Data'
import { fetchError } from '@/utils/toast/fetchError'
import appLogo from '@/assets/logos/App_Logo.png'

interface ContinuePaymentState {
  paymentLinkId: string
  qrCode: string
  checkoutUrl: string
  amount: number
  description: string
}

function statusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'green'
    case 'PENDING':
      return 'yellow'
    case 'CANCELLED':
      return 'red'
    case 'EXPIRED':
      return 'gray'
    default:
      return 'blue'
  }
}

/* ── Anime.js animated number ───────────────────────────── */
function AnimeNumber({
  value,
  locale = 'vi-VN',
  options = { style: 'currency', currency: 'VND', minimumFractionDigits: 0 },
  className,
}: {
  value: number
  locale?: string
  options?: Intl.NumberFormatOptions
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const from = prevRef.current
    prevRef.current = value
    const obj = { val: from }

    animate(obj, {
      val: value,
      duration: 1200,
      ease: 'outExpo',
      onUpdate: () => {
        el.textContent = new Intl.NumberFormat(locale, options).format(
          Math.round(obj.val),
        )
      },
    })
  }, [value])

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat(locale, options).format(0)}
    </span>
  )
}

/* ── Main page ──────────────────────────────────────────── */
function PaymentHistoryPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const now = usePaymentTimer()
  const { formatDateTime } = useDayJs()

  const { getPaymentHistory, cancelPayment, getPayment } = usePayment()
  const { data, isLoading, refetch } = getPaymentHistory(page, 10)

  const [continueState, setContinueState] =
    useState<ContinuePaymentState | null>(null)
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)

  const { mutate: cancelMutate, isPending: isCancelling } = cancelPayment
  const { mutate: getPaymentMutate, isPending: isFetchingContinue } = getPayment

  useEffect(() => {
    refetch()
  }, [page])

  /** Total of PAID items on the current page */
  const totalPaid = useMemo(
    () =>
      (data?.data ?? [])
        .filter((i) => i.status.toUpperCase() === 'PAID')
        .reduce((sum, i) => sum + i.amount, 0),
    [data],
  )

  /** Returns minutes remaining for a pending payment, or null if expired */
  const getMinutesRemaining = (createdAt: string | null): number | null => {
    if (!createdAt) return null
    const expiryMs =
      new Date(createdAt).getTime() + PAYMENT_EXPIRE_MINUTES * 60_000
    const remaining = expiryMs - now.getTime()
    if (remaining <= 0) return null
    return Math.ceil(remaining / 60_000)
  }

  const handleCancel = (item: IPaymentHistoryItem) => {
    cancelMutate(item.paymentLinkId, {
      onSuccess: () => refetch(),
      onError: (e) => fetchError(e),
    })
  }

  const handleContinue = (item: IPaymentHistoryItem) => {
    getPaymentMutate(item.paymentLinkId, {
      onSuccess: (paymentData) => {
        if (paymentData.status?.toUpperCase() === 'PENDING') {
          setContinueState({
            paymentLinkId: item.paymentLinkId,
            qrCode: paymentData.qrCode || item.qrCode || '',
            checkoutUrl: paymentData.checkoutUrl || '',
            amount: paymentData.amount ?? item.amount,
            description: paymentData.description || '',
          })
          openModal()
        } else {
          refetch()
        }
      },
      onError: (e) => fetchError(e),
    })
  }

  const handleCloseModal = () => {
    closeModal()
    setContinueState(null)
    refetch()
  }

  const handleCancelFromModal = () => {
    if (!continueState) return
    cancelMutate(continueState.paymentLinkId, {
      onSuccess: () => {
        closeModal()
        setContinueState(null)
        refetch()
      },
      onError: (e) => fetchError(e),
    })
  }

  return (
    <>
      {/* Continue-payment modal */}
      <Modal
        size="md"
        centered
        closeOnClickOutside={false}
        opened={modalOpened}
        onClose={handleCloseModal}
        title={t('label.paymentHistory.continueTitle')}
      >
        {continueState && (
          <Stack align="center">
            {continueState.qrCode && (
              <QRCode
                size={200}
                value={continueState.qrCode}
                errorLevel="H"
                icon={appLogo}
              />
            )}
            <Text size="sm" c="dimmed" ta="center">
              {t('label.paymentModal.qrNote')}
            </Text>
            {continueState.checkoutUrl && (
              <Anchor href={continueState.checkoutUrl} target="_blank">
                {t('label.paymentModal.openBankingLink')}
              </Anchor>
            )}
            <Group w="100%" grow>
              <Button
                variant="outline"
                color="red"
                loading={isCancelling}
                onClick={handleCancelFromModal}
              >
                {t('button.cancel')}
              </Button>
              <Button onClick={handleCloseModal}>{t('button.close')}</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Stack>
        <TitleWithReturn
          titleProps={{ order: 2 }}
          title={t('label.paymentHistory.title')}
          to="/todo"
        />

        {/* Total spend card */}
        <Card
          styles={{ root: { backgroundColor: '#80808021' } }}
          shadow="sm"
          p="md"
          radius="md"
        >
          <Flex align="center" gap={10} className="text-purple-600" mb={6}>
            <MdAttachMoney size={18} />
            <Text fw={600} size="sm">
              Total Spent
            </Text>
          </Flex>
          <AnimeNumber
            value={totalPaid}
            className="text-green-500 text-2xl font-bold"
          />
        </Card>

        <TableScrollContainer minWidth={700}>
          <Table verticalSpacing="sm" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('label.time')}</Table.Th>
                <Table.Th>{t('label.todo')}</Table.Th>
                <Table.Th>{t('label.amount')}</Table.Th>
                <Table.Th>{t('label.status')}</Table.Th>
                <Table.Th>{t('label.paymentHistory.timeRemain')}</Table.Th>
                <Table.Th>{t('label.note')}</Table.Th>
                <Table.Th>{t('label.action')}</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {isLoading && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Center py={20}>
                      <Loader size="sm" />
                    </Center>
                  </Table.Td>
                </Table.Tr>
              )}

              {!isLoading &&
                data?.data?.map((item) => {
                  const isPending = item.status.toUpperCase() === 'PENDING'
                  const minutesLeft = isPending
                    ? getMinutesRemaining(item.createdAt)
                    : null

                  return (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Tooltip label={formatDateTime(item.createdAt!)}>
                          <Text size="sm">
                            {formatDateTime(item.createdAt!)}
                          </Text>
                        </Tooltip>
                      </Table.Td>

                      <Table.Td>
                        <Link
                          to="/todo/$id"
                          params={{ id: String(item.todoId) }}
                        >
                          <Text
                            size="sm"
                            fw={500}
                            className="hover:text-purple-600 transition-colors"
                          >
                            {item.todoTitle || `#${item.todoId}`}
                          </Text>
                        </Link>
                      </Table.Td>

                      <Table.Td>
                        <NumberFormatter
                          className={
                            item.status === 'PAID' ? 'text-green-600' : ''
                          }
                          value={item.amount}
                          suffix="đ"
                          thousandSeparator
                        />
                      </Table.Td>

                      <Table.Td>
                        <Badge
                          variant="light"
                          bd="1px solid"
                          color={statusColor(item.status)}
                        >
                          {item.status}
                        </Badge>
                      </Table.Td>

                      <Table.Td>
                        {isPending ? (
                          minutesLeft !== null ? (
                            <Text size="sm" c="orange" fw={500}>
                              {t('label.paymentHistory.minutesLeft', {
                                count: minutesLeft,
                              })}
                            </Text>
                          ) : (
                            <Text size="sm" c="red">
                              {t('label.paymentHistory.expired')}
                            </Text>
                          )
                        ) : (
                          <Text size="sm" c="dimmed">
                            —
                          </Text>
                        )}
                      </Table.Td>

                      <Table.Td>
                        <Text size="sm" c={item.note ? undefined : 'dimmed'}>
                          {item.note || '—'}
                        </Text>
                      </Table.Td>

                      <Table.Td>
                        {isPending && (
                          <Group gap="xs" wrap="nowrap">
                            <Button
                              size="xs"
                              variant="light"
                              loading={isFetchingContinue}
                              onClick={() => handleContinue(item)}
                            >
                              {t('button.continue')}
                            </Button>
                            <Button
                              size="xs"
                              color="red"
                              variant="light"
                              loading={isCancelling}
                              onClick={() => handleCancel(item)}
                            >
                              {t('button.cancel')}
                            </Button>
                          </Group>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
            </Table.Tbody>
          </Table>
        </TableScrollContainer>

        {!isLoading && isEmpty(data?.data) && (
          <Center py={40}>
            <Empty description={t('label.paymentHistory.empty')} />
          </Center>
        )}

        {(data?.pagination?.totalPage ?? 0) > 1 && (
          <Center>
            <Pagination
              disabled={isLoading}
              value={data?.pagination.page}
              total={data?.pagination.totalPage ?? 1}
              onChange={setPage}
            />
          </Center>
        )}
      </Stack>
    </>
  )
}

export default PaymentHistoryPage
