import { RichTextEditor } from '@/components/RichTextEditor'
import { TitleWithReturn } from '@/components/TitleWithReturn'
import { ETodoPriority, ETodoStatus } from '@/constants/Data'
import useTodo from '@/hooks/useTodo'
import { fetchError } from '@/utils/toast/fetchError'
import { validateForm } from '@/utils/validate/validateForm'
import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CiCalendarDate, CiMoneyBill, CiText } from 'react-icons/ci'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { LuListTodo } from 'react-icons/lu'
import {
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineEditNotifications,
  MdOutlineLowPriority,
} from 'react-icons/md'

function CreateTodo() {
  const [descValue, setDescValue] = useState<string>('')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { createNewTodo } = useTodo()
  const { mutate: mutateNewTodo, isPending: isCreating } = createNewTodo
  const {
    getValues,
    onSubmit,
    isDirty,
    reset,
    key,
    getInputProps,
    setFieldError,
    errors,
  } = useForm({
    mode: 'controlled',
    initialValues: {
      title: '',
      startDate: null,
      endDate: null,
      priority: '',
      type: '',
      expectedAmount: 0,
      description: '',
    },
    validate: {
      title: (value) =>
        validateForm(value, t, {
          maxLength: 100,
        }),
      startDate: (value) => validateForm(value, t),
      priority: (value) => validateForm(value, t),
      type: (value) => validateForm(value, t),
    },
  })

  const handleSubmit = (formData: any) => {
    if (descValue.trim().length > 2000) {
      setFieldError(
        'description',
        'Description must be at most 2000 characters',
      )
      return
    }
    const modifiedFormData = {
      ...formData,
      description: descValue,
    }

    mutateNewTodo(modifiedFormData, {
      onSuccess: () => {
        navigate({ to: '/manage' })
      },
      onError: (error) => fetchError(error),
    })
  }

  useEffect(() => {
    return () => {
      reset()
    }
  }, [])

  return (
    <>
      <TitleWithReturn title="Create New Todo" />
      <form
        onSubmit={onSubmit(handleSubmit)}
        style={{ marginTop: 20, position: 'relative' }}
      >
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              key={key('title')}
              {...getInputProps('title')}
              withAsterisk
              label="Title"
              placeholder="Finish homework ..."
              leftSection={<CiText />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <DatePickerInput
              {...getInputProps('startDate')}
              key={key('startDate')}
              label="Start Date"
              withAsterisk
              minDate={new Date()}
              placeholder="Choose date"
              leftSection={<CiCalendarDate />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <DatePickerInput
              label="End Date"
              {...getInputProps('endDate')}
              key={key('endDate')}
              minDate={new Date()}
              placeholder="Choose date"
              leftSection={<CiCalendarDate />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              {...getInputProps('priority')}
              key={key('priority')}
              leftSection={<MdOutlineLowPriority />}
              withAsterisk
              clearable
              label="Priority"
              placeholder="Choose priority"
              data={[
                {
                  value: ETodoPriority.LOW,
                  label: 'Low',
                },
                {
                  value: ETodoPriority.MEDIUM,
                  label: 'Medium',
                },
                {
                  value: ETodoPriority.HIGH,
                  label: 'High',
                },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              {...getInputProps('type')}
              key={key('type')}
              clearable
              leftSection={<LuListTodo />}
              withAsterisk
              label="Type"
              placeholder="Choose type"
              data={[
                {
                  value: 'fund',
                  label: 'Fund',
                },
                {
                  value: 'personal',
                  label: 'Personal',
                },
              ]}
            />
          </Grid.Col>

          {/* fund settings */}
          {getValues().type === 'fund' && (
            <Grid.Col span={12}>
              <Stack>
                <Divider />
                <Card
                  styles={{
                    root: {
                      backgroundColor: '#8080801c',
                    },
                  }}
                  shadow="sm"
                  color="red"
                >
                  <Flex c={'green'} gap={8} align={'center'}>
                    <CiMoneyBill size={32} />
                    <Title order={4}>FUND SETTINGS</Title>
                  </Flex>
                  <Grid>
                    <Grid.Col span={12}>
                      <NumberInput
                        {...getInputProps('expectedAmount')}
                        key={key('expectedAmount')}
                        min={0}
                        thousandSeparator
                        label="Amount"
                        placeholder="Enter amount (default is 0)"
                        hideControls
                        leftSection={<MdAttachMoney />}
                        rightSection={
                          <Text size="sm" mr={20}>
                            VND
                          </Text>
                        }
                      />
                    </Grid.Col>
                  </Grid>
                </Card>
                <Divider />
              </Stack>
            </Grid.Col>
          )}

          {/* Description */}
          <Grid.Col span={12}>
            <Card
              styles={{
                root: {
                  backgroundColor: '#8080801c',
                },
              }}
              shadow="sm"
            >
              <Flex
                c={errors.description ? 'red' : 'brown'}
                mb={12}
                align={'center'}
                gap={8}
              >
                <MdOutlineDescription size={32} />
                <Title order={4}>DESCRIPTION</Title>
              </Flex>
              <RichTextEditor value={descValue} onChange={setDescValue} />
              {errors.description && <Text c="red">{errors.description}</Text>}
            </Card>
          </Grid.Col>

          {/* Notify */}
          {/* <Grid.Col span={12}>
            <Stack>
              <Divider />
              <Card
                styles={{
                  root: {
                    backgroundColor: '#8080801c',
                  },
                }}
                shadow="sm"
              >
                <Stack>
                  <Flex justify={'space-between'} align={'center'}>
                    <Flex align={'center'} gap={8}>
                      <MdOutlineEditNotifications size={32} />
                      <Title order={4}>NOTIFICATION</Title>
                    </Flex>

                    <Switch label="Enabled?" checked />
                  </Flex>
                  <Grid>
                    <Grid.Col span={6}>
                      <Select
                        clearable
                        withAsterisk
                        leftSection={<IoMdNotificationsOutline />}
                        label="Notification Type"
                        placeholder="Choose type"
                        data={[
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'daily', label: 'Daily' },
                        ]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DatePickerInput
                        withAsterisk
                        label="Notify at"
                        placeholder="Choose date"
                        leftSection={<CiCalendarDate />}
                        level="month"
                        valueFormat="[On] DD [Per Month]"
                        monthLabelFormat={'MMMM'}
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <Textarea
                        label="Message"
                        placeholder="Enter your message"
                        autosize
                      />
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col> */}
        </Grid>

        <Stack
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 1,
          }}
          mt={'md'}
        >
          <Divider />
          <Group
            style={{
              bottom: 12,
            }}
            mb={20}
            justify="end"
          >
            <Button variant="default">Cancel</Button>
            <Button loading={isCreating} disabled={!isDirty()} type="submit">
              Create Todo
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  )
}

export default CreateTodo
