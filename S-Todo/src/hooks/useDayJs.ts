import dayjs from 'dayjs'

function useDayJs() {
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
  }
}

export default useDayJs
