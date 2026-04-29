import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Eye, EyeOff } from 'lucide-react'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirm: '', firstName: '', lastName: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const passwordsMatch = form.confirm === '' || form.password === form.confirm

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await register(form.email, form.password, form.firstName, form.lastName)
      authLogin(res.data)
      navigate('/dashboard')
    } catch {
      setError('Cet email est déjà utilisé ou les données sont invalides.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1B3A6B] to-[#2D5FC4] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <CreditCard size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">EuroPay</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Rejoignez<br />EuroPay.
          </h1>
          <p className="text-blue-200 text-lg">
            Ouvrez votre compte en quelques secondes.
          </p>
        </div>
        <p className="text-blue-300 text-sm">© 2026 EuroPay — Système bancaire fictif</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Créer un compte</h2>
            <p className="text-slate-500 text-sm">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-[#1B3A6B] font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set('firstName')}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set('lastName')}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="vous@exemple.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Mot de passe
                <span className="text-slate-400 font-normal ml-1">(8 caractères min.)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                  placeholder="••••••••"
                  className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    !passwordsMatch
                      ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
                      : form.confirm && passwordsMatch
                      ? 'border-emerald-400 focus:ring-emerald-300 focus:border-emerald-400'
                      : 'border-slate-200 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-red-500 text-xs mt-1.5">Les mots de passe ne correspondent pas.</p>
              )}
              {form.confirm && passwordsMatch && (
                <p className="text-emerald-600 text-xs mt-1.5">Les mots de passe correspondent.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full bg-[#1B3A6B] hover:bg-[#162f58] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
            >
              {loading ? 'Création...' : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
