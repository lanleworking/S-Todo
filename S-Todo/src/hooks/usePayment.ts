import axiosClient from '@/config/axios'
import { useMutation } from '@tanstack/react-query'

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
  return { createPaymentMutate, getPayment, cancelPayment }
}

export default usePayment
