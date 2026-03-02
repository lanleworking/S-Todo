import { useEffect, useRef, useState } from 'react'
import { PaymentTimerContext } from '../Context/PaymentTimerContext'

/**
 * Provides a globally shared "current time" that ticks every minute.
 * Wrap this high in the component tree so all payment countdown displays
 * stay in sync without each component running its own interval.
 */
function PaymentTimerProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<Date>(() => new Date())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Align the first tick to the start of the next minute
    const ms = new Date()
    const msUntilNextMinute =
      60_000 - (ms.getSeconds() * 1_000 + ms.getMilliseconds())

    const timeout = setTimeout(() => {
      setNow(new Date())
      timerRef.current = setInterval(() => setNow(new Date()), 60_000)
    }, msUntilNextMinute)

    return () => {
      clearTimeout(timeout)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <PaymentTimerContext.Provider value={now}>
      {children}
    </PaymentTimerContext.Provider>
  )
}

export default PaymentTimerProvider
