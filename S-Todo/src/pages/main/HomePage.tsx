import {
  Badge,
  Box,
  Center,
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
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'
import { LuUsersRound } from 'react-icons/lu'
import { CiTimer } from 'react-icons/ci'

function HomePage() {
  const { getCurrentDay, fromNow, isAfter } = useDayJs()
  const day = getCurrentDay()

  const data = [
    { name: 'Done', value: 3 },
    { name: 'Left', value: 2 },
  ]

  const barData = [
    {
      name: 'New',
      amount: 1,
    },
    {
      name: 'In-Progress',
      amount: 3,
    },
    {
      name: 'Done',
      amount: 2,
    },
    {
      name: 'Priority',
      amount: 1,
    },
  ]

  const RADIAN = Math.PI / 180
  const COLORS = ['#3bb53fff', 'gray']
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink']

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <>
      <Flex gap={20}>
        <Stack miw={380} px={40} className={clsx(styles.leftGrid)}>
          <Flex justify={'space-between'} align={'center'}>
            <Text className={clsx(styles.day, styles[day.toLowerCase()])}>
              {day}
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
        <Grid
          styles={{
            inner: {
              height: '100%',
            },
          }}
          px={20}
          flex={1}
          align="stretch"
        >
          <Grid.Col span={{ md: 12, lg: 6 }}>
            <Box
              className={clsx(styles.todoCard, 'priority')}
              style={{ height: '100%' }}
            >
              <Flex h={'100%'} direction={'column'}>
                <Box flex={1}>
                  <Flex align={'center'} justify={'space-between'}>
                    <Title order={3}>First Todo</Title>
                    <Badge color="red" size="sm">
                      Priority
                    </Badge>
                  </Flex>
                  <Text
                    mb={16}
                    mt={8}
                    className={clsx(styles.textEllipsisTwoLines)}
                    w={'100%'}
                    size="sm"
                    c={'dimmed'}
                  >
                    This is a descripton dwqdqw dqw dqw dqw dqw dqw dqwd qwd
                    dasd qwdqw dqwd wqdqw dqw d qwd wqd qwdqw dqwd we qw wqd qw
                    dqw dqw dw qdqw d qwd qw dwq d wqf q fqw dwq d qwd
                  </Text>
                </Box>
                <Flex gap={8} justify={'space-between'} align={'center'}>
                  <Badge
                    color="white"
                    c={'black'}
                    bd={'1px solid #0000002b'}
                    size="sm"
                    leftSection={<LuUsersRound />}
                  >
                    Shared
                  </Badge>
                  <Flex
                    c={isAfter('2025-09-14') ? 'red' : 'dimmed'}
                    gap={8}
                    align={'center'}
                  >
                    <CiTimer size={16} />
                    <Text size="sm">{fromNow('2025-09-14')}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ md: 12, lg: 6 }}>
            <Box
              className={clsx(styles.todoCard, 'done')}
              style={{ height: '100%' }}
            >
              <Title order={3}>Done Todo</Title>
              <Text c={'dimmed'}>This is a descripton</Text>
              <Flex pt={12} gap={8}>
                <Badge color="#0085cc" size="sm">
                  Done
                </Badge>
              </Flex>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ md: 12, lg: 6 }}>
            <Box
              className={clsx(styles.todoCard, 'doing')}
              style={{ height: '100%' }}
            >
              <Title order={3}>Normal Todo</Title>
              <Text c={'dimmed'}>This is a descripton</Text>
              <Flex pt={12} gap={8}>
                <Badge color="#0085cc" size="sm">
                  In-Progress
                </Badge>
              </Flex>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ md: 12, lg: 6 }}>
            <Box
              className={clsx(styles.todoCard, 'new')}
              style={{ height: '100%' }}
            >
              <Title order={3}>New Todo</Title>
              <Text c={'dimmed'}>This is a descripton</Text>
              <Flex pt={12} gap={8}>
                <Badge color="#0085cc" size="sm">
                  New
                </Badge>
              </Flex>
            </Box>
          </Grid.Col>
        </Grid>
      </Flex>

      {/* Overview */}
      <Box mt={20} pt={20} className={clsx(styles.borderTop)}>
        <Grid gutter={0}>
          <Grid.Col span={12}>
            <Title pl={12} order={3}>
              Overview
            </Title>
            <Center>
              <BarChart width={400} height={240} data={barData}>
                <XAxis dataKey={'name'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="red">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                  ))}
                </Bar>
              </BarChart>
            </Center>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  )
}

export default HomePage
