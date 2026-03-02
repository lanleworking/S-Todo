import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Calendar } from '@mantine/dates'
import styles from './HomePage.module.scss'
import clsx from 'clsx'
import dayjs from 'dayjs'
import LiveClock from '@/components/Clock/LiveClock'
import useDayJs from '@/hooks/useDayJs'
import { Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { LuUsersRound } from 'react-icons/lu'
import { CiTimer } from 'react-icons/ci'
import type { ITodo } from '@/constants/Data'
import {
  switchPriorityColor,
  switchStatusColor,
} from '@/utils/checkers/priority'
import useTodo from '@/hooks/useTodo'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useMediaQuery } from '@mantine/hooks'
import { MOBILE_MEDIAQUERY } from '@/constants/MediaQuery'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'

function HomePage({ todoData }: { todoData: ITodo[] }) {
  const isMobile = useMediaQuery(MOBILE_MEDIAQUERY)
  const { getCurrentDay, fromNow, isAfter } = useDayJs()
  const { getTodoStatusBarChart } = useTodo()
  const { t } = useTranslation()
  const day = getCurrentDay()
  const { data: barChartData, refetch: refetchBarChart } = getTodoStatusBarChart

  useEffect(() => {
    document.title = `${t('label.home')} | S-Todo`
    refetchBarChart()
  }, [])

  return (
    <>
      <Flex gap={20} direction={{ base: 'column', sm: 'row' }}>
        <Stack
          px={{ base: 0, sm: 40 }}
          className={clsx(!isMobile && styles.leftGrid)}
        >
          <Flex justify={'space-between'} align={'center'}>
            <Text className={clsx(styles.day, styles[day.toLowerCase()])}>
              {day.toUpperCase()}
            </Text>
            <LiveClock />
          </Flex>
          <Center>
            <Calendar
              getDayProps={(date) => {
                const isToday = dayjs(date).isSame(new Date(), 'date')
                return {
                  selected: isToday,
                  style: isToday
                    ? {
                        background: 'linear-gradient(135deg, #f7971e, #ffd200)',
                        color: 'white',
                      }
                    : {},
                }
              }}
              minDate={new Date()}
              level="month"
            />
          </Center>
        </Stack>
        <Divider />
        {isEmpty(todoData) ? (
          <Center w={'100%'}>
            <Empty />
          </Center>
        ) : (
          <Grid
            // styles={{
            //   inner: {
            //     height: '100%',
            //   },
            // }}
            px={{ base: 0, sm: 20 }}
            flex={1}
            align="stretch"
          >
            {Array.isArray(todoData) &&
              todoData.map((todo) => (
                <Grid.Col key={todo.id} span={{ md: 12, lg: 6 }}>
                  <Link to="/todo/$id" params={{ id: String(todo.id) }}>
                    <Box
                      className={clsx(
                        styles.todoCard,
                        todo.status.toLowerCase(),
                      )}
                      style={{ height: '100%' }}
                    >
                      <Flex h={'100%'} direction={'column'}>
                        <Box flex={1}>
                          <Flex align={'center'} justify={'space-between'}>
                            <Title c={'black'} order={3}>
                              {todo.title}
                            </Title>
                            <Badge
                              color={switchPriorityColor(todo.priority)}
                              size="sm"
                            >
                              {todo.priority}
                            </Badge>
                          </Flex>
                          <Text
                            mb={16}
                            mt={8}
                            className={clsx('textEllipsisTwoLines')}
                            w={'100%'}
                            size="sm"
                            c={'dimmed'}
                          >
                            {todo.shortDescription}
                          </Text>
                        </Box>
                        <Flex
                          gap={8}
                          justify={'space-between'}
                          align={'center'}
                        >
                          <Flex gap={8}>
                            {todo.shared && (
                              <Badge
                                color="white"
                                c={'black'}
                                bd={'1px solid #0000002b'}
                                size="sm"
                                leftSection={<LuUsersRound />}
                              >
                                Shared
                              </Badge>
                            )}
                            <Badge
                              color="white"
                              c={'black'}
                              bd={'1px solid #0000002b'}
                              size="sm"
                            >
                              {t(`label.${todo.type.toLowerCase()}`)}
                            </Badge>
                          </Flex>
                          {todo.endDate && (
                            <Flex
                              c={isAfter(todo.endDate) ? 'red' : 'dimmed'}
                              gap={8}
                              align={'center'}
                            >
                              <CiTimer size={16} />
                              <Text size="sm">{fromNow(todo.endDate)}</Text>
                            </Flex>
                          )}
                        </Flex>
                      </Flex>
                    </Box>
                  </Link>
                </Grid.Col>
              ))}
          </Grid>
        )}
      </Flex>

      {/* Overview */}
      <Box mt={20} pt={20} className={clsx(styles.borderTop)}>
        <Grid gutter={0}>
          <Grid.Col span={12}>
            <Title pl={12} order={3}>
              {t('label.overview')}
            </Title>
            <Center>
              {isEmpty(barChartData) || isEmpty(todoData) ? (
                <Empty />
              ) : (
                <BarChart width={400} height={240} data={barChartData}>
                  <XAxis dataKey={'status'} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="red">
                    {Array.isArray(barChartData) &&
                      barChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={switchStatusColor(entry.status)}
                        />
                      ))}
                  </Bar>
                </BarChart>
              )}
            </Center>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  )
}

export default HomePage
