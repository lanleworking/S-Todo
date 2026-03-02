import { animate } from 'animejs'
import { useEffect, useRef, useState } from 'react'
import { Text } from '@mantine/core'
import dayjs from 'dayjs'

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

  // Refs for animatable elements
  const hourRef = useRef<HTMLSpanElement>(null)
  const minuteRef = useRef<HTMLSpanElement>(null)
  const colonRef = useRef<HTMLSpanElement>(null)
  const ampmRef = useRef<HTMLSpanElement>(null)

  // Animate colon opacity on blink
  useEffect(() => {
    if (!colonRef.current) return
    animate(colonRef.current, {
      opacity: showColon ? 1 : 0,
      duration: 300,
      ease: 'inOutSine',
    })
  }, [showColon])

  // Animate hour digit flip
  const prevHour = useRef(hour)
  useEffect(() => {
    if (!hourRef.current || prevHour.current === hour) return
    prevHour.current = hour
    animate(hourRef.current, {
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 300,
      ease: 'outCubic',
    })
  }, [hour])

  // Animate minute digit flip
  const prevMinute = useRef(minute)
  useEffect(() => {
    if (!minuteRef.current || prevMinute.current === minute) return
    prevMinute.current = minute
    animate(minuteRef.current, {
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 300,
      ease: 'outCubic',
    })
  }, [minute])

  // Fade in ampm on mount
  useEffect(() => {
    if (!ampmRef.current) return
    animate(ampmRef.current, {
      opacity: [0, 1],
      duration: 400,
      ease: 'outCubic',
    })
  }, [])

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
      <span ref={hourRef} style={{ lineHeight: 1 }}>
        {hour}
      </span>

      <span
        ref={colonRef}
        aria-hidden
        style={{
          width: '0.6ch',
          textAlign: 'center',
          display: 'inline-block',
          paddingRight: '12px',
        }}
      >
        :
      </span>

      <span ref={minuteRef} style={{ lineHeight: 1 }}>
        {minute}
      </span>

      <span
        ref={ampmRef}
        style={{ marginLeft: 8, fontSize: '0.6em', lineHeight: 1 }}
      >
        {ampm}
      </span>
    </Text>
  )
}
