import { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue, useTransform } from 'framer-motion'

type AnimatedNumberProps = {
  value: number
  duration?: number // seconds
  className?: string
  locale?: string // e.g. "en-US", "de-DE", "vi-VN"
  options?: Intl.NumberFormatOptions // to customize format
}

function AnimatedNumber({
  value,
  duration = 0.8,
  className,
  locale = 'en-US',
  options = {},
}: AnimatedNumberProps) {
  const numericValue = Number(value) || 0 // Ensure it's always a number
  const previousValueRef = useRef<number>(0)
  const motionValue = useMotionValue(0) // Start from 0 instead of previousValueRef.current
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))
  const [display, setDisplay] = useState(
    new Intl.NumberFormat(locale, options).format(0), // Start from 0
  )

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplay(new Intl.NumberFormat(locale, options).format(latest))
    })
    return () => unsubscribe()
  }, [rounded, locale, options])

  useEffect(() => {
    const from = previousValueRef.current
    const to = numericValue

    if (from !== to && !isNaN(to) && !isNaN(from)) {
      const controls = animate(motionValue, to, { duration })
      previousValueRef.current = to
      return controls.stop
    }

    if (!isNaN(numericValue)) {
      setDisplay(new Intl.NumberFormat(locale, options).format(numericValue))
      previousValueRef.current = numericValue
    }

    return () => undefined
  }, [numericValue, duration, locale, options, motionValue])

  return <span className={className}>{display}</span>
}

export default AnimatedNumber
