import { CreateNewTodoBtn } from '@/components/Buttons/CreateNewTodoBtn'
import type { ITodoList } from '@/constants/Data'
import useDayJs from '@/hooks/useDayJs'
import {
  swichPriorityColor,
  switchStatusColor,
} from '@/utils/checkers/priority'
import {
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import styles from './TodoListTable.module.scss'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'

function TodoListTable({ data }: { data: ITodoList[] }) {
  const SERVER_URL = import.meta.env.VITE_API_URL
  const { fromNow, isAfter } = useDayJs()
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t('label.todoList')} | S-Todo`
  }, [])

  return (
    <>
      <CreateNewTodoBtn />
      {isEmpty(data) ? (
        <Flex
          h={'80vh'}
          style={{
            overflow: 'hidden',
          }}
          justify={'center'}
          align={'center'}
        >
          <Empty />
        </Flex>
      ) : (
        <Grid>
          {Array.isArray(data) &&
            data.map((todo) => (
              <Grid.Col key={todo.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  component={Link}
                  to={`/todo/${todo.id}`}
                  className={clsx(styles.todoCard)}
                  bd={'1px solid var(--border-color)'}
                  shadow={'sm'}
                >
                  <Stack gap={'sm'}>
                    <Flex justify={'space-between'} align={'center'}>
                      <Text fw={500}>{todo.title}</Text>
                      <Group>
                        <Badge
                          bd={'1px solid'}
                          variant="light"
                          color={switchStatusColor(todo.status)}
                        >
                          {t('label.' + todo.status.toLowerCase())}
                        </Badge>
                        <Badge
                          bd={'1px solid'}
                          variant="light"
                          color={swichPriorityColor(todo.priority)}
                        >
                          {todo.priority}
                        </Badge>
                      </Group>
                    </Flex>
                    {/* <Divider /> */}
                    <Text
                      size="sm"
                      c={'dimmed'}
                      className="textEllipsisTwoLines"
                    >
                      {todo.shortDescription}
                    </Text>
                    <Group>
                      <Badge variant="light">{todo.type}</Badge>
                    </Group>
                    <Divider />
                    <Flex align={'center'} justify={'space-between'}>
                      <Flex gap={4} align={'center'}>
                        <Avatar
                          size={'sm'}
                          name={todo.fullName}
                          src={
                            todo?.avatarUrl && `${SERVER_URL}/${todo.avatarUrl}`
                          }
                          color="initials"
                        />
                        <Text size={'xs'}>{todo.fullName}</Text>
                      </Flex>
                      <Box ta={'right'}>
                        <Text size="xs" c={'dimmed'}>
                          {todo.totalParticipants} {t('label.participants')}
                        </Text>
                        {todo?.endDate && (
                          <Text
                            size="xs"
                            className={
                              isAfter(todo.endDate)
                                ? '!text-red-400'
                                : '!text-green-400'
                            }
                          >
                            {fromNow(todo.endDate)}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
        </Grid>
      )}
    </>
  )
}

export default TodoListTable
