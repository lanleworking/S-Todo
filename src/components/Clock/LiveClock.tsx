import { useEffect, useState } from 'react'
import { Text } from '@mantine/core'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'

type LiveClockProps = {
  size?: string | number
  className?: string
}

export default function LiveClock({
  size = '1.25rem',
  className = '',
}: LiveClockProps) {
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 500)
    return () => clearInterval(id)
  }, [])

  const seconds = now.getSeconds()
  const showColon = seconds % 2 === 0

  const hour = dayjs(now).format('hh')
  const minute = dayjs(now).format('mm')
  const ampm = dayjs(now).format('A')

  return (
    <Text
      role="timer"
      aria-live="polite"
      className={className}
      style={{
        fontSize: size,
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-flex',
        alignItems: 'baseline',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={hour}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{ lineHeight: 1 }}
        >
          {hour}
        </motion.span>
      </AnimatePresence>

      <motion.span
        aria-hidden
        animate={{ opacity: showColon ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          width: '0.6ch',
          textAlign: 'center',
          display: 'inline-block',
          paddingRight: '12px',
        }}
      >
        :
      </motion.span>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={minute}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{ lineHeight: 1 }}
        >
          {minute}
        </motion.span>
      </AnimatePresence>

      <motion.span
        style={{ marginLeft: 8, fontSize: '0.6em', lineHeight: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {ampm}
      </motion.span>
    </Text>
  )
}
