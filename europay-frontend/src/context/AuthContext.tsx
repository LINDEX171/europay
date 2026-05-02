import { createContext, useContext, useState, ReactNode } from 'react'
import type { AuthResponse } from '../types'

interface AuthContextType {
  token: string | null
  userId: string | null
  role: string | null
  firstName: string | null
  lastName: string | null
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
  const [firstName, setFirstName] = useState<string | null>(localStorage.getItem('firstName'))
  const [lastName, setLastName] = useState<string | null>(localStorage.getItem('lastName'))

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('role', data.role)
    localStorage.setItem('firstName', data.firstName)
    localStorage.setItem('lastName', data.lastName)
    setToken(data.token)
    setUserId(data.userId)
    setRole(data.role)
    setFirstName(data.firstName)
    setLastName(data.lastName)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    setToken(null)
    setUserId(null)
    setRole(null)
    setFirstName(null)
    setLastName(null)
  }

  return (
    <AuthContext.Provider value={{
      token, userId, role, firstName, lastName,
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
