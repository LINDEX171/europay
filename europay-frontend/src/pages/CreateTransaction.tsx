import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import { getAccounts } from '../api/accounts'
import { createTransaction } from '../api/transactions'
import type { Account } from '../types'
import Layout from '../components/Layout'

type TxType = 'DEPOT' | 'RETRAIT' | 'VIREMENT'

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

const txTypes: { value: TxType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'DEPOT', label: 'Dépôt', icon: ArrowDownLeft, description: 'Créditer un compte' },
  { value: 'RETRAIT', label: 'Retrait', icon: ArrowUpRight, description: 'Débiter un compte' },
  { value: 'VIREMENT', label: 'Virement', icon: ArrowLeftRight, description: 'Transfert entre comptes' },
]

export default function CreateTransaction() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [type, setType] = useState<TxType>('DEPOT')
  const [sourceAccountId, setSourceAccountId] = useState('')
  const [targetAccountId, setTargetAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAccounts().then((res) => setAccounts(res.data.filter((a) => a.status === 'ACTIVE')))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createTransaction({
        type,
        amount: parseFloat(amount),
        sourceAccountId: type !== 'DEPOT' ? sourceAccountId : undefined,
        targetAccountId: type !== 'RETRAIT' ? targetAccountId : undefined,
        description: description || undefined,
      })
      navigate('/transactions')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la transaction.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="px-8 py-8 max-w-lg">
        <button
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Nouvelle transaction</h1>
        <p className="text-slate-500 text-sm mb-8">Effectuez une opération sur vos comptes</p>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type d'opération</label>
            <div className="grid grid-cols-3 gap-2">
              {txTypes.map(({ value, label, icon: Icon, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    type === value
                      ? 'border-[#1B3A6B] bg-[#1B3A6B]/5'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon size={18} className={type === value ? 'text-[#1B3A6B] mb-2' : 'text-slate-400 mb-2'} />
                  <p className={`text-xs font-semibold ${type === value ? 'text-[#1B3A6B]' : 'text-slate-700'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Compte source */}
          {(type === 'RETRAIT' || type === 'VIREMENT') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Compte source</label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all bg-white"
              >
                <option value="">Sélectionner un compte</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.type === 'COURANT' ? 'Courant' : 'Livret A'} — {fmt(a.balance)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Compte cible */}
          {(type === 'DEPOT' || type === 'VIREMENT') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {type === 'DEPOT' ? 'Compte à créditer' : 'Compte destinataire'}
              </label>
              {type === 'DEPOT' ? (
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all bg-white"
                >
                  <option value="">Sélectionner un compte</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.type === 'COURANT' ? 'Courant' : 'Professionnel'} — {a.iban.slice(-8)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  required
                  placeholder="ID du compte destinataire"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
                />
              )}
            </div>
          )}

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Montant</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">€</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="0,00"
                className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
              <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : loyer, courses, salaire..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3A6B] hover:bg-[#162f58] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            {loading ? 'Traitement...' : 'Valider la transaction'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
