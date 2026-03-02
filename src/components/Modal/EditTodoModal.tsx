import { RichTextEditor } from '@/components/RichTextEditor'
import { ETodoPriority, ETodoStatus, type ITodoData } from '@/constants/Data'
import useTodo from '@/hooks/useTodo'
import { fetchError } from '@/utils/toast/fetchError'
import { validateForm } from '@/utils/validate/validateForm'
import {
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CiCalendarDate, CiText } from 'react-icons/ci'
import {
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLowPriority,
} from 'react-icons/md'
import { LuListTodo } from 'react-icons/lu'
import toast from 'react-hot-toast'

type EditTodoModalProps = {
  opened: boolean
  onClose: () => void
  data: ITodoData
  onSuccess: (updated: ITodoData) => void
}

function EditTodoModal({
  opened,
  onClose,
  data,
  onSuccess,
}: EditTodoModalProps) {
  const { t } = useTranslation()
  const { updateTodo } = useTodo()
  const { mutate, isPending } = updateTodo
  const [descValue, setDescValue] = useState(data.description || '')

  const { key, onSubmit, getInputProps, getValues, setValues } = useForm({
    mode: 'controlled',
    initialValues: {
      title: data.title,
      shortDescription: data.shortDescription || '',
      status: data.status,
      priority: data.priority,
      type: data.type,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      expectedAmount: data.expectedAmount ?? 0,
    },
    validate: {
      title: (value) => validateForm(value, t, { maxLength: 100 }),
      shortDescription: (value) => validateForm(value, t, { maxLength: 255 }),
      priority: (value) => validateForm(value, t),
      type: (value) => validateForm(value, t),
    },
  })

  useEffect(() => {
    if (opened) {
      setValues({
        title: data.title,
        shortDescription: data.shortDescription || '',
        status: data.status,
        priority: data.priority,
        type: data.type,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        expectedAmount: data.expectedAmount ?? 0,
      })
      setDescValue(data.description || '')
    }
  }, [opened, data])

  const handleSubmit = (values: any) => {
    mutate(
      {
        todoId: data.id,
        data: { ...values, description: descValue },
      },
      {
        onSuccess: (updated) => {
          toast.success('Todo updated!')
          onSuccess(updated)
          onClose()
        },
        onError: (e) => fetchError(e),
      },
    )
  }

  return (
    <Modal
      size="xl"
      centered
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          Edit Todo
        </Text>
      }
    >
      <form onSubmit={onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              description="Max 100 characters"
              key={key('title')}
              {...getInputProps('title')}
              withAsterisk
              label="Title"
              leftSection={<CiText />}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              description="Max 255 characters"
              key={key('shortDescription')}
              {...getInputProps('shortDescription')}
              withAsterisk
              label="Short Description"
              leftSection={<CiText />}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <RadioGroup
              label="Status"
              withAsterisk
              key={key('status')}
              {...getInputProps('status')}
            >
              <Flex mt={12} gap={24} align="center">
                <Radio value={ETodoStatus.NEW} label="New" />
                <Radio
                  color="yellow"
                  value={ETodoStatus.DOING}
                  label="In Progress"
                />
                <Radio color="green" value={ETodoStatus.DONE} label="Done" />
              </Flex>
            </RadioGroup>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              key={key('priority')}
              {...getInputProps('priority')}
              leftSection={<MdOutlineLowPriority />}
              withAsterisk
              clearable
              label="Priority"
              placeholder="Choose priority"
              data={[
                { value: ETodoPriority.LOW, label: 'Low' },
                { value: ETodoPriority.MEDIUM, label: 'Medium' },
                { value: ETodoPriority.HIGH, label: 'High' },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              key={key('type')}
              {...getInputProps('type')}
              clearable
              leftSection={<LuListTodo />}
              withAsterisk
              label="Type"
              placeholder="Choose type"
              data={[
                { value: 'fund', label: 'Fund' },
                { value: 'personal', label: 'Personal' },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              clearable
              key={key('startDate')}
              {...getInputProps('startDate')}
              label="Start Date"
              withAsterisk
              placeholder="Choose date"
              leftSection={<CiCalendarDate />}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              clearable
              key={key('endDate')}
              {...getInputProps('endDate')}
              minDate={getValues().startDate || new Date()}
              label="End Date"
              placeholder="Choose date"
              leftSection={<CiCalendarDate />}
            />
          </Grid.Col>

          {getValues().type === 'fund' && (
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <NumberInput
                key={key('expectedAmount')}
                {...getInputProps('expectedAmount')}
                min={0}
                thousandSeparator
                label="Expected Amount"
                placeholder="0"
                hideControls
                leftSection={<MdAttachMoney />}
                rightSection={
                  <Text size="sm" mr={20}>
                    VND
                  </Text>
                }
              />
            </Grid.Col>
          )}

          <Grid.Col span={12}>
            <Divider
              label={
                <Flex align="center" gap={6}>
                  <MdOutlineDescription /> Description
                </Flex>
              }
              labelPosition="left"
            />
            <RichTextEditor value={descValue} onChange={setDescValue} />
          </Grid.Col>
        </Grid>

        <Stack mt="md">
          <Divider />
          <Group justify="end" mb={8}>
            <Button variant="subtle" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default EditTodoModal
