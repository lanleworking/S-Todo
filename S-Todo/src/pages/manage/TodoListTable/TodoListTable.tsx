import { CreateNewTodoBtn } from '@/components/Buttons/CreateNewTodoBtn'
import type { ITodo } from '@/constants/Data'
import useDayJs from '@/hooks/useDayJs'
import {
  swichPriorityColor,
  switchStatusColor,
} from '@/utils/checkers/priority'
import { Badge, Flex, Table, TableScrollContainer, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { FaLink } from 'react-icons/fa6'

function TodoListTable({ data }: { data: any }) {
  const [todoListData, setTodoListData] = useState<ITodo[]>(data)
  const { fromNow, isAfter } = useDayJs()

  const rows = useMemo(() => {
    return todoListData.map((todo: ITodo) => (
      <Table.Tr key={todo.id}>
        <Table.Td>
          <Link
            to={'/todo/$id'}
            params={{
              id: String(todo.id),
            }}
          >
            <Flex c={'blue'} gap={8} align="center">
              <Text> {todo.title}</Text>
              <FaLink />
            </Flex>
          </Link>
        </Table.Td>
        <Table.Td>
          <Badge
            variant="light"
            bd="1px solid"
            color={switchStatusColor(todo.status)}
          >
            {todo.status}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Badge
            variant="light"
            bd="1px solid"
            color={swichPriorityColor(todo.priority)}
          >
            {todo.priority}
          </Badge>
        </Table.Td>
        <Table.Td>{todo.type}</Table.Td>
        <Table.Td>{todo.createdBy}</Table.Td>
        <Table.Td c={isAfter(todo.endDate) ? 'red' : 'green'}>
          {fromNow(todo.endDate)}
        </Table.Td>
      </Table.Tr>
    ))
  }, [todoListData])
  useEffect(() => {
    document.title = 'Todo List | S-Todo'
  }, [])

  return (
    <>
      <CreateNewTodoBtn />
      <TableScrollContainer minWidth={700}>
        <Table striped stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Created By</Table.Th>
              <Table.Th>Deadline</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </TableScrollContainer>
    </>
  )
}

export default TodoListTable
