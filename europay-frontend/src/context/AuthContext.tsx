import { createContext, useContext, useState, ReactNode } from 'react'
import type { AuthResponse } from '../types'

interface AuthContextType {
  token: string | null
  userId: string | null
  isAuthenticated: boolean
  login: (data: AuthResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'))

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setToken(data.token)
    setUserId(data.userId)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ token, userId, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
