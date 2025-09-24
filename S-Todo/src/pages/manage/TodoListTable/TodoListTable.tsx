import { CreateNewTodoBtn } from '@/components/Buttons/CreateNewTodoBtn'
import type { ITodo, ITodoList } from '@/constants/Data'
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
import { useEffect, useState } from 'react'
import clsx from 'clsx'

function TodoListTable({ data }: { data: any }) {
  const SERVER_URL = import.meta.env.VITE_API_URL
  const [todoListData, setTodoListData] = useState<ITodoList[]>(data)
  const { fromNow, isAfter } = useDayJs()

  useEffect(() => {
    document.title = 'Todo List | S-Todo'
  }, [])

  return (
    <>
      <CreateNewTodoBtn />
      <Grid>
        {todoListData.map((todo) => (
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
                      {todo.status}
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
                <Text size="sm" c={'dimmed'} className="textEllipsisTwoLines">
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
                      src={todo?.avatarUrl && `${SERVER_URL}/${todo.avatarUrl}`}
                      color="initials"
                    />
                    <Text size={'xs'}>{todo.fullName}</Text>
                  </Flex>
                  <Box ta={'right'}>
                    <Text size="xs" c={'dimmed'}>
                      3 participants
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
    </>
  )
}

export default TodoListTable
