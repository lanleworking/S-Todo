import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isYesterday from 'dayjs/plugin/isYesterday'

function useDayJs() {
  dayjs.extend(relativeTime)
  dayjs.extend(isYesterday)
  return {
    getCurrentDate: () => dayjs().format('YYYY-MM-DD'),
    getCurrentDay: () => dayjs().format('dddd'),
    getCurrentMonth: () => dayjs().format('MMMM'),
    getCurrentYear: () => dayjs().format('YYYY'),
    getCurrentTime: () => dayjs().format('HH:mm:ss'),
    formatDate: (date: string | Date) => dayjs(date).format('YYYY-MM-DD'),
    isToday: (date: string | Date) => dayjs(date).isSame(dayjs(), 'day'),
    addDays: (date: string | Date, days: number) =>
      dayjs(date).add(days, 'day'),
    subtractDays: (date: string | Date, days: number) =>
      dayjs(date).subtract(days, 'day'),
    getDaysDifference: (date1: string | Date, date2: string | Date) =>
      dayjs(date1).diff(dayjs(date2), 'day'),
    fromNow: (date: string | Date) => dayjs(date).fromNow(),
    isYesterday: (date: string | Date) => dayjs(date).isYesterday(),
    isAfter: (date2: string | Date) => dayjs().isAfter(dayjs(date2)),
  }
}

export default useDayJs
