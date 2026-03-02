import { animate } from 'animejs'
import { useEffect, useRef } from 'react'

type AnimatedNumberProps = {
  value: number
  duration?: number // seconds
  className?: string
  locale?: string
  options?: Intl.NumberFormatOptions
}

function AnimatedNumber({
  value,
  duration = 0.8,
  className,
  locale = 'en-US',
  options = {},
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevRef = useRef<number>(0)
  // Keep latest config in refs so the effect only re-runs when `value` changes
  const localeRef = useRef(locale)
  const optionsRef = useRef(options)
  const durationRef = useRef(duration)

  localeRef.current = locale
  optionsRef.current = options
  durationRef.current = duration

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const from = prevRef.current
    prevRef.current = value
    const obj = { val: from }

    animate(obj, {
      val: value,
      duration: durationRef.current * 1000,
      ease: 'outExpo',
      onUpdate: () => {
        el.textContent = new Intl.NumberFormat(
          localeRef.current,
          optionsRef.current,
        ).format(Math.round(obj.val))
      },
    })
  }, [value])

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat(locale, options).format(0)}
    </span>
  )
}

export default AnimatedNumber
