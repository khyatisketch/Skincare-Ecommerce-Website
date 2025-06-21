import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
  
    try {
      const parsedUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null
  
      if (storedToken && parsedUser) {
        setToken(storedToken)
        setUser(parsedUser)
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err)
      localStorage.removeItem('user') // Clean up bad data
    }
  
    setLoading(false)
  }, [])
  

  const login = ({ token, user }) => {
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
