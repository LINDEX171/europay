import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Landmark, PiggyBank } from 'lucide-react'
import { createAccount, getAccounts } from '../api/accounts'
import type { Account } from '../types'
import Layout from '../components/Layout'

const types = [
  {
    value: 'COURANT' as const,
    label: 'Compte Courant',
    icon: Landmark,
    description: 'Usage quotidien · Virements & paiements illimités',
    badge: 'Essentiel',
  },
  {
    value: 'LIVRET_A' as const,
    label: 'Livret A',
    icon: PiggyBank,
    description: 'Épargne réglementée · Taux 3% · Plafond 22 950 €',
    badge: 'Épargne',
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
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-lg">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-7 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Nouveau compte</h1>
        <p className="text-slate-400 text-sm mb-8">Choisissez le type de compte à ouvrir</p>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {allTaken ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E6FAF5] flex items-center justify-center mx-auto mb-4">
              <Check size={20} className="text-[#0DAF87]" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">Comptes maximum atteints</p>
            <p className="text-slate-400 text-sm mb-5">Vous possédez déjà un Compte Courant et un Livret A.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-[#0DAF87] font-semibold hover:underline"
            >
              Retour au tableau de bord
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {types.map(({ value, label, icon: Icon, description, badge }) => {
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
                      ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                      : selected
                      ? 'border-[#0DAF87] bg-[#F0FDF9]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selected && !taken ? 'bg-[#0DAF87]' : 'bg-slate-100'
                      }`}>
                        <Icon size={16} className={selected && !taken ? 'text-white' : 'text-slate-400'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`font-semibold text-sm ${selected && !taken ? 'text-[#0DAF87]' : 'text-slate-800'}`}>
                            {label}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selected && !taken
                              ? 'bg-[#0DAF87]/10 text-[#0DAF87]'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {taken ? 'Déjà possédé' : badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
                      </div>
                    </div>
                    {selected && !taken && (
                      <div className="w-5 h-5 rounded-full bg-[#0DAF87] flex items-center justify-center flex-shrink-0 mt-1">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            <button
              type="submit"
              disabled={loading || hasType(type)}
              className="w-full bg-[#0DAF87] hover:bg-[#0C9E79] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
            >
              {loading ? 'Création en cours...' : 'Ouvrir le compte'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  )
}
