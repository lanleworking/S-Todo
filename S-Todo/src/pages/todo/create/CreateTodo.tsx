import { CancelBtn } from '@/components/Buttons/CancelBtn'
import { RichTextEditor } from '@/components/RichTextEditor'
import { TitleWithReturn } from '@/components/TitleWithReturn'
import {
  ETodoPriority,
  ETodoStatus,
  type ISelectOption,
} from '@/constants/Data'
import useTodo from '@/hooks/useTodo'
import { AuthContext } from '@/providers/Context/AuthContext'
import { fetchError } from '@/utils/toast/fetchError'
import { validateForm } from '@/utils/validate/validateForm'
import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { use, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CiCalendarDate, CiMoneyBill, CiText } from 'react-icons/ci'
import { FiUsers } from 'react-icons/fi'
import { LuListTodo, LuUserSearch } from 'react-icons/lu'
import {
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLowPriority,
} from 'react-icons/md'

type CreateTodoProps = {
  userOptionsData: ISelectOption[]
}

function CreateTodo({ userOptionsData }: CreateTodoProps) {
  const [descValue, setDescValue] = useState<string>('')
  const navigate = useNavigate()
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const { createNewTodo } = useTodo()
  const { mutate: mutateNewTodo, isPending: isCreating } = createNewTodo

  const userOptions = useMemo(() => {
    const filterOwner = userOptionsData.filter((u) => u.value !== user?.userId)
    return filterOwner
  }, [userOptionsData, user?.userId])

  const pathName = router.history.location.pathname
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
      status: ETodoStatus.NEW,
      shared: false,
      sharedWith: [] as string[],
      shortDescription: '',
    },
    validate: {
      title: (value) =>
        validateForm(value, t, {
          maxLength: 100,
        }),
      startDate: (value) => validateForm(value, t),
      shortDescription: (value) => validateForm(value, t, { maxLength: 255 }),
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
      sharedWith: formData.shared ? formData.sharedWith : [],
    }
    mutateNewTodo(modifiedFormData, {
      onSuccess: (data) => {
        navigate({
          to: '/todo/$id',
          params: {
            id: String(data.id),
          },
        })
      },
      onError: (error) => fetchError(error),
    })
  }

  useEffect(() => {
    document.title = 'Create New Todo | S-Todo'
    return () => {
      reset()
    }
  }, [])

  return (
    <>
      <TitleWithReturn
        titleProps={{
          order: 3,
        }}
        title="Create New Todo"
      />
      <form
        onSubmit={onSubmit(handleSubmit)}
        style={{ marginTop: 20, position: 'relative' }}
      >
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              description={'Max characters: 100'}
              key={key('title')}
              {...getInputProps('title')}
              withAsterisk
              label="Title"
              placeholder="Finish homework ..."
              leftSection={<CiText />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              description={'Max characters: 255'}
              key={key('shortDescription')}
              {...getInputProps('shortDescription')}
              withAsterisk
              label="Short Description"
              placeholder="A brief description of the todo ..."
              leftSection={<CiText />}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <RadioGroup
              label="Status "
              title="Status"
              withAsterisk
              name="status"
              key={key('status')}
              {...getInputProps('status')}
            >
              <Flex mt={20} gap={40} justify={'center'} align={'center'}>
                <Radio value={ETodoStatus.NEW} label="New" />
                <Radio
                  color={'yellow'}
                  value={ETodoStatus.DOING}
                  label="In Progress"
                />
                <Radio color={'green'} value={ETodoStatus.DONE} label="Done" />
              </Flex>
            </RadioGroup>
          </Grid.Col>

          <Grid.Col span={6}>
            <DatePickerInput
              clearable
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
              clearable
              label="End Date"
              {...getInputProps('endDate')}
              key={key('endDate')}
              minDate={getValues().startDate || new Date()}
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
          <Grid.Col span={12}>
            <Title order={3}>Advance Setting</Title>
            <Card
              styles={{
                root: {
                  backgroundColor: '#8080801c',
                },
              }}
            >
              <Stack gap={'sm'}>
                <Switch
                  key={key('shared')}
                  {...getInputProps('shared')}
                  styles={{
                    labelWrapper: {
                      flex: 1,
                    },
                  }}
                  labelPosition="left"
                  description="Share this todo with others?"
                  label={
                    <Flex align={'center'} gap={8}>
                      <FiUsers />
                      <Text>Share?</Text>
                    </Flex>
                  }
                />
                {getValues().shared && (
                  <MultiSelect
                    searchable
                    clearable
                    key={key('sharedWith')}
                    {...getInputProps('sharedWith')}
                    data={userOptions}
                    leftSection={<LuUserSearch />}
                    placeholder={
                      getValues().sharedWith?.length
                        ? ''
                        : 'Select users to share'
                    }
                  />
                )}
              </Stack>
            </Card>
          </Grid.Col>
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
            <CancelBtn text="Cancel" />
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
