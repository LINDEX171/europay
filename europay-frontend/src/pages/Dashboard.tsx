import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Wallet, Eye, EyeOff } from 'lucide-react'
import { getAccounts } from '../api/accounts'
import type { Account } from '../types'
import Layout from '../components/Layout'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

const typeLabels = { COURANT: 'Compte Courant', LIVRET_A: 'Livret A' }

const statusColors = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
  BLOCKED: 'bg-red-100 text-red-600',
}

function maskIban(iban: string) {
  const groups = iban.replace(/(.{4})/g, '$1 ').trim().split(' ')
  return groups.map((g, i) => (i === 0 || i === groups.length - 1 ? g : '••••')).join('  ')
}

function formatIban(iban: string) {
  return iban.replace(/(.{4})/g, '$1 ').trim()
}

function expiryDate(createdAt: string) {
  const d = new Date(createdAt)
  d.setFullYear(d.getFullYear() + 3)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`
}

function generateCvv(id: string): string {
  let hash = 0
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  return String((hash % 900) + 100)
}

function BankCard({ account }: { account: Account }) {
  const [revealed, setRevealed] = useState(false)
  const cvv = generateCvv(account.id)

  return (
    <div className="relative bg-gradient-to-br from-[#1B3A6B] to-[#2D5FC4] rounded-2xl p-7 text-white overflow-hidden" style={{ minHeight: 200 }}>
      <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide text-blue-100">{typeLabels[account.type]}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed((r) => !r)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              title={revealed ? 'Masquer les détails' : 'Afficher les détails'}
            >
              {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[account.status]}`}>
              {account.status}
            </span>
          </div>
        </div>

        {/* Solde */}
        <div>
          <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Solde disponible</p>
          <p className="text-3xl font-bold tracking-tight">{fmt(account.balance)}</p>
        </div>

        {/* IBAN */}
        <p className="text-sm font-mono tracking-widest text-blue-100">
          {revealed ? formatIban(account.iban) : maskIban(account.iban)}
        </p>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-0.5">Expire fin</p>
            <p className="text-sm font-semibold font-mono">{expiryDate(account.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-0.5">CVV</p>
            <p className="text-sm font-semibold font-mono">{revealed ? cvv : '•••'}</p>
          </div>
          <p className="text-lg font-bold tracking-widest opacity-80">EUROPAY</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAccounts()
      .then((res) => setAccounts(res.data))
      .catch(() => setError('Impossible de charger les comptes.'))
      .finally(() => setLoading(false))
  }, [])

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const hasMax = accounts.length >= 2

  return (
    <Layout>
      <div className="px-8 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mes comptes</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gérez vos comptes bancaires</p>
          </div>
          {!hasMax && (
            <Link
              to="/accounts/new"
              className="flex items-center gap-2 bg-[#1B3A6B] hover:bg-[#162f58] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Plus size={16} />
              Nouveau compte
            </Link>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-[#1B3A6B] rounded-full animate-spin" />
            Chargement...
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Total balance */}
        {accounts.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Wallet size={18} className="text-[#1B3A6B]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Solde total</p>
              <p className="text-xl font-bold text-slate-900">{fmt(totalBalance)}</p>
            </div>
          </div>
        )}

        {/* Cartes bancaires */}
        {!loading && !error && accounts.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-600 font-medium mb-1">Aucun compte bancaire</p>
            <p className="text-slate-400 text-sm mb-5">Ouvrez votre premier compte pour commencer</p>
            <Link
              to="/accounts/new"
              className="inline-flex items-center gap-2 bg-[#1B3A6B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#162f58] transition-all"
            >
              <Plus size={15} />
              Ouvrir un compte
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {accounts.map((acc) => (
            <BankCard key={acc.id} account={acc} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
