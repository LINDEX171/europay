export interface AuthResponse {
  token: string
  userId: string
  email: string
  role: string
  firstName: string
  lastName: string
}

export interface Account {
  id: string
  userId: string
  iban: string
  type: 'COURANT' | 'LIVRET_A'
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  balance: number
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  sourceAccountId: string | null
  targetAccountId: string | null
  type: 'DEPOT' | 'RETRAIT' | 'VIREMENT'
  amount: number
  description: string | null
  status: 'INITIATED' | 'VALIDATED' | 'COMPLETED' | 'FAILED'
  failureReason: string | null
  createdAt: string
}
