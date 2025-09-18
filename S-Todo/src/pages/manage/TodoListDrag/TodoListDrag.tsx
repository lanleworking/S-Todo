import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import {
  ActionIcon,
  Affix,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import styles from './TodoManager.module.scss'
import clsx from 'clsx'
import { CiTimer } from 'react-icons/ci'
import { FaPlus } from 'react-icons/fa6'
import useDayJs from '@/hooks/useDayJs'
import { isEmpty } from 'lodash'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import type { IManageTodo, IManageTodoData } from '@/constants/Data'
import useTodo from '@/hooks/useTodo'
import { fetchError } from '@/utils/toast/fetchError'

type ManageTodoProps = {
  manageTodoData: IManageTodoData
}

function ManageTodo({ manageTodoData }: ManageTodoProps) {
  const [columns, setColumns] = useState<IManageTodoData>(manageTodoData)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const navigate = useNavigate()
  const { fromNow, isAfter } = useDayJs()
  const { updateTodoManage } = useTodo()
  const [
    openedConfirmDeleteModal,
    { open: openConfirmDeleteModal, close: closeConfirmDeleteModal },
  ] = useDisclosure(false)

  const { mutate, isPending } = updateTodoManage

  const reassignOrder = (items: IManageTodo[]) =>
    items.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))

  const onDragEnd = (result: DropResult) => {
    console.log(result)
    const { source, destination } = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    // data old col
    const sourceCol = columns[source.droppableId as keyof IManageTodoData]

    // data new col
    const destCol = columns[destination.droppableId as keyof IManageTodoData]

    // get all data in old col
    const oldSourceCol = [...Object.values(sourceCol)]

    // get all data in new col
    const newDestCol =
      source.droppableId === destination.droppableId
        ? oldSourceCol
        : [...Object.values(destCol)]

    // Remove from source
    const [removed] = oldSourceCol.splice(source.index, 1)

    // Insert into destination
    newDestCol.splice(destination.index, 0, removed)

    setColumns({
      ...columns,
      [source.droppableId]: reassignOrder(
        source.droppableId === destination.droppableId
          ? newDestCol
          : oldSourceCol,
      ),
      [destination.droppableId]: reassignOrder(newDestCol),
    })
  }

  useEffect(() => {
    mutate(columns, {
      onError: (error) => fetchError(error),
    })
  }, [columns])

  return (
    <>
      {/* new */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Tooltip label="Add New Todo" withArrow>
          <ActionIcon
            onClick={() =>
              navigate({
                to: '/manage/create',
              })
            }
            radius={'lg'}
            size={'lg'}
          >
            <FaPlus />
          </ActionIcon>
        </Tooltip>
      </Affix>

      {/* alert delete */}
      <Modal
        centered
        opened={openedConfirmDeleteModal}
        onClose={closeConfirmDeleteModal}
        title={<Text fw={500}>Confirm Deletion</Text>}
      >
        <Text c={'red'}>
          Are you sure you want to delete these {checkedItems.length} items?
        </Text>
        <Group justify="end" align="center">
          <Button variant="default" onClick={closeConfirmDeleteModal}>
            Cancel
          </Button>
          <Button color="red">Delete</Button>
        </Group>
      </Modal>

      {/* Action Bar */}
      {!isEmpty(checkedItems) && (
        <Box
          onClick={() => console.log(columns, manageTodoData)}
          className={clsx(styles.actionBar)}
        >
          <Flex justify={'space-between'} align={'center'}>
            <Text>
              {checkedItems.length} Todo{checkedItems.length > 1 ? 's' : ''}{' '}
              have been selected
            </Text>
            <Group>
              <Button variant="default" onClick={() => setCheckedItems([])}>
                Clear
              </Button>
              <Button onClick={openConfirmDeleteModal} color="red">
                Delete
              </Button>
            </Group>
          </Flex>
        </Box>
      )}

      <Grid gutter={12}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([colId, data]) => (
            <Grid.Col key={colId} span={{ base: 12, sm: 4 }}>
              {/* head */}
              <Box
                py={8}
                className={clsx(
                  [(colId as string).toLowerCase()],
                  styles[(colId as string).toLowerCase()],
                )}
                ta={'center'}
              >
                <Title order={3}>{colId.toUpperCase()}</Title>
              </Box>
              <Droppable
                isDropDisabled={isPending}
                key={colId}
                droppableId={colId}
              >
                {(provided) => (
                  // items
                  <Stack
                    style={{
                      opacity: isPending ? 0.5 : 1,
                    }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={clsx(styles.categories, [
                      (colId as string).toLowerCase(),
                    ])}
                  >
                    {data.length === 0 && <Text>No Items</Text>}

                    {data.map((t: IManageTodo, i: number) => (
                      <Draggable
                        isDragDisabled={isPending}
                        key={t.id}
                        draggableId={String(t.id)}
                        index={i}
                      >
                        {(provided) => (
                          <Box
                            className={clsx(
                              styles.dragItem,
                              styles[(colId as string).toLowerCase()],
                            )}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <Stack gap={'sm'}>
                              <Flex justify={'space-between'} align={'center'}>
                                <Flex align={'center'} gap={8}>
                                  <Checkbox
                                    name={String(t.id)}
                                    onChange={(e) => {
                                      const { checked, name } = e.target
                                      if (checked) {
                                        setCheckedItems((prev) => [
                                          ...prev,
                                          name,
                                        ])
                                      } else {
                                        setCheckedItems((prev) =>
                                          prev.filter((item) => item !== name),
                                        )
                                      }
                                    }}
                                    checked={checkedItems.includes(
                                      String(t.id),
                                    )}
                                  />
                                  <Title order={4}>{t.title}</Title>
                                </Flex>
                                <Badge
                                  className={clsx(
                                    '!bg-rose-100',
                                    '!text-rose-700',
                                  )}
                                >
                                  {t.priority}
                                </Badge>
                              </Flex>
                              {/* <Text>{t.description}</Text> */}
                              <Flex
                                gap={8}
                                wrap={'wrap'}
                                justify={'space-between'}
                                align={'center'}
                              >
                                <Flex gap={8} align={'center'}>
                                  <Badge variant="outline">{t.type}</Badge>
                                </Flex>
                                {t?.endDate && (
                                  <Flex
                                    c={isAfter(t.endDate) ? 'red' : 'dimmed'}
                                    gap={8}
                                    align={'center'}
                                  >
                                    <CiTimer size={16} />
                                    <Text size="sm">{fromNow(t.endDate)}</Text>
                                  </Flex>
                                )}
                              </Flex>
                            </Stack>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </Grid.Col>
          ))}
        </DragDropContext>
      </Grid>
    </>
  )
}

export default ManageTodo
