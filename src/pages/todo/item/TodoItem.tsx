import PaymentModal from '@/components/Modal/PaymentModal'
import EditTodoModal from '@/components/Modal/EditTodoModal'
import ManageUsersModal from '@/components/Modal/ManageUsersModal'
import WithdrawModal from '@/components/Modal/WithdrawModal'
import { TitleWithReturn } from '@/components/TitleWithReturn'
import type { ITodoData, ITodoPaymentPayload } from '@/constants/Data'
import useDayJs from '@/hooks/useDayJs'
import useTodo from '@/hooks/useTodo'
import {
  switchPriorityColor,
  switchStatusColor,
} from '@/utils/checkers/priority'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  NumberFormatter,
  Pagination,
  Progress,
  Stack,
  Table,
  TableScrollContainer,
  Text,
  Tooltip,
  Typography,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useEffect, useState } from 'react'
import { FaDonate, FaHistory, FaPencilAlt } from 'react-icons/fa'
import { FaUserGroup, FaUserPen } from 'react-icons/fa6'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { MdAttachMoney, MdEdit, MdPieChart, MdRefresh } from 'react-icons/md'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'
import AnimatedNumber from '@/components/Animate/AnimatedNumber'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { AuthContext } from '@/providers/Context/AuthContext'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js'

import type { IUserDonation } from '@/constants/Data'

ChartJS.register(ArcElement, ChartTooltip, ChartLegend)

const CHART_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#0891b2',
  '#65a30d',
]

function DonationChart({
  data,
  serverUrl,
}: {
  data: IUserDonation[]
  serverUrl: string
}) {
  const formatVND = (v: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(v)

  const chartData = {
    labels: data.map((u) => u.fullName || u.userId),
    datasets: [
      {
        data: data.map((u) => Number(u.totalAmount)),
        backgroundColor: CHART_COLORS,
        borderColor: CHART_COLORS,
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: '60%' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: number }) => ` ${formatVND(ctx.parsed)}`,
        },
      },
    },
  }

  return (
    <Card styles={{ root: { backgroundColor: '#80808021' } }} shadow="sm">
      <Flex className="text-purple-600" gap={8} align="center" mb={12}>
        <MdPieChart />
        <Text fw={500}>Donation Breakdown</Text>
      </Flex>
      <Center>
        <div style={{ width: 200, height: 200 }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </Center>
      <Stack gap={6} mt={12}>
        {data.map((u, i) => (
          <Flex key={u.userId} align="center" justify="space-between" gap={10}>
            <Flex align="center" gap={8}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  flexShrink: 0,
                }}
              />
              <Flex align="center" gap={6}>
                <Avatar
                  size={20}
                  src={u.avatarUrl ? `${serverUrl}/${u.avatarUrl}` : undefined}
                  name={u.fullName || u.userId}
                  color="initials"
                />
                <Text size="sm">{u.fullName || u.userId}</Text>
              </Flex>
            </Flex>
            <Text size="sm" fw={600} c="green">
              <NumberFormatter
                value={u.totalAmount}
                thousandSeparator
                suffix="đ"
                prefix="+"
              />
            </Text>
          </Flex>
        ))}
      </Stack>
    </Card>
  )
}

type TodoItemProps = {
  data: ITodoData
}

function TodoItem({ data }: TodoItemProps) {
  const [todoData, setTodoData] = useState<ITodoData>(data)
  const [filterPayload, setFilterPayload] = useState<ITodoPaymentPayload>({
    todoId: data.id,
    limit: 5,
    page: 1,
  })
  const SERVER_URL = import.meta.env.VITE_API_URL
  const { users } = todoData
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const isOwner = user?.userId === todoData.createdBy
  const { getPaymentLogs, getTodoById, getDonationChart } = useTodo()
  const { formatDateTime, fromNow, isAfter } = useDayJs()
  const [
    openedPaymentModal,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false)
  const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false)
  const [
    openedManageUsers,
    { open: openManageUsers, close: closeManageUsers },
  ] = useDisclosure(false)
  const [
    openedWithdrawModal,
    { open: openWithdrawModal, close: closeWithdrawModal },
  ] = useDisclosure(false)

  const { data: todoQueryData, refetch: refetchTodo } = getTodoById(todoData.id)
  const {
    data: paymentLogsData,
    refetch: refetchPaymentLogs,
    isLoading: isLoadingPaymentLogs,
  } = getPaymentLogs(filterPayload)
  const { data: donationChartData, refetch: refetchDonationChart } =
    getDonationChart(todoData.id)

  useEffect(() => {
    refetchPaymentLogs()
  }, [filterPayload])

  useEffect(() => {
    if (todoQueryData) {
      setTodoData(todoQueryData)
    }
  }, [todoQueryData])

  useEffect(() => {
    document.title = `${data.title} | S-Todo`
    refetchPaymentLogs()
    if (todoData.type === 'fund') refetchDonationChart()
  }, [])

  const handleRefreshAfterPayment = async () => {
    try {
      await Promise.all([
        refetchTodo(),
        refetchPaymentLogs(),
        ...(todoData.type === 'fund' ? [refetchDonationChart()] : []),
      ])
      toast.success('Data refreshed successfully')
    } catch {
      toast.error('Failed to refresh data')
    }
  }

  const handleTodoUpdated = (updated: ITodoData) => {
    setTodoData((prev) => ({ ...prev, ...updated }))
  }

  return (
    <>
      <PaymentModal
        refetchTodo={handleRefreshAfterPayment}
        data={todoData}
        open={openedPaymentModal}
        onClose={closePaymentModal}
        title={t('label.donate')}
      />
      <EditTodoModal
        opened={openedEditModal}
        onClose={closeEditModal}
        data={todoData}
        onSuccess={handleTodoUpdated}
      />
      <ManageUsersModal
        opened={openedManageUsers}
        onClose={closeManageUsers}
        data={todoData}
        currentUserId={user?.userId || ''}
        serverUrl={SERVER_URL}
        onSuccess={handleTodoUpdated}
      />
      {todoData.type === 'fund' && (
        <WithdrawModal
          opened={openedWithdrawModal}
          onClose={closeWithdrawModal}
          data={todoData}
          refetchTodo={handleRefreshAfterPayment}
        />
      )}
      <Stack>
        <Group>
          <TitleWithReturn
            titleProps={{
              order: 2,
            }}
            title={todoData.title}
            to="/todo"
          />
          <Tooltip label="Refresh data">
            <ActionIcon variant="subtle" onClick={handleRefreshAfterPayment}>
              <MdRefresh size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Owner actions */}
        {isOwner && (
          <Flex gap={8} wrap="wrap">
            <Button
              size="xs"
              variant="light"
              leftSection={<MdEdit size={14} />}
              onClick={openEditModal}
            >
              Edit Todo
            </Button>
            <Button
              size="xs"
              variant="light"
              color="grape"
              leftSection={<FaUserPen size={14} />}
              onClick={openManageUsers}
            >
              Manage Members
            </Button>
          </Flex>
        )}

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              {todoData.description && (
                <Card
                  styles={{
                    root: {
                      backgroundColor: '#80808021',
                    },
                  }}
                  shadow="sm"
                >
                  <Flex align={'center'} className="text-purple-600" gap={8}>
                    <FaPencilAlt />
                    <Text fw={500}>{t('label.description')}</Text>
                  </Flex>
                  <Typography>
                    <div
                      dangerouslySetInnerHTML={{ __html: todoData.description }}
                    />
                  </Typography>
                </Card>
              )}

              <Card
                styles={{
                  root: {
                    backgroundColor: '#80808021',
                  },
                }}
                shadow="sm"
              >
                <Flex className="text-purple-600" gap={8} align={'center'}>
                  <FaHistory />
                  <Text>{t('label.logs')}</Text>
                </Flex>
                <TableScrollContainer minWidth={600}>
                  <Table my={12}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>{t('label.time')}</Table.Th>
                        <Table.Th>{t('label.user')}</Table.Th>
                        <Table.Th>{t('label.amount')}</Table.Th>
                        <Table.Th>{t('label.status')}</Table.Th>
                        <Table.Th>{t('label.note')}</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paymentLogsData?.data &&
                        Array.isArray(paymentLogsData.data) &&
                        paymentLogsData.data.length > 0 &&
                        paymentLogsData.data.map((log) => (
                          <Table.Tr key={log.id}>
                            <Table.Td>
                              {formatDateTime(log.createdAt!)}
                            </Table.Td>
                            <Table.Td>
                              <Flex align={'center'} gap={8}>
                                <Avatar
                                  size={'sm'}
                                  src={
                                    log?.avatarUrl &&
                                    `${SERVER_URL}/${log.avatarUrl}`
                                  }
                                  name={log.fullName!}
                                  color="initials"
                                />
                                <Text size={'sm'}>{log.fullName}</Text>
                              </Flex>
                            </Table.Td>
                            <Table.Td>
                              <NumberFormatter
                                className={
                                  log.status === 'PAID'
                                    ? 'text-green-600'
                                    : log.status === 'WITHDRAWAL'
                                      ? 'text-red-600'
                                      : ''
                                }
                                prefix={
                                  log.status === 'PAID'
                                    ? '+'
                                    : log.status === 'WITHDRAWAL'
                                      ? '-'
                                      : ''
                                }
                                value={log.amount}
                                thousandSeparator
                                suffix="đ"
                              />
                            </Table.Td>
                            <Table.Td>
                              <Badge
                                variant="light"
                                color={log.status === 'PAID' ? 'green' : 'red'}
                                size="sm"
                              >
                                {log.status === 'PAID'
                                  ? t('button.donate')
                                  : t('label.withdraw')}
                              </Badge>
                            </Table.Td>
                            <Table.Td>{log.note}</Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </TableScrollContainer>
                {isEmpty(paymentLogsData?.data) && !isLoadingPaymentLogs && (
                  <Empty />
                )}
                <Center>
                  <Pagination
                    disabled={isLoadingPaymentLogs}
                    onChange={(page) =>
                      setFilterPayload((prev) => ({ ...prev, page }))
                    }
                    value={paymentLogsData?.pagination.page}
                    total={paymentLogsData?.pagination.totalPage!}
                  />
                </Center>
              </Card>

              {/* Donation chart — fund todos only */}
              {todoData.type === 'fund' &&
                donationChartData &&
                donationChartData.length > 0 && (
                  <DonationChart
                    data={donationChartData}
                    serverUrl={SERVER_URL}
                  />
                )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              {todoData.type === 'fund' && (
                <Card
                  styles={{
                    root: {
                      backgroundColor: '#80808021',
                    },
                  }}
                  shadow="sm"
                >
                  <Flex className="text-purple-600" align={'center'} gap={4}>
                    <MdAttachMoney />
                    <Text>{t('label.fund')}</Text>
                  </Flex>

                  {todoData?.expectedAmount && todoData.expectedAmount > 0 ? (
                    <Flex
                      gap={{ base: 8 }}
                      direction={{ base: 'column', sm: 'row' }}
                      my={12}
                      justify={'space-between'}
                      align={{ base: 'baseline', sm: 'center' }}
                    >
                      <Flex
                        w={{ base: '100%', sm: 'fit-content' }}
                        direction={{ base: 'row', sm: 'column' }}
                        justify={{ base: 'space-between' }}
                        gap={{ base: 8 }}
                      >
                        <Text>{t('label.total')}:</Text>
                        <NumberFormatter
                          className="text-green-600"
                          suffix="đ"
                          value={todoData.totalAmount}
                          thousandSeparator
                        />
                      </Flex>
                      <Flex
                        w={{ base: '100%', sm: 'fit-content' }}
                        justify={{ base: 'space-between' }}
                        direction={{ base: 'row', sm: 'column' }}
                        gap={{ base: 8 }}
                      >
                        <Text>{t('label.goal')}:</Text>
                        <NumberFormatter
                          className="text-purple-600"
                          suffix="đ"
                          value={todoData.expectedAmount}
                          thousandSeparator
                        />
                      </Flex>
                    </Flex>
                  ) : (
                    <Center mt={12}>
                      <AnimatedNumber
                        value={todoData.totalAmount}
                        duration={1.2}
                        className="text-green-600 text-2xl font-bold"
                        options={{
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0,
                        }}
                        locale="vi-VN"
                      />
                    </Center>
                  )}

                  {todoData?.expectedAmount && todoData.expectedAmount > 0 ? (
                    <Tooltip
                      label={`${Math.round((todoData.totalAmount / todoData.expectedAmount) * 100)}%`}
                    >
                      <Progress
                        value={Math.round(
                          (todoData.totalAmount / todoData.expectedAmount) *
                            100,
                        )}
                        transitionDuration={300}
                        animated
                      />
                    </Tooltip>
                  ) : null}

                  <Button
                    onClick={openPaymentModal}
                    mt={20}
                    leftSection={<FaDonate />}
                  >
                    {t('button.donate')}
                  </Button>
                  {isOwner && (
                    <Button
                      onClick={openWithdrawModal}
                      mt={8}
                      variant="light"
                      color="red"
                      leftSection={<BiMoneyWithdraw />}
                      disabled={todoData.totalAmount <= 0}
                    >
                      {t('button.withdraw')}
                    </Button>
                  )}
                </Card>
              )}

              <Card
                styles={{
                  root: {
                    backgroundColor: '#80808021',
                  },
                }}
                shadow="sm"
              >
                <Flex
                  pb={8}
                  className="text-purple-600"
                  align={'center'}
                  gap={8}
                >
                  <FaUserGroup />
                  <Text fw={500}>{t('label.user')}:</Text>
                  <Text>({todoData.users?.length || ''})</Text>
                </Flex>
                <Avatar.Group>
                  {Array.isArray(users) &&
                    users.map((u) => (
                      <Tooltip key={u.userId} label={u.fullName}>
                        <Avatar
                          bd={'1px solid var(--border-color)'}
                          key={u.userId}
                          name={u.fullName}
                          color="initials"
                          src={
                            u.avatarUrl ? `${SERVER_URL}/${u.avatarUrl}` : ''
                          }
                        />
                      </Tooltip>
                    ))}
                </Avatar.Group>
              </Card>

              {/* information */}
              <Card
                styles={{
                  root: {
                    backgroundColor: '#80808021',
                  },
                }}
                shadow="sm"
              >
                <Flex
                  align={'center'}
                  className="text-purple-600"
                  gap={8}
                  mb={8}
                >
                  <HiOutlineInformationCircle />
                  <Text fw={500}>{t('label.information')}</Text>
                </Flex>
                <Stack gap={'xs'}>
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">{t('label.status')}</Text>
                    <Badge
                      bd={'1px solid'}
                      variant="light"
                      color={switchStatusColor(todoData.status)}
                    >
                      {todoData.status}
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">{t('label.priority')}</Text>
                    <Badge
                      bd={'1px solid'}
                      variant="light"
                      color={switchPriorityColor(todoData.priority)}
                    >
                      {todoData.priority}
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">{t('label.notify')}</Text>
                    <Badge
                      bd={'1px solid'}
                      variant="light"
                      color={todoData.notify ? 'green' : 'red'}
                    >
                      {todoData.notify ? 'On' : 'Off'}
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">{t('label.startDate')}</Text>
                    <Tooltip label={formatDateTime(todoData.startDate!)}>
                      <Text size="sm">{fromNow(todoData.startDate!)}</Text>
                    </Tooltip>
                  </Flex>
                  <Divider />
                  {todoData?.endDate && (
                    <>
                      <Flex align={'center'} justify={'space-between'}>
                        <Text size="sm">{t('label.endDate')}</Text>
                        <Tooltip label={formatDateTime(todoData.endDate!)}>
                          <Text
                            c={isAfter(todoData.endDate!) ? 'red' : 'black'}
                            size="sm"
                          >
                            {fromNow(todoData.endDate!)}
                          </Text>
                        </Tooltip>
                      </Flex>
                      <Divider />
                    </>
                  )}
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">{t('label.createdAt')}</Text>
                    <Text size="sm">{formatDateTime(todoData.createdAt)}</Text>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">{t('label.updatedAt')}</Text>
                    <Text size="sm">{formatDateTime(todoData.updatedAt!)}</Text>
                  </Flex>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  )
}

export default TodoItem
