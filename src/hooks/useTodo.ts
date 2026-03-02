import axiosClient from '@/config/axios'
import type {
  IChartData,
  IManageTodoData,
  ISelectOption,
  ITodoPaymentPayload,
  ITodoPaymentResponse,
  IUserDonation,
} from '@/constants/Data'
import { useMutation, useQuery } from '@tanstack/react-query'

function useTodo() {
  const createNewTodo = useMutation({
    mutationKey: ['createNewTodo'],
    mutationFn: async (data: any) => {
      const res = await axiosClient.post('/todo/create', data)
      return res.data
    },
  })

  const updateTodoManage = useMutation({
    mutationKey: ['updateTodoManage'],
    mutationFn: async (data: any) => {
      const res = await axiosClient.put('/todo/update/manage', data)
      return res.data
    },
  })

  const deleteTodoMutation = useMutation({
    mutationKey: ['deleteMutate'],
    mutationFn: async (todoId: number[]) => {
      const res = await axiosClient.delete('/todo/delete', {
        data: {
          todoId,
        },
      })
      return res.data
    },
  })

  const getAllOnwerTodo = useQuery<IManageTodoData>({
    queryKey: ['getAllOnwerTodo'],
    queryFn: async () => {
      const res = await axiosClient.get('/todo/all')
      return res.data
    },
    enabled: false,
  })

  const getPaymentLogs = (payload: ITodoPaymentPayload) =>
    useQuery<ITodoPaymentResponse>({
      queryKey: ['getPaymentLogs', payload.todoId],
      queryFn: async () => {
        const res = await axiosClient.get(
          `/todo/payment-log/${payload.todoId}`,
          {
            params: {
              limit: payload.limit,
              page: payload.page,
            },
          },
        )
        return res.data
      },
      enabled: false,
    })

  const getTodoById = (todoId: number) =>
    useQuery({
      queryKey: ['getTodoById', todoId],
      queryFn: async () => {
        const res = await axiosClient.get(`/todo/${todoId}`)
        return res.data
      },
      enabled: false,
    })

  const getTodoStatusBarChart = useQuery<IChartData[]>({
    queryKey: ['getTodoStatusBarChart'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get('/todo/barChartData')
        return Array.isArray(res.data) ? res.data : []
      } catch (error) {
        console.error('Failed to load bar chart data:', error)
        return []
      }
    },
    enabled: false,
  })

  const getUserOptions = useQuery<ISelectOption[]>({
    queryKey: ['getUserOptions'],
    queryFn: async () => {
      const res = await axiosClient.get('/todo/user-options')
      return Array.isArray(res.data) ? res.data : []
    },
    enabled: false,
  })

  const updateTodo = useMutation({
    mutationKey: ['updateTodo'],
    mutationFn: async ({ todoId, data }: { todoId: number; data: any }) => {
      const res = await axiosClient.put(`/todo/${todoId}/update`, data)
      return res.data
    },
  })

  const addUserToTodo = useMutation({
    mutationKey: ['addUserToTodo'],
    mutationFn: async ({
      todoId,
      userId,
    }: {
      todoId: number
      userId: string
    }) => {
      const res = await axiosClient.post(`/todo/${todoId}/members`, { userId })
      return res.data
    },
  })

  const getDonationChart = (todoId: number) =>
    useQuery<IUserDonation[]>({
      queryKey: ['getDonationChart', todoId],
      queryFn: async () => {
        const res = await axiosClient.get(`/todo/${todoId}/donation-chart`)
        return Array.isArray(res.data) ? res.data : []
      },
      enabled: false,
    })

  const removeUserFromTodo = useMutation({
    mutationKey: ['removeUserFromTodo'],
    mutationFn: async ({
      todoId,
      userId,
    }: {
      todoId: number
      userId: string
    }) => {
      const res = await axiosClient.delete(`/todo/${todoId}/members/${userId}`)
      return res.data
    },
  })

  return {
    createNewTodo,
    updateTodoManage,
    deleteTodoMutation,
    getAllOnwerTodo,
    getPaymentLogs,
    getTodoById,
    getTodoStatusBarChart,
    getUserOptions,
    getDonationChart,
    updateTodo,
    addUserToTodo,
    removeUserFromTodo,
  }
}

export default useTodo
