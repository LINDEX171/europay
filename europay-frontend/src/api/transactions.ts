import client from './client'
import type { Transaction } from '../types'

export const getTransactions = () => client.get<Transaction[]>('/api/transactions')

export const createTransaction = (data: {
  sourceAccountId?: string
  targetAccountId?: string
  type: 'DEPOT' | 'RETRAIT' | 'VIREMENT'
  amount: number
  description?: string
}) => client.post<Transaction>('/api/transactions', data)
