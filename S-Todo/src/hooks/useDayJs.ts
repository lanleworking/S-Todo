import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isYesterday from 'dayjs/plugin/isYesterday'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function useDayJs() {
  const { i18n } = useTranslation()
  const [locale, setLocale] = useState<string>(i18n.language || 'en')

  // Configure dayjs plugins once
  dayjs.extend(relativeTime)
  dayjs.extend(isYesterday)

  useEffect(() => {
    // Set initial locale
    const currentLang = i18n.language || 'en'
    setLocale(currentLang)
    dayjs.locale(currentLang)

    // Listen for language changes
    const handleLanguageChange = (lang: string) => {
      setLocale(lang)
      dayjs.locale(lang)
    }

    i18n.on('languageChanged', handleLanguageChange)

    // Cleanup event listener
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])
  return {
    getCurrentDate: () => dayjs().format('YYYY-MM-DD'),
    getCurrentDay: () => dayjs().format('dddd'),
    getCurrentMonth: () => dayjs().format('MMMM'),
    getCurrentYear: () => dayjs().format('YYYY'),
    getCurrentTime: () => dayjs().format('HH:mm:ss'),
    formatDate: (date: string | Date) => dayjs(date).format('YYYY-MM-DD'),
    formatDateTime: (date: string | Date) =>
      dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
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
    getCurrentLocale: () => locale,
    setCurrentLocale: (newLocale: string) => {
      setLocale(newLocale)
      dayjs.locale(newLocale)
    },
  }
}

export default useDayJs
