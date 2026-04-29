import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Users, CreditCard, ArrowLeftRight, ShieldCheck, Ban, CheckCircle, AlertCircle } from 'lucide-react'
import { getAdminUsers, getAdminAccounts, getAdminTransactions, patchAccountStatus } from '../api/admin'
import type { AdminUser } from '../api/admin'
import type { Account, Transaction } from '../types'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

type Tab = 'users' | 'accounts' | 'transactions'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

const fmtDate = (s: string) =>
  new Date(s).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
  BLOCKED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  VALIDATED: 'bg-blue-50 text-blue-600',
  INITIATED: 'bg-amber-50 text-amber-600',
  FAILED: 'bg-red-50 text-red-500',
  ROLE_ADMIN: 'bg-purple-50 text-purple-700',
  ROLE_USER: 'bg-slate-50 text-slate-600',
}

export default function Admin() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isAdmin) return <Navigate to="/dashboard" replace />

  useEffect(() => {
    setLoading(true)
    setError('')
    const req =
      tab === 'users' ? getAdminUsers().then((r) => setUsers(r.data)) :
      tab === 'accounts' ? getAdminAccounts().then((r) => setAccounts(r.data)) :
      getAdminTransactions().then((r) => setTransactions(r.data))

    req
      .catch(() => setError('Impossible de charger les données. Vérifiez que le service est démarré.'))
      .finally(() => setLoading(false))
  }, [tab])

  const toggleStatus = async (acc: Account) => {
    const next = acc.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    const res = await patchAccountStatus(acc.id, next)
    setAccounts((prev) => prev.map((a) => (a.id === acc.id ? res.data : a)))
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'users', label: 'Utilisateurs', icon: Users },
    { key: 'accounts', label: 'Comptes', icon: CreditCard },
    { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  ]

  return (
    <Layout>
      <div className="px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
            <ShieldCheck size={18} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
            <p className="text-slate-500 text-sm">Vue globale du système</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-50 p-1 rounded-xl w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-[#1B3A6B] rounded-full animate-spin" />
            Chargement...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Users */}
        {!loading && tab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Nom</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Rôle</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Inscription</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className={i !== 0 ? 'border-t border-slate-50' : ''}>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{u.firstName} {u.lastName}</td>
                    <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusColors[u.role]}`}>
                        {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{fmtDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Accounts */}
        {!loading && tab === 'accounts' && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">IBAN</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Solde</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Statut</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a, i) => (
                  <tr key={a.id} className={i !== 0 ? 'border-t border-slate-50' : ''}>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {a.type === 'COURANT' ? 'Compte Courant' : 'Livret A'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">{a.iban}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{fmt(a.balance)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleStatus(a)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                          a.status === 'BLOCKED'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {a.status === 'BLOCKED'
                          ? <><CheckCircle size={13} /> Débloquer</>
                          : <><Ban size={13} /> Bloquer</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions */}
        {!loading && tab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Montant</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Description</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Statut</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx.id} className={i !== 0 ? 'border-t border-slate-50' : ''}>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{tx.type}</td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-slate-900">{fmt(tx.amount)}</td>
                    <td className="px-5 py-3.5 text-slate-400 max-w-xs truncate">{tx.description || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusColors[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{fmtDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
