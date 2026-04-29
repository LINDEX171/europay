import { createContext, useContext, useState, ReactNode } from 'react'
import type { AuthResponse } from '../types'

interface AuthContextType {
  token: string | null
  userId: string | null
  role: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (data: AuthResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'))
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'))

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('role', data.role)
    setToken(data.token)
    setUserId(data.userId)
    setRole(data.role)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    setToken(null)
    setUserId(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{
      token, userId, role,
      isAuthenticated: !!token,
      isAdmin: role === 'ROLE_ADMIN',
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
