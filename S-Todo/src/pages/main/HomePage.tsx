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

function HomePage() {
  const { getCurrentDay } = useDayJs()
  const day = getCurrentDay()

  return (
    <Flex gap={20} px={40} mt={20}>
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
      <Grid px={20} flex={1}>
        <Grid.Col span={{ sm: 12, md: 6, lg: 4 }}>
          <Box className={clsx(styles.todoCard, styles.priority)}>
            <Title order={3}>First Todo</Title>
            <Text c={'dimmed'}>This is a descripton</Text>
            <Flex pt={12} gap={8}>
              <Badge color="red" size="sm">
                Priority
              </Badge>
              <Badge color="#0085cc" size="sm">
                Done
              </Badge>
            </Flex>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ sm: 12, md: 6, lg: 4 }}>
          <Box className={clsx(styles.todoCard, styles.done)}>
            <Title order={3}>Done Todo</Title>
            <Text c={'dimmed'}>This is a descripton</Text>
            <Flex pt={12} gap={8}>
              <Badge color="#0085cc" size="sm">
                Done
              </Badge>
            </Flex>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ sm: 12, md: 6, lg: 4 }}>
          <Box className={clsx(styles.todoCard)}>
            <Title order={3}>Normal Todo</Title>
            <Text c={'dimmed'}>This is a descripton</Text>
            <Flex pt={12} gap={8}>
              {/* <Badge color="#0085cc" size="sm">
                Done
              </Badge> */}
            </Flex>
          </Box>
        </Grid.Col>
      </Grid>
    </Flex>
  )
}

export default HomePage
