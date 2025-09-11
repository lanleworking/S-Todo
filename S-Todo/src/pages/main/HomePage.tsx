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
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

function HomePage() {
  const { getCurrentDay } = useDayJs()
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
    <Box px={40} mt={20}>
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
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Box
              className={clsx(styles.todoCard, styles.priority)}
              style={{ height: '100%' }}
            >
              <Flex h={'100%'} direction={'column'}>
                <Box flex={1}>
                  <Title order={3}>First Todo</Title>
                  <Text
                    className={clsx(styles.textEllipsisTwoLines)}
                    w={'100%'}
                    c={'dimmed'}
                  >
                    This is a descripton dwqdqw dqw dqw dqw dqw dqw dqwd qwd
                    dasd qwdqw dqwd wqdqw dqw d qwd wqd qwdqw dqwd we qw wqd qw
                    dqw dqw dw qdqw d qwd qw dwq d wqf q fqw dwq d qwd
                  </Text>
                </Box>
                <Flex pt={12} gap={8}>
                  <Badge color="red" size="sm">
                    Priority
                  </Badge>
                  <Badge color="#0085cc" size="sm">
                    Done
                  </Badge>
                </Flex>
              </Flex>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Box
              className={clsx(styles.todoCard, styles.done)}
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

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Box className={clsx(styles.todoCard)} style={{ height: '100%' }}>
              <Title order={3}>Normal Todo</Title>
              <Text c={'dimmed'}>This is a descripton</Text>
              <Flex pt={12} gap={8}>
                <Badge color="#0085cc" size="sm">
                  In-Progress
                </Badge>
              </Flex>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Box
              className={clsx(styles.todoCard, styles.new)}
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
        <Title order={3}>Overview</Title>
        <Grid gutter={0}>
          <Grid.Col className={clsx(styles.leftGrid)} h={200} span={6}>
            <ResponsiveContainer width={'100%'} height={'100%'}>
              <PieChart>
                <Pie
                  label={renderCustomizedLabel}
                  labelLine={false}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  data={data}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid.Col>
          <Grid.Col span={6}>
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
    </Box>
  )
}

export default HomePage
