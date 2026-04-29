import client from './client'
import type { Account } from '../types'

export const getAccounts = () => client.get<Account[]>('/api/accounts')

export const createAccount = (type: 'COURANT' | 'LIVRET_A') =>
  client.post<Account>('/api/accounts', { type })
