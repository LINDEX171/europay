import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Zap, BarChart3 } from 'lucide-react'
import Logo from '../components/Logo'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const perks = [
  { icon: ShieldCheck, text: 'Sécurité bancaire de niveau enterprise' },
  { icon: Zap, text: 'Virements instantanés 24h/24' },
  { icon: BarChart3, text: 'Suivi en temps réel de vos finances' },
]

export default function Login() {
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      authLogin(res.data)
      navigate('/dashboard')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">

      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#0DAF87] to-[#0a9070] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute bottom-40 right-10 w-24 h-24 rounded-full bg-white/10" />

        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors z-10">
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>

        <div className="z-10">
          <div className="mb-8">
            <Logo size={30} textColor="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Bon retour<br />parmi nous.
          </h1>
          <p className="text-white/70 text-lg mb-10">
            Gérez vos comptes et transactions en toute sécurité.
          </p>

          <div className="space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs z-10">© 2026 EuroPay - Système bancaire fictif</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Logo size={24} />
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
              <ArrowLeft size={14} /> Accueil
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Connexion</h2>
            <p className="text-slate-500 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-[#0DAF87] font-semibold hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0DAF87]/30 focus:border-[#0DAF87] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0DAF87] hover:bg-[#0C9E79] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
