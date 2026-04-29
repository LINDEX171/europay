import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Receipt } from 'lucide-react'
import { getTransactions } from '../api/transactions'
import type { Transaction } from '../types'
import Layout from '../components/Layout'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

const fmtDate = (s: string) =>
  new Date(s).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })

const typeConfig = {
  DEPOT: {
    label: 'Dépôt',
    icon: ArrowDownLeft,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    amountColor: 'text-emerald-600',
    sign: '+',
  },
  RETRAIT: {
    label: 'Retrait',
    icon: ArrowUpRight,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    amountColor: 'text-red-500',
    sign: '-',
  },
  VIREMENT: {
    label: 'Virement',
    icon: ArrowLeftRight,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    amountColor: 'text-slate-900',
    sign: '-',
  },
}

const statusConfig = {
  INITIATED: { label: 'Initié', class: 'bg-amber-50 text-amber-600' },
  VALIDATED: { label: 'Validé', class: 'bg-blue-50 text-blue-600' },
  COMPLETED: { label: 'Complété', class: 'bg-emerald-50 text-emerald-600' },
  FAILED: { label: 'Échoué', class: 'bg-red-50 text-red-500' },
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTransactions()
      .then((res) => setTransactions(res.data))
      .catch(() => setError('Impossible de charger les transactions.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="px-8 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-500 text-sm mt-0.5">Historique de vos opérations</p>
          </div>
          <Link
            to="/transactions/new"
            className="flex items-center gap-2 bg-[#1B3A6B] hover:bg-[#162f58] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus size={16} />
            Nouvelle transaction
          </Link>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-[#1B3A6B] rounded-full animate-spin" />
            Chargement...
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && transactions.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Receipt size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-600 font-medium mb-1">Aucune transaction</p>
            <p className="text-slate-400 text-sm mb-5">Vos opérations apparaîtront ici</p>
            <Link
              to="/transactions/new"
              className="inline-flex items-center gap-2 bg-[#1B3A6B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#162f58] transition-all"
            >
              <Plus size={15} />
              Première transaction
            </Link>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {transactions.map((tx, i) => {
              const config = typeConfig[tx.type]
              const status = statusConfig[tx.status]
              const Icon = config.icon
              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-4 px-6 py-4 ${i !== 0 ? 'border-t border-slate-50' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={config.iconColor} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{config.label}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {tx.failureReason
                        ? <span className="text-red-500">{tx.failureReason}</span>
                        : tx.description || fmtDate(tx.createdAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${status.class}`}>
                    {status.label}
                  </span>

                  {/* Amount */}
                  <p className={`text-sm font-bold tabular-nums ${config.amountColor} min-w-24 text-right`}>
                    {config.sign}{fmt(tx.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
