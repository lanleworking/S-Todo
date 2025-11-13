import { useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import FullScreenLoader from '@/components/Loaders/FullScreenLoader'
import { useNavigate, useRouter } from '@tanstack/react-router'
import type { IUser } from '@/constants/Data'
import axiosClient from '@/config/axios'
import { PUBLIC_ROUTES } from '@/constants/App'
import toast from 'react-hot-toast'

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
        const userData = res.data
        setUser(userData)

        // If we have user data and we're on a public route (login/register), redirect to home
        if (userData?.userId && isPublic) {
          navigate({
            to: '/',
            replace: true,
          })
        }
        // If we don't have valid user data and we're not on a public route, redirect to login
        else if (!userData?.userId && !isPublic) {
          toast.error('Authentication required. Please login.')
          setUser(null)
          navigate({
            to: '/auth/login',
          })
        }
        // Otherwise, stay on current page
      })
      .catch(() => {
        setUser(null)
        // If authentication fails and we're not on a public route, redirect to login
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
