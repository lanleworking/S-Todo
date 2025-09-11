import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { Box, Button, Flex, Text, Title } from '@mantine/core'
import { useState } from 'react'

type ColumnKey = 'NEW' | 'IN_PROGRESS' | 'PRIORITY' | 'DONE'

type Column = {
  id: string
  text: string
  order: number
}

type Columns = {
  [key: string]: Column[]
}

const initialData: Record<ColumnKey, Column[]> = {
  NEW: [
    {
      id: '1',
      text: 'Todo 1',
      order: 1,
    },
    {
      id: '2',
      text: 'Todo 2',
      order: 2,
    },
  ],
  IN_PROGRESS: [
    {
      id: '3',
      text: 'Todo 3',
      order: 1,
    },
  ],
  PRIORITY: [
    {
      id: '4',
      text: 'Todo 4',
      order: 1,
    },
  ],
  DONE: [],
}

function ManageTodo() {
  const [columns, setColumns] = useState<Columns>(initialData)

  const reassignOrder = (items: Column[]) =>
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
    const sourceCol = columns[source.droppableId]

    // data new col
    const destCol = columns[destination.droppableId]

    // get all data in old col
    const oldSourceCol = [...sourceCol]

    // get all data in new col
    const newDestCol =
      source.droppableId === destination.droppableId
        ? oldSourceCol
        : [...destCol]

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

  return (
    <Flex gap={12}>
      <Button onClick={() => console.log(columns)}>Click</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([colId, data]) => (
          <Droppable key={colId} droppableId={colId}>
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                <Title order={2}>{colId.toUpperCase()}</Title>
                {data.map((d, i) => (
                  <Draggable key={d.id} draggableId={d.id} index={i}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <Text>{d.text}</Text>
                      </Box>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Flex>
  )
}

export default ManageTodo
