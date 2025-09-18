import axiosClient from '@/config/axios'
import type { IUser } from '@/constants/Data'
import { useMutation } from '@tanstack/react-query'

function useAuth() {
  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: async (payload: any) => {
      const res = await axiosClient.post('/auth/register', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    },
  })

  // login
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (payload: any): Promise<IUser> => {
      const res = await axiosClient.post('/auth/login', payload)
      return res.data
    },
  })

  // logout
  const logOutMutation = useMutation({
    mutationKey: ['logOut'],
    mutationFn: async () => {
      const res = await axiosClient.post('/auth/logout')
      return res.data
    },
  })

  return { registerMutation, loginMutation, logOutMutation }
}

export default useAuth
