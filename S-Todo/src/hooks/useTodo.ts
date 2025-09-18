import axiosClient from '@/config/axios'
import { useMutation } from '@tanstack/react-query'

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

  return { createNewTodo, updateTodoManage }
}

export default useTodo
