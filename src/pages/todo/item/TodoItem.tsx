import PaymentModal from '@/components/Modal/PaymentModal'
import { TitleWithReturn } from '@/components/TitleWithReturn'
import type { ITodoData, ITodoPaymentPayload } from '@/constants/Data'
import useDayJs from '@/hooks/useDayJs'
import useTodo from '@/hooks/useTodo'
import {
  swichPriorityColor,
  switchStatusColor,
} from '@/utils/checkers/priority'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
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
import { useEffect, useState } from 'react'
import { FaDonate, FaHistory, FaPencilAlt } from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'
import { MdAttachMoney } from 'react-icons/md'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'
import AnimatedNumber from '@/components/Animate/AnimatedNumber'
import { useTranslation } from 'react-i18next'

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
  const { getPaymentLogs, getTodoById } = useTodo()
  const { formatDateTime, fromNow, isAfter } = useDayJs()
  const [
    openedPaymentModal,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false)

  const { data: todoQueryData, refetch: refetchTodo } = getTodoById(todoData.id)
  const {
    data: paymentLogsData,
    refetch: refetchPaymentLogs,
    isLoading: isLoadingPaymentLogs,
  } = getPaymentLogs(filterPayload)

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
  }, [])

  const handleRefreshAfterPayment = () => {
    refetchTodo()
    refetchPaymentLogs()
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
      <Stack>
        <TitleWithReturn
          titleProps={{
            order: 2,
          }}
          title={todoData.title}
          to="/todo"
        />

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
                        <Table.Th>{t('label.action')}</Table.Th>
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
                                  log.status === 'PAID' ? 'text-green-600' : ''
                                }
                                prefix={log.status === 'PAID' ? '+' : ''}
                                value={log.amount}
                                thousandSeparator
                                suffix="đ"
                              />
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
                      color={swichPriorityColor(todoData.priority)}
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
