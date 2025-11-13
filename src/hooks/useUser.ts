import axiosClient from '@/config/axios'
import { useMutation } from '@tanstack/react-query'

function useUser() {
  const changeAvtMutate = useMutation({
    mutationKey: ['change-avt'],
    mutationFn: async (file: File) => {
      const res = await axiosClient.put(
        '/user/avt',
        {
          newAvtFile: file,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return res.data
    },
  })

  const changePassMutate = useMutation({
    mutationKey: ['change-pass'],
    mutationFn: async (data: {
      currentPassword: string
      newPassword: string
    }) => {
      const res = await axiosClient.put('/user/pass', data)
      return res.data
    },
  })

  const changeNameMutate = useMutation({
    mutationKey: ['change-name'],
    mutationFn: async (data: { newName: string }) => {
      const res = await axiosClient.put('/user/fullname', data)
      return res.data
    },
  })

  const storeUserTokenMutate = useMutation({
    mutationKey: ['store-user-token'],
    mutationFn: async (data: { token: string }) => {
      const res = await axiosClient.post('/user/store-token', data)
      return res.data
    },
  })

  return {
    changeAvtMutate,
    changePassMutate,
    changeNameMutate,
    storeUserTokenMutate,
  }
}

export default useUser
