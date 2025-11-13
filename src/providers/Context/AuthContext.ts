import type { IUser } from '@/constants/Data'
import { createContext } from 'react'

type AuthContextType = {
  user: IUser | null
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: false,
  setIsLoading: () => {},
})
