import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const benefits = [
  'Compte Courant & Livret A inclus',
  'Virements instantanés sans frais',
  'Audit et historique complet',
  'Sécurité JWT & chiffrement',
]

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
    <div className="min-h-screen flex font-['Inter',sans-serif]">

      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#0DAF87] to-[#0a9070] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute bottom-24 -left-8 w-44 h-44 rounded-full bg-white/10" />
        <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-white/10" />

        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors z-10">
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>

        <div className="z-10">
          <div className="mb-8">
            <Logo size={30} textColor="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Ouvrez votre<br />compte en 1 min.
          </h1>
          <p className="text-white/70 text-lg mb-10">
            Gratuit, sécurisé et sans paperasse.
          </p>

          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 text-white/90 text-sm">
                <CheckCircle2 size={16} className="text-white flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs z-10">© 2026 EuroPay - Système bancaire fictif</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Logo size={24} />
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
              <ArrowLeft size={14} /> Accueil
            </Link>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Créer un compte</h2>
            <p className="text-slate-500 text-sm">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-[#0DAF87] font-semibold hover:underline">
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
                  placeholder="Jean"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set('lastName')}
                  required
                  placeholder="Dupont"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="vous@exemple.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87] transition-all"
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87] transition-all"
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
                      ? 'border-emerald-400 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87]'
                      : 'border-slate-200 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87]'
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
                <p className="text-[#0DAF87] text-xs mt-1.5">Les mots de passe correspondent.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full bg-[#0DAF87] hover:bg-[#0C9E79] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1"
            >
              {loading ? 'Création du compte...' : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
