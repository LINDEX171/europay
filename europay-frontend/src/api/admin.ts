import client from './client'
import type { Account, Transaction } from '../types'

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  enabled: boolean
  createdAt: string
}

export const getAdminUsers = () => client.get<AdminUser[]>('/api/auth/admin/users')
export const patchUser = (id: string, data: { role?: string; enabled?: boolean }) =>
  client.patch<AdminUser>(`/api/auth/admin/users/${id}`, data)
export const getAdminAccounts = () => client.get<Account[]>('/api/accounts/admin/all')
export const patchAccountStatus = (id: string, status: string) =>
  client.patch<Account>(`/api/accounts/admin/${id}/status`, { status })
export const getAdminTransactions = () => client.get<Transaction[]>('/api/transactions/admin/all')
