import axiosClient from '@/config/axios'
import type { IPaymentHistoryResponse } from '@/constants/Data'
import { useMutation, useQuery } from '@tanstack/react-query'

function usePayment() {
  const createPaymentMutate = useMutation({
    mutationKey: ['create-payment'],
    mutationFn: async (data: any) => {
      const res = await axiosClient.post('/payment/createLink', data)
      return res.data
    },
  })

  const getPayment = useMutation({
    mutationKey: ['get-payment'],
    mutationFn: async (paymentId: string) => {
      const res = await axiosClient.get(`/payment/get/${paymentId}`)
      return res.data
    },
  })

  const cancelPayment = useMutation({
    mutationKey: ['cancel-payment'],
    mutationFn: async (paymentId: string) => {
      const res = await axiosClient.post(`/payment/cancelPayment/${paymentId}`)
      return res.data
    },
  })

  const getPaymentHistory = (page: number = 1, limit: number = 10) =>
    useQuery<IPaymentHistoryResponse>({
      queryKey: ['payment-history', page, limit],
      queryFn: async () => {
        const res = await axiosClient.get('/payment/history', {
          params: { page, limit },
        })
        return res.data
      },
      enabled: false,
    })

  const withdrawFund = useMutation({
    mutationKey: ['withdraw-fund'],
    mutationFn: async (data: {
      todoId: number
      amount: number
      note?: string
    }) => {
      const res = await axiosClient.post('/payment/withdraw', data)
      return res.data
    },
  })

  return {
    createPaymentMutate,
    getPayment,
    cancelPayment,
    getPaymentHistory,
    withdrawFund,
  }
}

export default usePayment
