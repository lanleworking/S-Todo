import { createContext, useContext } from 'react'

/**
 * Provides a Date that updates every minute globally.
 * Components subscribe here instead of each owning their own interval,
 * so all payment countdown displays stay in sync.
 */
export const PaymentTimerContext = createContext<Date>(new Date())

export function usePaymentTimer(): Date {
  return useContext(PaymentTimerContext)
}
