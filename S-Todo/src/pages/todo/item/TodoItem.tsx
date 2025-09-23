import PaymentModal from '@/components/Modal/PaymentModal'
import { TitleWithReturn } from '@/components/TitleWithReturn'
import type { ITodoData } from '@/constants/Data'
import useDayJs from '@/hooks/useDayJs'
import {
  swichPriorityColor,
  switchStatusColor,
} from '@/utils/checkers/priority'
import {
  Avatar,
  Badge,
  Box,
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
  Text,
  Tooltip,
  Typography,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'
import { FaDonate, FaHistory } from 'react-icons/fa'
import { MdAttachMoney } from 'react-icons/md'

type TodoItemProps = {
  data: ITodoData
}

function TodoItem({ data }: TodoItemProps) {
  const [
    openedPaymentModal,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false)
  const { formatDateTime, fromNow } = useDayJs()
  const SERVER_URL = import.meta.env.VITE_API_URL
  const { users } = data

  useEffect(() => {
    document.title = `${data.title} | S-Todo`
  }, [])
  return (
    <>
      <PaymentModal
        data={data}
        open={openedPaymentModal}
        onClose={closePaymentModal}
        title="Donate"
      />
      <Stack>
        <TitleWithReturn
          titleProps={{
            order: 2,
          }}
          title={data.title}
          to="/todo"
        />

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              <Card
                styles={{
                  root: {
                    backgroundColor: '#80808021',
                  },
                }}
                shadow="sm"
              >
                <Text fw={500}>Description</Text>
                <Typography>
                  <div dangerouslySetInnerHTML={{ __html: data.description }} />
                </Typography>
              </Card>

              <Card
                styles={{
                  root: {
                    backgroundColor: '#80808021',
                  },
                }}
                shadow="sm"
              >
                <Flex gap={4} align={'center'}>
                  <FaHistory />
                  <Text>Activity Logs</Text>
                </Flex>
                <Table my={12}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Time</Table.Th>
                      <Table.Th>User</Table.Th>
                      <Table.Th>Action</Table.Th>
                      <Table.Th>Description</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                </Table>
                <Center>
                  <Pagination total={2} />
                </Center>
              </Card>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              {data.type === 'fund' && (
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
                    <Text>Fund</Text>
                  </Flex>
                  <Flex my={12} justify={'space-between'} align={'center'}>
                    <Box>
                      <Text>Total:</Text>
                      <NumberFormatter
                        className="text-green-500"
                        suffix="đ"
                        value={0}
                        thousandSeparator
                      />
                    </Box>
                    <Box>
                      <Text>Goal:</Text>
                      <NumberFormatter
                        className="text-purple-600"
                        suffix="đ"
                        value={data.expectedAmount}
                        thousandSeparator
                      />
                    </Box>
                  </Flex>
                  <Tooltip label="40%">
                    <Progress value={40} transitionDuration={300} animated />
                  </Tooltip>

                  <Button
                    onClick={openPaymentModal}
                    mt={20}
                    leftSection={<FaDonate />}
                  >
                    Donate
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
                <Flex className="text-purple-600" align={'center'} gap={8}>
                  <Text fw={500}>Users</Text>
                  <Text>{data.users?.length || 0}</Text>
                </Flex>
                <Avatar.Group>
                  {users?.map((u) => (
                    <Tooltip key={u.userId} label={u.fullName}>
                      <Avatar
                        bd={'1px solid var(--border-color)'}
                        key={u.userId}
                        name={u.fullName}
                        color="initials"
                        src={u.avatarUrl ? `${SERVER_URL}/${u.avatarUrl}` : ''}
                      />
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </Card>

              <Card
                styles={{
                  root: {
                    backgroundColor: '#80808021',
                  },
                }}
                shadow="sm"
              >
                <Text className="!text-purple-600" fw={500}>
                  Information
                </Text>
                <Stack gap={'xs'}>
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">Status</Text>
                    <Badge
                      bd={'1px solid'}
                      variant="light"
                      color={switchStatusColor(data.status)}
                    >
                      {data.status}
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">Priority</Text>
                    <Badge
                      bd={'1px solid'}
                      variant="light"
                      color={swichPriorityColor(data.priority)}
                    >
                      {data.priority}
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">Start Date</Text>
                    <Tooltip label={formatDateTime(data.startDate!)}>
                      <Text size="sm">{fromNow(data.startDate!)}</Text>
                    </Tooltip>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">End Date</Text>
                    <Tooltip label={formatDateTime(data.endDate!)}>
                      <Text size="sm">{fromNow(data.endDate!)}</Text>
                    </Tooltip>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">Created At</Text>
                    <Text size="sm">{formatDateTime(data.createdAt)}</Text>
                  </Flex>
                  <Divider />
                  <Flex align={'center'} justify={'space-between'}>
                    <Text size="sm">Updated At</Text>
                    <Text size="sm">{formatDateTime(data.updatedAt!)}</Text>
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
