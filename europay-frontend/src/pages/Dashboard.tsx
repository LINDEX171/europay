import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Wallet, Eye, EyeOff, TrendingUp } from 'lucide-react'
import { getAccounts } from '../api/accounts'
import type { Account } from '../types'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

const typeLabels = { COURANT: 'Compte Courant', LIVRET_A: 'Livret A' }

const statusColorsDark = {
  ACTIVE: 'bg-emerald-100/90 text-emerald-700',
  INACTIVE: 'bg-white/20 text-white/70',
  BLOCKED: 'bg-red-100/90 text-red-600',
}

const statusColorsTeal = {
  ACTIVE: 'bg-white/20 text-white',
  INACTIVE: 'bg-white/10 text-white/60',
  BLOCKED: 'bg-red-900/50 text-red-200',
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

function Chip() {
  return (
    <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
      <rect width="40" height="30" rx="5" fill="#D4A843" opacity="0.95" />
      <rect x="14" y="0" width="12" height="30" fill="#B8892A" opacity="0.4" />
      <rect x="0" y="10" width="40" height="10" fill="#B8892A" opacity="0.4" />
      <rect x="14" y="10" width="12" height="10" fill="#E8C060" opacity="0.6" />
      <rect x="4" y="4" width="6" height="22" rx="1" fill="#C49534" opacity="0.3" />
      <rect x="30" y="4" width="6" height="22" rx="1" fill="#C49534" opacity="0.3" />
    </svg>
  )
}


function NetworkCircles() {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
      <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm -ml-3" />
    </div>
  )
}

function BankCard({ account, holderName }: { account: Account; holderName: string }) {
  const [revealed, setRevealed] = useState(false)
  const cvv = generateCvv(account.id)
  const isLivret = account.type === 'LIVRET_A'

  return (
    <div
      className={`relative rounded-2xl p-5 text-white overflow-hidden shadow-lg ${
        isLivret
          ? 'bg-gradient-to-br from-[#0DAF87] to-[#07896a]'
          : 'bg-gradient-to-br from-[#0D1B2A] to-[#1B3055]'
      }`}
      style={{ width: '100%', maxWidth: 420, aspectRatio: '1.5 / 1', minHeight: 265 }}
    >
      {/* Background orbs */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${isLivret ? 'bg-white/10' : 'bg-white/5'}`} />
      <div className={`absolute -bottom-14 -left-8 w-56 h-56 rounded-full ${isLivret ? 'bg-white/10' : 'bg-white/5'}`} />

      <div className="relative h-full flex flex-col justify-between">

        {/* Row 1 — type + controls */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide text-white/80">
            {typeLabels[account.type]}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed((r) => !r)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              title={revealed ? 'Masquer' : 'Afficher'}
            >
              {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isLivret ? statusColorsTeal[account.status] : statusColorsDark[account.status]}`}>
              {account.status}
            </span>
          </div>
        </div>

        {/* Row 2 — chip */}
        <div>
          <Chip />
        </div>

        {/* Row 3 — balance */}
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Solde disponible</p>
          <p className="text-3xl font-bold tracking-tight">{fmt(account.balance)}</p>
        </div>

        {/* Row 4 — titulaire + IBAN */}
        <div>
          <p className="text-[10px] text-white/45 uppercase tracking-widest mb-0.5">Titulaire</p>
          <p className="text-sm font-semibold tracking-wide text-white/90 uppercase">{holderName}</p>
        </div>

        <p className="text-sm font-mono tracking-[0.18em] text-white/70">
          {revealed ? formatIban(account.iban) : maskIban(account.iban)}
        </p>

        {/* Row 5 — footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-white/45 uppercase tracking-widest mb-0.5">Expiration</p>
            <p className="text-sm font-bold font-mono">{expiryDate(account.createdAt)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/45 uppercase tracking-widest mb-0.5">CVV</p>
            <p className="text-sm font-bold font-mono">{revealed ? cvv : '•••'}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-sm font-bold tracking-widest text-white/60">EUROPAY</p>
            <NetworkCircles />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { firstName, lastName } = useAuth()
  const holderName = `${firstName ?? ''} ${lastName ?? ''}`.trim() || 'EUROPAY'
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
      <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mes comptes</h1>
            <p className="text-slate-400 text-sm mt-0.5">Gérez vos comptes bancaires</p>
          </div>
          {!hasMax && (
            <Link
              to="/accounts/new"
              className="flex items-center gap-2 bg-[#0DAF87] hover:bg-[#0C9E79] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Plus size={16} />
              Nouveau compte
            </Link>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-[#0DAF87] rounded-full animate-spin" />
            Chargement...
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Total balance */}
        {accounts.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E6FAF5] flex items-center justify-center">
              <Wallet size={18} className="text-[#0DAF87]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Solde total</p>
              <p className="text-xl font-bold text-slate-900">{fmt(totalBalance)}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && accounts.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E6FAF5] flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={22} className="text-[#0DAF87]" />
            </div>
            <p className="text-slate-600 font-medium mb-1">Aucun compte bancaire</p>
            <p className="text-slate-400 text-sm mb-5">Ouvrez votre premier compte pour commencer</p>
            <Link
              to="/accounts/new"
              className="inline-flex items-center gap-2 bg-[#0DAF87] hover:bg-[#0C9E79] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              <Plus size={15} />
              Ouvrir un compte
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {accounts.map((acc) => (
            <BankCard key={acc.id} account={acc} holderName={holderName} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
