import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { createAccount, getAccounts } from '../api/accounts'
import type { Account } from '../types'
import Layout from '../components/Layout'

const types = [
  {
    value: 'COURANT' as const,
    label: 'Compte Courant',
    description: 'Usage quotidien · Virements & paiements',
  },
  {
    value: 'LIVRET_A' as const,
    label: 'Livret A',
    description: 'Épargne réglementée · Taux 3% · Plafond 22 950 €',
  },
]

export default function CreateAccount() {
  const navigate = useNavigate()
  const [existing, setExisting] = useState<Account[]>([])
  const [type, setType] = useState<'COURANT' | 'LIVRET_A'>('COURANT')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAccounts().then((res) => {
      setExisting(res.data)
      const hasCourant = res.data.some((a) => a.type === 'COURANT')
      if (hasCourant) setType('LIVRET_A')
    })
  }, [])

  const hasType = (t: 'COURANT' | 'LIVRET_A') => existing.some((a) => a.type === t)
  const allTaken = hasType('COURANT') && hasType('LIVRET_A')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createAccount(type)
      navigate('/dashboard')
    } catch {
      setError('Erreur lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="px-8 py-8 max-w-lg">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Nouveau compte</h1>
        <p className="text-slate-500 text-sm mb-8">Choisissez le type de compte à ouvrir</p>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {allTaken ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <p className="text-slate-600 font-medium mb-1">Comptes maximum atteints</p>
            <p className="text-slate-400 text-sm mb-5">Vous possédez déjà un compte Courant et un compte Professionnel.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-[#1B3A6B] font-medium hover:underline"
            >
              Retour au dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {types.map(({ value, label, description }) => {
              const taken = hasType(value)
              const selected = type === value
              return (
                <button
                  key={value}
                  type="button"
                  disabled={taken}
                  onClick={() => setType(value)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                    taken
                      ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                      : selected
                      ? 'border-[#1B3A6B] bg-[#1B3A6B]/5'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold text-sm ${selected && !taken ? 'text-[#1B3A6B]' : 'text-slate-800'}`}>
                        {label}
                        {taken && <span className="ml-2 text-xs font-normal text-slate-400">Déjà possédé</span>}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                    </div>
                    {selected && !taken && (
                      <div className="w-5 h-5 rounded-full bg-[#1B3A6B] flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            <button
              type="submit"
              disabled={loading || hasType(type)}
              className="w-full bg-[#1B3A6B] hover:bg-[#162f58] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
            >
              {loading ? 'Création en cours...' : 'Ouvrir le compte'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  )
}
