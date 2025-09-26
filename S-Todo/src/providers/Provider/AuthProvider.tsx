import { useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import FullScreenLoader from '@/components/Loaders/FullScreenLoader'
import { useNavigate, useRouter } from '@tanstack/react-router'
import type { IUser } from '@/constants/Data'
import axiosClient from '@/config/axios'
import { PUBLIC_ROUTES } from '@/constants/App'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const router = useRouter()
  const location = router?.state?.location?.pathname || ''

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(location)
    axiosClient
      .get('/auth/me')
      .then((res) => {
        setUser(res.data)
        if (isPublic) {
          navigate({
            to: '/',
            replace: true,
          })
        }
      })
      .catch(() => {
        setUser(null)
        if (!isPublic) {
          navigate({
            to: '/auth/login',
          })
        }
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 2000)
      })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
