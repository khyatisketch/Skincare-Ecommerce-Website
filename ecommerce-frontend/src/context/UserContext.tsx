// context/UserContext.tsx (rename if still .js)
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

// Define the shape of a user
interface User {
  id: number
  phone: string
  email?: string
  name?: string
  profileImageUrl?: string
  role: string
}

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(res.data.result)
    } catch (err) {
      setUser(null)
      console.log("Error", err);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
