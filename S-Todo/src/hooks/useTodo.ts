import axiosClient from '@/config/axios'
import type { IManageTodoData } from '@/constants/Data'
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

  return {
    createNewTodo,
    updateTodoManage,
    deleteTodoMutation,
    getAllOnwerTodo,
  }
}

export default useTodo
