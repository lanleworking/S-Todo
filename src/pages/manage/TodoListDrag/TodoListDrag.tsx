import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import {
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
} from '@mantine/core'
import { useEffect, useState } from 'react'
import styles from './TodoManager.module.scss'
import clsx from 'clsx'
import { CiTimer } from 'react-icons/ci'
import useDayJs from '@/hooks/useDayJs'
import { isEmpty, isObject } from 'lodash'
import { useDisclosure } from '@mantine/hooks'
import type { IManageTodo, IManageTodoData } from '@/constants/Data'
import useTodo from '@/hooks/useTodo'
import { fetchError } from '@/utils/toast/fetchError'
import toast from 'react-hot-toast'
import { CreateNewTodoBtn } from '@/components/Buttons/CreateNewTodoBtn'
import { switchPriorityColor } from '@/utils/checkers/priority'

type ManageTodoProps = {
  manageTodoData: IManageTodoData
}

function ManageTodo({ manageTodoData }: ManageTodoProps) {
  const [columns, setColumns] = useState<IManageTodoData>(manageTodoData)
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const { fromNow, isAfter } = useDayJs()
  const { updateTodoManage, deleteTodoMutation, getAllOnwerTodo } = useTodo()
  const [
    openedConfirmDeleteModal,
    { open: openConfirmDeleteModal, close: closeConfirmDeleteModal },
  ] = useDisclosure(false)

  const { data: allOwnerTodoData, refetch: refetchAllOwnerTodo } =
    getAllOnwerTodo
  const { mutate: deleteTodoMutate, isPending: isDeleting } = deleteTodoMutation
  const { mutate, isPending } = updateTodoManage

  // handlers
  const reassignOrder = (items: IManageTodo[]) =>
    items.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))

  const handleDelete = () => {
    deleteTodoMutate(checkedItems, {
      onSuccess: () => {
        toast.success(`✅ - Delete Success`)
        refetchAllOwnerTodo()
        closeConfirmDeleteModal()
        setCheckedItems([])
      },
    })
  }

  const onDragEnd = (result: DropResult) => {
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

  // effect
  useEffect(() => {
    mutate(columns, {
      onError: (error) => fetchError(error),
    })
  }, [columns])

  useEffect(() => {
    if (isObject(allOwnerTodoData)) {
      setColumns(allOwnerTodoData)
    }
  }, [allOwnerTodoData])

  return (
    <>
      {/* new */}
      <CreateNewTodoBtn />
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
          <Button
            disabled={isDeleting}
            variant="default"
            onClick={closeConfirmDeleteModal}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} loading={isDeleting} color="red">
            Delete
          </Button>
        </Group>
      </Modal>

      {/* Action Bar */}
      {!isEmpty(checkedItems) && (
        <Box className={clsx(styles.actionBar)}>
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
                    {Array.isArray(data) && data.length === 0 && (
                      <Text>No Items</Text>
                    )}

                    {Array.isArray(data) &&
                      data.map((t: IManageTodo, i: number) => (
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
                                <Flex
                                  justify={'space-between'}
                                  align={'center'}
                                >
                                  <Flex align={'center'} gap={8}>
                                    <Checkbox
                                      name={String(t.id)}
                                      onChange={(e) => {
                                        const { checked } = e.target
                                        if (checked) {
                                          setCheckedItems((prev) => [
                                            ...prev,
                                            t.id,
                                          ])
                                        } else {
                                          setCheckedItems((prev) =>
                                            prev.filter(
                                              (item) => item !== t.id,
                                            ),
                                          )
                                        }
                                      }}
                                      checked={checkedItems.includes(t.id)}
                                    />
                                    <Title order={4}>{t.title}</Title>
                                  </Flex>
                                  <Badge
                                    variant="light"
                                    bd="1px solid"
                                    color={switchPriorityColor(t.priority)}
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
                                      <Text size="sm">
                                        {fromNow(t.endDate)}
                                      </Text>
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
